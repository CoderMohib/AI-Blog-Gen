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
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // ❌ not accessible from JS
      secure: process.env.NODE_ENV === "production", // ✅ only over HTTPS in prod
      sameSite: "strict", // ✅ CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });
    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        phone: user.phone,
        profileImage: user.profileImage,
        // add only what you want frontend to have
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

module.exports = login;
