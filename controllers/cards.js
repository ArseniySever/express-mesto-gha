const Card = require('../models/card');

const { ValidationError } = require('../error/ValidationError');
const { ForbiddenError } = require('../error/ForbiddenError');
const { NotFoundError } = require('../error/NotFoundError');

function getCards(req, res, next) {
  return Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      next(err);
    });
}

const createCards = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  return Card.create({ name, link, owner: _id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Server Error'));
      } else {
        next(err);
      }
    });
};

const deleteCardsById = (req, res, next) => {
  const { cardId } = req.params;
  const card = Card.findById(cardId).populate('owner');
  const ownerId = card.owner.id;
  const userId = req.user._id;
  if (ownerId !== userId) {
    throw new ForbiddenError('You cant delete not your card');
  } else {
    Card.findByIdAndRemove(cardId)
      .then((cards) => {
        if (!cards) {
          throw new NotFoundError('Card not found');
        }
        res.send({ data: card });
      })
      .catch((err) => {
        next(err);
      });
  }
};

const likeCard = (req, res, next) => {
  const cardId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: cardId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Invalid id'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Invalid id'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  deleteCardsById,
  createCards,
  likeCard,
  dislikeCard,
};
