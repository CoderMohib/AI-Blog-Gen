const User = require("../model/userModel");
const { sendEmail } = require("../utils/smtp");
const crypto = require("crypto");
const register = async (req, res) => {
  try {
    const { fullName, username, email, password, phone } = req.body;

    const activationToken = crypto.randomBytes(32).toString("hex");
    const newUser = new User({
      fullName,
      username,
      email,
      password,
      activationToken,
      phone,
    });

    await newUser.save();
    const activationLink = `${process.env.FRONTEND_URL}/api/auth/activate/${activationToken}`;
    await sendEmail(
      email,
      "Activate your AI Blog Generator account",
      "activation.html",
      { username, activationLink }
    );
    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

module.exports = register;
