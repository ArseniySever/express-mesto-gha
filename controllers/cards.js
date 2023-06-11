const Card = require("../models/card");

const getCards = (req, res) => {
  return Card.find({}).then((cards) => {
    return res.status(200).send(cards);
  });
};
const createCards = (req, res) => {
  const newCardData = req.body;
  return Card.create(newCardData)
    .then((newCard) => {
      return res.status(201).send(newCard);
    })
    .catch((err) => {
      if (err.card === "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((err) => err.message)
            .join(", ")}`,
        });
      }
      return res.status(500).send({ message: "Server Error" });
    });
};
const deleteCardsById = (req, res) => {
  const { id } = req.params;

  return User.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Card not found" });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      return res.status(500).send({ message: "Server Error" });
    });
};

const likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );

const dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  );

module.exports = {
  getCards,
  deleteCardsById,
  createCards,
  likeCard,
  dislikeCard,
};
