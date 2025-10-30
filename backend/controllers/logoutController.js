const logout = async (req, res) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Logout failed", 
      error: err.message 
    });
  }
};

module.exports = logout;

