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

const updateUserProfile = async (req, res) => {
  try {
    const { fullName, username, phone, dob, country, bio } = req.body;
    
    // Update user fields
    if (fullName) req.user.fullName = fullName;
    if (username) req.user.username = username;
    if (phone) req.user.phone = phone;
    if (dob) req.user.dob = dob;
    if (country) req.user.country = country;
    if (bio !== undefined) req.user.bio = bio;
    
    await req.user.save();
    
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: req.user
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating profile",
      error: error.message
    });
  }
};

module.exports = { getUserProfile, updateUserProfile };
