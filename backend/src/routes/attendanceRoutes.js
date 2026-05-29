const express = require("express");

const router = express.Router();

const {
  registerAttendance,
  getAttendances
} = require("../controllers/attendanceController");

const verifyToken = require("../middleware/authMiddleware");

router.post(
  "/register",
  verifyToken,
  registerAttendance
);

router.get(
  "/all",
  verifyToken,
  getAttendances
);

module.exports = router;