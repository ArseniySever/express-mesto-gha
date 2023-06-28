const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../models/user');
const { ConflictError } = require('../error/ConflictError');
const { ValidationError } = require('../error/ValidationError');
const { NotFoundError } = require('../error/NotFoundError');
const { UnauthorizedError } = require('../error/UnauthorizedError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        return next(new NotFoundError('User not found'));
      }
      return res.send({ data: users });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { id } = req.user._id;

  User.findById(id)
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
        next(err);
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
          res.status(201).send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
          });
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
  const { name, about } = req.body;
  const { userId } = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) return res.send({ user });
      throw new NotFoundError('Incorrect data');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new NotFoundError('Incorrect data'));
      } else {
        next(err);
      }
    });
};

const resumeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { userId } = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('User not found'));
      } res.send(user.avatar);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotFoundError('Incorrect data');
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (user === null) {
        throw new UnauthorizedError('Incorrect data');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            Promise.reject(new UnauthorizedError('Incorrect data'));
          } else {
            res.send({
              token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
            });
          }
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new UnauthorizedError('UNAUTHORIZED');
      } else {
        next(new UnauthorizedError('Server Error'));
      }
    });
};

const resumeNowProfile = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Invalid id');
      } else {
        next(err);
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
