const Card = require("../models/card");
const ERROR_CODE_DEFAULT = 500;
const ERROR_CODE = 400;
const ERROR_CODE_CONNECTION = 400;

const getCards = (req, res) => {
  return Card.find({})
  .then((cards) => {
    return res.status(200).send({ data: cards });
    })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_DEFAULT).send({ message: "Server Error" });    }
    });
};

const createCards = (req, res) => {
  const { name, link } = req.body;
  const { cardId } = req.user;
  return Card.create({ name, link, owner: cardId })
    .then((card) => {
      return res.status(201).send({data: card});
    })
    .catch((err) => {
        return res.status(ERROR_CODE).send({
          message: `${Object.values(err.errors)
            .map((err) => err.message)
            .join(", ")}`,
        });
    });
}

const deleteCardsById = (req, res) => {
  const { cardId } = req.params;
  return User.findByIdAndRemove({cardId})
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_CONNECTION).send({ message: "Card not found" });
      }
      card
        .remove()
        .then(() => res.send({ data: card }))
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: "Server Error" });    }
      });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
    )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_CONNECTION).send({ message: "Card not found" });
      }
      card
        .then(() => res.send(card))
    })
      .catch((err) => {
        if (err.name === 'CastError') {
          return res.status(ERROR_CODE).send({ message: "Server Error" });    }
        });
  };

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
    )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_CONNECTION).send({ message: "Card not found" });
      }
      card
        .then(() => res.remove(card))
    })
      .catch((err) => {
        if (err.name === 'CastError') {
          return res.status(ERROR_CODE).send({ message: "Server Error" });    }
        });
  };

module.exports = {
  getCards,
  deleteCardsById,
  createCards,
  likeCard,
  dislikeCard,
};
