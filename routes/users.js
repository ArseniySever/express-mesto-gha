const router = require("express").Router();
const {
  getUsers,
  getUserById,
  createUser,
  resumeProfile,
  resumeAvatar,
} = require("../controllers/users");

router.get("/", getUsers);

router.get("/:userId", getUserById);

router.post("/", createUser);

router.patch("/me", resumeProfile);

router.patch("/me/avatar", resumeAvatar);

module.exports = router;
