const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  resumeProfile,
  resumeAvatar,
  resumeNowProfile,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', celebrate({
  body: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }).unknown(true),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), resumeProfile);

router.get('/me', resumeNowProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i,
    ),
  }).unknown(true),
}), resumeAvatar);

module.exports = router;
