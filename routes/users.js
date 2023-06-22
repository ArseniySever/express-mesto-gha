const router = require('express').Router();
const {
  getUsers,
  getUserById,
  resumeProfile,
  resumeAvatar,
  resumeNowProfile,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.patch('/me', resumeProfile);

router.get('/me', resumeNowProfile);

router.patch('/me/avatar', resumeAvatar);

module.exports = router;
