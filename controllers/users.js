const User = require("../models/user");
const ERROR_CODE_DEFAULT = 500;
const ERROR_CODE = 400;
const ERROR_CODE_CONNECTION = 404;

const getUsers = (req, res) => {
  return User.find({})
  .then((users) => {
    return res.send(users);
  })
  .catch((err) => {
      return res.status(ERROR_CODE_DEFAULT).send({ message: "Server Error" });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

   User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_CONNECTION).send({ message: "User not found" });
      }
      return res.send({user});
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: "Invalid id" });
      }else{
        return res.status(ERROR_CODE_DEFAULT).send({ message: "Server Error" });
      }
      });
};

const createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  return User.create({name, about, avatar})
    .then((user) => {
      return res.send({ name, about, avatar, _id,});
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: "Server Error" });
      }else{
        return res.status(ERROR_CODE_DEFAULT).send({ message: "Server Error" });
      }

    });
};

const resumeProfile = (req, res) => {
  const { userId } = req.user._id;
   User.findByIdAndUpdate(userId,{name: req.body.name, about: req.body.about}, {new: true, runValidators: true })
    .then((user) => {return res.send( {user})})
    .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_CODE_DEFAULT).send({ message: "Incorrect data" });    }
    });
};
const resumeAvatar = (req, res) => {
  const { userId } = req.user._id;
  User.findByIdAndUpdate(userId, { avatar: req.body.avatar }, {new: true,  runValidators: true})
    .then((user) => { return res.send({user})})
    .catch((err) => {if (err.name === 'ValidationError') {
      return res.status(ERROR_CODE_DEFAULT).send({ message: "Incorrect data" });    }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  resumeProfile,
  resumeAvatar,
};
