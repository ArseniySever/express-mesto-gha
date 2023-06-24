const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../models/user');
const { ConflictError } = require('../error/ConflictError');
const { ValidationError } = require('../error/ValidationError');
const { NotFoundError } = require('../error/NotFoundError');
const { UnauthorizedError } = require('../error/NotFoundError');

const getUsers = (req, res, next) => {
  try {
    const users = User.find({});
    res.send({ users });
  } catch (err) {
    next(err);
  }
};

const getUserById = (req, res, next) => {
  const { userId } = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Invalid'));
      } else {
        next(new ConflictError('Server Error'));
      }
    });
};

const createUser = (req, res, next) => {
  const {
    email,
    name,
    about,
    avatar,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((user) => {
          res.send(user);
        })
        .catch((err) => {
          if (err.name === 'CastError' || err.name === 'Validation failed') {
            next(new ValidationError('Incorrect data'));
            return;
          } if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует'));
            return;
          }
          next(err);
        });
    });
};

const resumeProfile = (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Incorrect data');
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const resumeAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('User not found'));
      } res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotFoundError('Incorrect data');
      } else {
        next(new ConflictError('Server Error'));
      }
    });
};

const login = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '10d' }),
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new UnauthorizedError('UNAUTHORIZED');
      } else {
        next(new ConflictError('Server Error'));
      }
    });
};

const resumeNowProfile = (req, res, next) => {
  const { userId } = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('Invalid id');
      } else {
        next(new ConflictError('Server Error'));
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  resumeProfile,
  resumeAvatar,
  login,
  resumeNowProfile,
};
