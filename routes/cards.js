const router = require('express').Router();
const {
  getCards,
  deleteCardsById,
  createCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCards);

router.delete('/:cardId', deleteCardsById);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
