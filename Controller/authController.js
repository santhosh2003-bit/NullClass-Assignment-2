const User = require("../Model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { error } = require("console");

dotenv.config();
console.log("ENV VARIABLES" + process.env.GMAIL);
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.json({ token, user });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// const updateLanguage = async (req, res) => {
//   const { language } = req.body;
//   const user = req.user;

//   try {
//     user.language = language;
//     await user.save();

//     res.json({ message: "Language updated successfully", language });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOtpForLanguageChange = async (req, res) => {
  const { email } = req.body;
  const user = req.user;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!user) {
    return res.status(400).json({ message: "User Not Exists In Our Database" });
  }
  try {
    const otp = generateOtp();

    const transport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL || "chintuboda870@gmail.com",
      to: email || "santhoshchintu534@gmail.com",
      subject: "OTP for language change",
      text: `Your OTP is ${otp}`,
    };

    transport.sendMail(mailOptions, async (err, info) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      } else {
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
        await user.save();
        res.status(200).json({ message: "OTP sent successfully" });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

const verifyOtpForLanguageChange = async (req, res) => {
  const { otp, language } = req.body;
  const user = req.user;
  if (!otp) {
    return res.status(400).json({ error: "OTP is required" });
  }
  try {
    if (user.otp === otp && user.otpExpires > Date.now()) {
      user.language = language;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      res.json({ message: "Language updated successfully", language });
    } else {
      res.status(400).json({ error: "Invalid or expired OTP" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", error: error.message });
  }
};

module.exports = {
  register,
  login,
  // updateLanguage,
  sendOtpForLanguageChange,
  verifyOtpForLanguageChange,
};
