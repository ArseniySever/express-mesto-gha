const { Card } = require('../models/card');

const { ValidationError } = require('../error/ValidationError');
const { ForbiddenError } = require('../error/ForbiddenError');
const { NotFoundError } = require('../error/NotFoundError');

function getCards(req, res, next) {
  try {
    const cards = Card.find({});
    res.send({ data: cards });
  } catch (err) {
    next(err);
  }
}

const createCards = (req, res, next) => {
  try {
    const { name, link } = req.body;
    const { _id } = req.user._id;
    const card = Card.create({ name, link, owner: _id });
    res.send({ data: card });
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ValidationError('Server Error'));
      return;
    }
    next(err);
  }
};

const deleteCardsById = (req, res, next) => {
  try {
    const { cardId } = req.card._id;
    const card = Card.findById(cardId).populate('owner');
    if (!card) {
      throw new NotFoundError('Card not found');
    }
    const ownerId = card.owner.id;
    const userId = req.user._id;
    if (ownerId !== userId) {
      throw new ForbiddenError('You cant delete not your card');
    }
    Card.findByIdAndRemove(cardId);
    res.send({ data: card });
  } catch (err) {
    next(err);
  }
};

const likeCard = (req, res, next) => {
  try {
    const cardId = req.card._id;
    const card = Card.findByIdAndUpdate(
      req.params.cardId,
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
    const userId = req.user._id;
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
