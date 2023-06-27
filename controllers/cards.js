const { Card } = require('../models/card');

const { ValidationError } = require('../error/ValidationError');
const { ForbiddenError } = require('../error/ForbiddenError');
const { NotFoundError } = require('../error/NotFoundError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

const createCards = (req, res, next) => {
  const { name, link } = req.body;
  const { userId } = req.user;
  Card.create({ name, link, owner: userId })
    .then((card) => res
      .send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ValidationError('Server Error'));
      } else {
        next(err);
      }
    });
};

const deleteCardsById = (req, res, next) => {
  try {
    const cardId = req.params;
    const card = Card.findById(cardId).populate('owner');
    if (!card) {
      throw new NotFoundError('Card not found');
    }
    const ownerId = card.owner;
    const userId = req.user;
    if (ownerId !== userId) {
      throw new ForbiddenError('You cant delete not your card');
    }
    Card.findByIdAndRemove(cardId)
      .then(() => res.send({ data: card }))
      .catch(next);
  } catch (err) {
    next(err);
  }
};

const likeCard = (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = Card.findByIdAndUpdate(
      req.params,
      { $addToSet: { likes: cardId } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Card not found');
    }
    res.send({ data: card });
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ValidationError('Invalid id'));
      return;
    }
    next(err);
  }
};

const dislikeCard = (req, res, next) => {
  try {
    const userId = req.params;
    const card = Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Card not found');
    }
    res.send({ data: card });
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ValidationError('Invalid id'));
      return;
    }
    next(err);
  }
};

module.exports = {
  getCards,
  deleteCardsById,
  createCards,
  likeCard,
  dislikeCard,
};
