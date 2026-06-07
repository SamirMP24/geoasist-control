const express = require("express");
const router = express.Router();

const { register, login, getUsers } = require("../controllers/authController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.post("/register", verifyToken, verifyAdmin, register);
router.post("/login", login);
router.get("/users", verifyToken, verifyAdmin, getUsers);

module.exports = router;