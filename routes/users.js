const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  resumeProfile,
  resumeAvatar,
  resumeNowProfile,
} = require('../controllers/users');
const { imgConst } = require('../utils/constants');

router.get('/', getUsers);

router.get('/:userId', celebrate({
  body: Joi.object().keys({
    id: Joi.string().alphanum().length(24).regex(/[a-z0-9]/i),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), resumeProfile);

router.get('/me', resumeNowProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(imgConst),
  }),
}), resumeAvatar);

module.exports = router;
