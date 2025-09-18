const bcrypt = require("bcryptjs");
const User = require("../model/userModel");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenGenerator");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
module.exports = login;
