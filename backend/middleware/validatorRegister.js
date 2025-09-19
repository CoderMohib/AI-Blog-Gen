// middleware/validateRegister.js
const User = require("../model/userModel");

const validateRegister = async (req, res, next) => {
  const { fullName, username, email, password, confirmPassword, phone } =
    req.body;

  if (
    !fullName ||
    !username ||
    !email ||
    !password ||
    !confirmPassword ||
    !phone
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }, { phone }],
  }).lean();

  if (existingUser) {
    const messages = [];
    if (existingUser.email === email)
      messages.push("Email is already registered");
    if (existingUser.username === username)
      messages.push("Username is already taken");
    if (existingUser.phone === phone)
      messages.push("Phone number is already registered");

    return res.status(409).json({ message: messages.join(", ") });
  }

  next(); // pass control to controller
};

module.exports = validateRegister;
