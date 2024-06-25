const express = require("express");
const {
  register,
  login,
  // updateLanguage,
  sendOtpForLanguageChange,
  verifyOtpForLanguageChange,
} = require("../Controller/authController");
const { protect } = require("../Middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.put("/language", protect, updateLanguage);
router.post("/otp/request", protect, sendOtpForLanguageChange);
router.post("/otp/verify", protect, verifyOtpForLanguageChange);

module.exports = router;
