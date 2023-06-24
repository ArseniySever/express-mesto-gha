const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { ConflictError } = require('../error/ConflictError');
const { ValidationError } = require('../error/ValidationError');
const { NotFoundError } = require('../error/NotFoundError');
const { UnauthorizedError } = require('../error/NotFoundError');

const SALT_LENGTH = 10;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Invalid'));
        return;
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  const passwordHash = bcrypt.hash(password, SALT_LENGTH);

  return User.create({
    email,
    password,
    name,
    about,
    avatar,
  })
    .then((user) => {
      res.send({
        email: user.email,
        password: passwordHash,
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Server Error'));
      } else {
        next(new ConflictError('Server Error'));
      }
    });
};

const resumeProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotFoundError('Incorrect data');
      } else {
        next(err);
      }
    });
};
const resumeAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({ data: user });
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
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return res.send({ data: user });
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
