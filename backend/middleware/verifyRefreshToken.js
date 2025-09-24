const jwt = require("jsonwebtoken");

const verifyRefreshToken = (req, res, next) => {
  // 👇 get token from cookie instead of body
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH);
    req.decoded = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

module.exports = verifyRefreshToken;
