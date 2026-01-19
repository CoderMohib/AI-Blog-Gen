const User = require("../model/userModel");
const Blog = require("../model/blogModel");
const Follow = require("../model/followModel");
const mongoose = require("mongoose");

// Helper function to get follow status between two users
const getFollowStatus = async (currentUserId, targetUserId) => {
  if (currentUserId.equals(targetUserId)) return "self";

  const follow = await Follow.findOne({
    follower: currentUserId,
    following: targetUserId,
  });

  if (!follow) return "not_following";
  return follow.status === "accepted" ? "following" : "pending";
};

// Helper function to get mutual followers count
const getMutualFollowersCount = async (userId1, userId2) => {
  const user1Followers = await Follow.find({
    following: userId1,
    status: "accepted",
  }).select("follower");

  const user2Followers = await Follow.find({
    following: userId2,
    status: "accepted",
  }).select("follower");

  const user1FollowerIds = user1Followers.map((f) => f.follower.toString());
  const user2FollowerIds = user2Followers.map((f) => f.follower.toString());

  const mutual = user1FollowerIds.filter((id) => user2FollowerIds.includes(id));
  return mutual.length;
};

// Helper function to get mutual followers with details
const getMutualFollowers = async (userId1, userId2, limit = 3) => {
  const user1Followers = await Follow.find({
    following: userId1,
    status: "accepted",
  }).select("follower");

  const user2Followers = await Follow.find({
    following: userId2,
    status: "accepted",
  }).select("follower");

  const user1FollowerIds = user1Followers.map((f) => f.follower.toString());
  const user2FollowerIds = user2Followers.map((f) => f.follower.toString());

  const mutualIds = user1FollowerIds.filter((id) =>
    user2FollowerIds.includes(id)
  );

  const users = await User.find({
    _id: { $in: mutualIds.slice(0, limit) },
  }).select("username fullName profileImage");

  return users;
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { q, page = 1, limit = 20, filter } = req.query;
    const currentUserId = req.user._id;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    // Build search query
    let query = {
      $or: [
        { username: { $regex: q, $options: "i" } },
        { fullName: { $regex: q, $options: "i" } },
      ],
    };

    // Apply filters
    if (filter === "following") {
      const following = await Follow.find({
        follower: currentUserId,
        status: "accepted",
      }).select("following");

      const followingIds = following.map((f) => f.following);
      query._id = { $in: followingIds };
    } else if (filter === "followers") {
      const followers = await Follow.find({
        following: currentUserId,
        status: "accepted",
      }).select("follower");

      const followerIds = followers.map((f) => f.follower);
      query._id = { $in: followerIds };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const maxLimit = Math.min(parseInt(limit), 50);

    // Get total count
    const totalUsers = await User.countDocuments(query);

    // Get users
    const users = await User.find(query)
      .select("username fullName profileImage bio isPrivate")
      .skip(skip)
      .limit(maxLimit);

    // Get follow status and mutual followers for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const followStatus = await getFollowStatus(currentUserId, user._id);
        const mutualCount = await getMutualFollowersCount(
          currentUserId,
          user._id
        );

        return {
          ...user.toObject(),
          followStatus,
          mutualFollowers: mutualCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      users: usersWithStatus,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / maxLimit),
        totalCount: totalUsers,
        hasNextPage: page < Math.ceil(totalUsers / maxLimit),
        hasPrevPage: page > 1,
        limit: maxLimit,
      },
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error searching users",
      error: error.message,
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user._id;

    // Find user
    const user = await User.findOne({ username })
      .select("-password")
      .populate("postCount");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get follow status
    const followStatus = await getFollowStatus(currentUserId, user._id);

    // Get follower/following counts using instance method
    const { followersCount, followingCount } = await user.getFollowCounts();

    // Check if can view blogs
    const canViewBlogs =
      user._id.equals(currentUserId) ||
      !user.isPrivate ||
      followStatus === "following";

    // Get mutual followers (first 3)
    const mutualFollowers = await getMutualFollowers(
      currentUserId,
      user._id,
      3
    );

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        followersCount,
        followingCount,
      },
      followStatus,
      canViewBlogs,
      mutualFollowers,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching user profile",
      error: error.message,
    });
  }
};

// Get user blogs
const getUserBlogs = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const currentUserId = req.user._id;

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if can view blogs
    const followStatus = await getFollowStatus(currentUserId, user._id);
    const canViewBlogs =
      user._id.equals(currentUserId) ||
      !user.isPrivate ||
      followStatus === "following";

    if (!canViewBlogs) {
      return res.status(403).json({
        success: false,
        message: "This account is private. Follow to see their blogs.",
      });
    }

    // Build query
    let query = {
      author: user._id,
      status: "published",
    };

    // If viewing own profile, include drafts
    if (user._id.equals(currentUserId)) {
      delete query.status;
    }

    // Get total count
    const totalBlogs = await Blog.countDocuments(query);

    // Get blogs
    const skip = (page - 1) * limit;
    const maxLimit = Math.min(parseInt(limit), 20);

    const blogs = await Blog.find(query)
      .select("title excerpt image likes views status createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(maxLimit);

    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBlogs / maxLimit),
        totalCount: totalBlogs,
        hasNextPage: page < Math.ceil(totalBlogs / maxLimit),
        hasPrevPage: page > 1,
        limit: maxLimit,
      },
    });
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching user blogs",
      error: error.message,
    });
  }
};

// Get user followers
const getUserFollowers = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 20, search = "" } = req.query;
    const currentUserId = req.user._id;

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get followers
    const followQuery = {
      following: user._id,
      status: "accepted",
    };

    const totalFollowers = await Follow.countDocuments(followQuery);

    const skip = (page - 1) * limit;
    const maxLimit = Math.min(parseInt(limit), 50);

    const followers = await Follow.find(followQuery)
      .populate("follower", "username fullName profileImage bio isPrivate")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(maxLimit);

    // Filter by search if provided
    let followerUsers = followers.map((f) => f.follower).filter(Boolean);

    if (search) {
      const searchRegex = new RegExp(search, "i");
      followerUsers = followerUsers.filter(
        (user) =>
          searchRegex.test(user.username) || searchRegex.test(user.fullName)
      );
    }

    // Get follow status for each follower
    const followersWithStatus = await Promise.all(
      followerUsers.map(async (follower) => {
        const followStatus = await getFollowStatus(currentUserId, follower._id);

        return {
          ...follower.toObject(),
          followStatus,
        };
      })
    );

    res.status(200).json({
      success: true,
      users: followersWithStatus,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalFollowers / maxLimit),
        totalCount: totalFollowers,
        hasNextPage: page < Math.ceil(totalFollowers / maxLimit),
        hasPrevPage: page > 1,
        limit: maxLimit,
      },
    });
  } catch (error) {
    console.error("Error fetching user followers:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching followers",
      error: error.message,
    });
  }
};

// Get user following
const getUserFollowing = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 20, search = "" } = req.query;
    const currentUserId = req.user._id;

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get following
    const followQuery = {
      follower: user._id,
      status: "accepted",
    };

    const totalFollowing = await Follow.countDocuments(followQuery);

    const skip = (page - 1) * limit;
    const maxLimit = Math.min(parseInt(limit), 50);

    const following = await Follow.find(followQuery)
      .populate("following", "username fullName profileImage bio isPrivate")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(maxLimit);

    // Filter by search if provided
    let followingUsers = following.map((f) => f.following).filter(Boolean);

    if (search) {
      const searchRegex = new RegExp(search, "i");
      followingUsers = followingUsers.filter(
        (user) =>
          searchRegex.test(user.username) || searchRegex.test(user.fullName)
      );
    }

    // Get follow status for each following user
    const followingWithStatus = await Promise.all(
      followingUsers.map(async (followingUser) => {
        const followStatus = await getFollowStatus(
          currentUserId,
          followingUser._id
        );

        return {
          ...followingUser.toObject(),
          followStatus,
        };
      })
    );

    res.status(200).json({
      success: true,
      users: followingWithStatus,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalFollowing / maxLimit),
        totalCount: totalFollowing,
        hasNextPage: page < Math.ceil(totalFollowing / maxLimit),
        hasPrevPage: page > 1,
        limit: maxLimit,
      },
    });
  } catch (error) {
    console.error("Error fetching user following:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching following",
      error: error.message,
    });
  }
};

module.exports = {
  searchUsers,
  getUserProfile,
  getUserBlogs,
  getUserFollowers,
  getUserFollowing,
};
