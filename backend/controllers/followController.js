const User = require('../model/userModel');
const Follow = require('../model/followModel');
const mongoose = require('mongoose');
const { 
  createFollowRequestNotification, 
  createFollowAcceptedNotification,
  emitNotification 
} = require('./notificationController');

// Follow a user
const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Can't follow yourself
    if (currentUserId.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself"
      });
    }

    // Check if user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: userId
    });

    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: "You are already following this user"
      });
    }

    // Handle private accounts
    if (targetUser.isPrivate) {
      // Create follow request
      const followRequest = new Follow({
        follower: currentUserId,
        following: userId,
        status: 'pending'
      });

      await followRequest.save();

      // Create notification for follow request
      try {
        const notification = await createFollowRequestNotification(currentUserId, userId);
        emitNotification(userId, notification);
      } catch (error) {
        console.error("Error creating follow request notification:", error);
      }

      return res.status(200).json({
        success: true,
        message: "Follow request sent",
        followStatus: 'pending'
      });
    } else {
      // Public account - follow immediately
      const follow = new Follow({
        follower: currentUserId,
        following: userId,
        status: 'accepted'
      });

      await follow.save();

      // Update user follower/following counts
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: userId }
      });

      await User.findByIdAndUpdate(userId, {
        $addToSet: { followers: currentUserId }
      });

      // Create notification for immediate follow (public account)
      try {
        const notification = await createFollowAcceptedNotification(userId, currentUserId);
        emitNotification(currentUserId, notification);
      } catch (error) {
        console.error("Error creating follow notification:", error);
      }

      return res.status(200).json({
        success: true,
        message: "Successfully followed user",
        followStatus: 'following'
      });
    }
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({
      success: false,
      message: "Server error following user",
      error: error.message
    });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Remove follow relationship
    const follow = await Follow.findOneAndDelete({
      follower: currentUserId,
      following: userId
    });

    if (!follow) {
      return res.status(400).json({
        success: false,
        message: "You are not following this user"
      });
    }

    // Update user follower/following counts
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { followers: currentUserId }
    });

    res.status(200).json({
      success: true,
      message: "Successfully unfollowed user",
      followStatus: 'not_following'
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({
      success: false,
      message: "Server error unfollowing user",
      error: error.message
    });
  }
};

// Get follow status
const getFollowStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (currentUserId.toString() === userId) {
      return res.status(200).json({
        success: true,
        followStatus: 'self'
      });
    }

    const follow = await Follow.findOne({
      follower: currentUserId,
      following: userId
    });

    let status = 'not_following';
    if (follow) {
      status = follow.status === 'accepted' ? 'following' : 'pending';
    }

    res.status(200).json({
      success: true,
      followStatus: status
    });
  } catch (error) {
    console.error("Error getting follow status:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting follow status",
      error: error.message
    });
  }
};

// Get followers list with search and pagination
const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, search = '' } = req.query;
    const currentUserId = req.user._id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Build search query
    let searchQuery = {
      following: userId,
      status: 'accepted'
    };

    // Add search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      searchQuery = {
        ...searchQuery,
        $or: [
          { 'follower.fullName': searchRegex },
          { 'follower.username': searchRegex }
        ]
      };
    }

    // Get total count for pagination
    const totalFollowers = await Follow.countDocuments({
      following: userId,
      status: 'accepted'
    });

    // Get followers with pagination
    const skip = (page - 1) * limit;
    const followers = await Follow.find(searchQuery)
      .populate('follower', 'fullName username profileImage isPrivate')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const followersWithStatus = await Promise.all(
      followers.map(async (follow) => {
        const follower = follow.follower;
        let followBackStatus = 'not_following';
        
        if (currentUserId.toString() !== follower._id.toString()) {
          const followBack = await Follow.findOne({
            follower: currentUserId,
            following: follower._id
          });
          if (followBack) {
            followBackStatus = followBack.status === 'accepted' ? 'following' : 'pending';
          }
        }

        return {
          ...follower.toObject(),
          followBackStatus
        };
      })
    );

    res.status(200).json({
      success: true,
      followers: followersWithStatus,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalFollowers / limit),
        totalCount: totalFollowers,
        hasNextPage: page < Math.ceil(totalFollowers / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error getting followers:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting followers",
      error: error.message
    });
  }
};

// Get following list with search and pagination
const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, search = '' } = req.query;
    const currentUserId = req.user._id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Build search query
    let searchQuery = {
      follower: userId,
      status: 'accepted'
    };

    // Add search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      searchQuery = {
        ...searchQuery,
        $or: [
          { 'following.fullName': searchRegex },
          { 'following.username': searchRegex }
        ]
      };
    }

    // Get total count for pagination
    const totalFollowing = await Follow.countDocuments({
      follower: userId,
      status: 'accepted'
    });

    // Get following with pagination
    const skip = (page - 1) * limit;
    const following = await Follow.find(searchQuery)
      .populate('following', 'fullName username profileImage isPrivate')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const followingWithStatus = await Promise.all(
      following.map(async (follow) => {
        const followingUser = follow.following;
        let followBackStatus = 'not_following';
        
        if (currentUserId.toString() !== followingUser._id.toString()) {
          const followBack = await Follow.findOne({
            follower: currentUserId,
            following: followingUser._id
          });
          if (followBack) {
            followBackStatus = followBack.status === 'accepted' ? 'following' : 'pending';
          }
        }

        return {
          ...followingUser.toObject(),
          followBackStatus
        };
      })
    );

    res.status(200).json({
      success: true,
      following: followingWithStatus,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalFollowing / limit),
        totalCount: totalFollowing,
        hasNextPage: page < Math.ceil(totalFollowing / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error getting following:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting following",
      error: error.message
    });
  }
};

// Get follow requests (for private accounts)
const getFollowRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const requests = await Follow.find({
      following: currentUserId,
      status: 'pending'
    }).populate('follower', 'fullName username profileImage');

    res.status(200).json({
      success: true,
      requests: requests,
      count: requests.length
    });
  } catch (error) {
    console.error("Error getting follow requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting follow requests",
      error: error.message
    });
  }
};

// Accept follow request
const acceptFollowRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Follow.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Follow request not found"
      });
    }

    if (request.following.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to accept this request"
      });
    }

    // Update request status
    request.status = 'accepted';
    await request.save();

    // Update user follower/following counts
    await User.findByIdAndUpdate(request.follower, {
      $addToSet: { following: request.following }
    });

    await User.findByIdAndUpdate(request.following, {
      $addToSet: { followers: request.follower }
    });

    // Create notification for follow request acceptance
    try {
      const notification = await createFollowAcceptedNotification(request.following, request.follower);
      emitNotification(request.follower, notification);
    } catch (error) {
      console.error("Error creating follow accepted notification:", error);
    }

    res.status(200).json({
      success: true,
      message: "Follow request accepted"
    });
  } catch (error) {
    console.error("Error accepting follow request:", error);
    res.status(500).json({
      success: false,
      message: "Server error accepting follow request",
      error: error.message
    });
  }
};

// Reject follow request
const rejectFollowRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Follow.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Follow request not found"
      });
    }

    if (request.following.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to reject this request"
      });
    }

    // Delete the request
    await Follow.findByIdAndDelete(requestId);

    res.status(200).json({
      success: true,
      message: "Follow request rejected"
    });
  } catch (error) {
    console.error("Error rejecting follow request:", error);
    res.status(500).json({
      success: false,
      message: "Server error rejecting follow request",
      error: error.message
    });
  }
};

// Check follow status (alias for getFollowStatus)
const checkFollowStatus = getFollowStatus;

// Toggle privacy settings
const togglePrivacy = async (req, res) => {
  try {
    const { isPrivate } = req.body;
    const currentUserId = req.user._id;

    const user = await User.findByIdAndUpdate(
      currentUserId,
      { isPrivate: isPrivate },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `Account privacy updated to ${isPrivate ? 'private' : 'public'}`,
      isPrivate: user.isPrivate
    });
  } catch (error) {
    console.error("Error toggling privacy:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating privacy settings",
      error: error.message
    });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowStatus,
  checkFollowStatus,
  getFollowers,
  getFollowing,
  getFollowRequests,
  acceptFollowRequest,
  rejectFollowRequest,
  togglePrivacy
};