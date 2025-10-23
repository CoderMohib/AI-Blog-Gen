const express = require("express");
const router = express.Router();

// Import controllers
const {
  followUser,
  unfollowUser,
  acceptFollowRequest,
  rejectFollowRequest,
  getFollowRequests,
  getFollowers,
  getFollowing,
  checkFollowStatus,
  togglePrivacy,
} = require("../controllers/followController");

const authUser = require("../middleware/user.auth");

// Follow/Unfollow routes
router.post("/api/users/:userId/follow", authUser, followUser);
router.delete("/api/users/:userId/follow", authUser, unfollowUser);
router.get("/api/users/:userId/follow-status", authUser, checkFollowStatus);

// Follow request management
router.post("/api/users/:userId/accept-follow", authUser, acceptFollowRequest);
router.post("/api/users/:userId/reject-follow", authUser, rejectFollowRequest);
router.get("/api/follow-requests", authUser, getFollowRequests);

// Followers/Following lists
router.get("/api/users/:userId/followers", authUser, getFollowers);
router.get("/api/users/:userId/following", authUser, getFollowing);

// Privacy settings
router.patch("/api/users/privacy", authUser, togglePrivacy);

module.exports = router;

