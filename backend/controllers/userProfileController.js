// controllers/userController.js
const getUserProfile = async (req, res) => {
  try {
    // req.user is already populated by authUser middleware
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized!" });
    }

    // Get followers/following counts using instance method
    const { followersCount, followingCount } = await req.user.getFollowCounts();

    res.status(200).json({
      success: true,
      user: {
        ...req.user.toObject(),
        followersCount,
        followingCount,
      },
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
    const { fullName, username, phone, dob, country, bio, isPrivate } =
      req.body;

    // Update user fields
    if (fullName) req.user.fullName = fullName;
    if (username) req.user.username = username;
    if (phone) req.user.phone = phone;
    if (dob) req.user.dob = dob;
    if (country) req.user.country = country;
    if (bio !== undefined) req.user.bio = bio;
    if (isPrivate !== undefined) req.user.isPrivate = isPrivate;

    // Clean up invalid ObjectIds in arrays
    if (req.user.followers) {
      req.user.followers = req.user.followers.filter(
        (id) =>
          id &&
          typeof id === "object" &&
          id.toString &&
          id.toString().length === 24
      );
    }
    if (req.user.following) {
      req.user.following = req.user.following.filter(
        (id) =>
          id &&
          typeof id === "object" &&
          id.toString &&
          id.toString().length === 24
      );
    }
    if (req.user.followRequests) {
      req.user.followRequests = req.user.followRequests.filter(
        (id) =>
          id &&
          typeof id === "object" &&
          id.toString &&
          id.toString().length === 24
      );
    }

    await req.user.save();

    res.status(200).json({
      success: true,
      message:
        isPrivate !== undefined
          ? "Privacy settings updated successfully"
          : "Profile updated successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating profile",
      error: error.message,
    });
  }
};

const updatePrivacySettings = async (req, res) => {
  try {
    const { isPrivate } = req.body;

    if (typeof isPrivate !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isPrivate must be a boolean value",
      });
    }

    // Use direct database update to avoid validation issues
    const User = require("../model/userModel");
    const result = await User.findByIdAndUpdate(
      req.user._id,
      { isPrivate: isPrivate },
      { new: true, runValidators: false }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Privacy settings updated successfully",
      user: result,
    });
  } catch (error) {
    console.error("Error updating privacy settings:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating privacy settings",
      error: error.message,
    });
  }
};

module.exports = { getUserProfile, updateUserProfile, updatePrivacySettings };
