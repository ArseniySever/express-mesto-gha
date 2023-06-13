const User = require('../models/user');

const ERROR_CODE_DEFAULT = 500;
const ERROR_CODE = 400;
const ERROR_CODE_CONNECTION = 404;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(ERROR_CODE_DEFAULT).send({ message: 'Server Error' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_CODE_CONNECTION)
          .send({ message: 'User not found' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Invalid id' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Server Error' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Server Error' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Server Error' });
      }
    });
};

const resumeProfile = (req, res) => {
  const { userId } = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Incorrect data' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Server Error' });
      }
    });
};
const resumeAvatar = (req, res) => {
  const { userId } = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    { userId },
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Incorrect data' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Server Error' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  resumeProfile,
  resumeAvatar,
};
