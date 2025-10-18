// controllers/userController.js
const getUserProfile = async (req, res) => {
  try {
    console.log("Fetching user profile for:", req.user);    
    // req.user is already populated by authUser middleware
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized!" });
    }

    res.status(200).json({
      success: true,
      user: req.user, // already excludes password
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching user profile",
    });
  }
};

module.exports = { getUserProfile };
