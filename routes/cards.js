const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  deleteCardsById,
  createCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { imgConst } = require('../utils/constants');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.required().pattern(imgConst),
  }),
}), createCards);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCardsById);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

module.exports = router;
