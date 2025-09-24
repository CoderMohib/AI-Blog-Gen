const User = require("../model/userModel");
const { generateAccessToken } = require("../utils/jwtTokenGenerator");

const refreshToken = async (req, res) => {
  const decoded = req.decoded; // comes from verifyRefreshToken

  try {
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create new access token
    const newAccessToken = generateAccessToken(user);

    res.json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

module.exports = refreshToken;
