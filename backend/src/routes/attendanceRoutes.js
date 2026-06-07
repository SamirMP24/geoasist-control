const express = require("express");
const router = express.Router();

const { registerAttendance, getAttendances } = require("../controllers/attendanceController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.post("/register", verifyToken, registerAttendance);
router.get("/all", verifyToken, verifyAdmin, getAttendances);

module.exports = router;