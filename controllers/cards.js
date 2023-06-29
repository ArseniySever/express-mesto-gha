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
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
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
    const { cardId } = req.params;
    Card.findById(cardId)
      .populate('owner')
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Card not found');
        }
        const ownerId = card.owner.id;
        const userId = req.user._id;
        if (ownerId !== userId) {
          throw new ForbiddenError('You cant delete not your card');
        }
        Card.findByIdAndRemove(cardId)
          .then(() => res.send({ data: card }))
          .catch((err) => {
            next(err);
          });
      });
  } catch (err) {
    next(err);
  }
};

const likeCard = (req, res, next) => {
  try {
    const { userId } = req.params;
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Card not found');
        }
        res.send({ data: card });
      });
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
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Card not found');
        }
        res.send({ data: card });
      });
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
