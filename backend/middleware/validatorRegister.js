// middleware/validateRegister.js
const User = require("../model/userModel");

const validateRegister = async (req, res, next) => {
  const { fullName, username, email, password, confirmPassword, phone } = req.body;

  if (!fullName || !username || !email || !password || !confirmPassword || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }, { phone }] });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists with these credentials" });
  }

  next(); // pass control to controller
};

module.exports = validateRegister;
