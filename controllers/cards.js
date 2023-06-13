const Card = require('../models/card');

const ERROR_CODE_DEFAULT = 500;
const ERROR_CODE = 400;
const ERROR_CODE_CONNECTION = 404;

function getCards(req, res) {
  return Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res.status(ERROR_CODE_DEFAULT).send({ message: 'Server Error' });
    });
}

const createCards = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  return Card.create({ name, link, owner: _id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Server Error' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Server Error' });
      }
    });
};

const deleteCardsById = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndRemove({ cardId })
    .then((card) => {
      if (!card) {
        res
          .status(ERROR_CODE_CONNECTION)
          .send({ message: 'Card not found' });
      }
      card.then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_CONNECTION).send({ message: 'Invalid id' });
      } else {
        res.status(ERROR_CODE).send({ message: 'Server Error' });
      }
    });
};

const likeCard = (req, res) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(ERROR_CODE_CONNECTION)
          .send({ message: 'Card not found' });
      }
      card.then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Invalid id' });
      } else {
        res
          .status(ERROR_CODE_CONNECTION)
          .send({ message: 'Server Error' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(ERROR_CODE_CONNECTION)
          .send({ message: 'Card not found' });
      }
      card.then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Invalid id' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Server Error' });
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
