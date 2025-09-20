const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwtTokenGenerator");

const login = async (req, res) => {
  try {
    const { password } = req.body;
    const user = req.user; // from middleware

    // 1. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

module.exports = login;
