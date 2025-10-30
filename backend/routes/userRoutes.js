const express = require("express");
const router = express.Router();
const login = require("../controllers/loginController");
const logout = require("../controllers/logoutController");
const register = require("../controllers/registerController");
const verifyRefreshToken = require("../middleware/verifyRefreshToken");
const refreshToken = require("../controllers/refreshTokenController");
const validatorRegister = require("../middleware/validatorRegister");
const authUser = require("../middleware/user.auth");
const { validateLogin } = require("../middleware/validateLogin");
const { activateAccount } = require("../controllers/activationController");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/resetPasswordController");
const { getUserProfile, updateUserProfile, updatePrivacySettings } = require("../controllers/userProfileController");
const { uploadProfileImage, deleteProfileImage } = require("../controllers/userImageController");
const { 
  followUser, 
  unfollowUser, 
  getFollowStatus, 
  getFollowers, 
  getFollowing, 
  getFollowRequests, 
  acceptFollowRequest, 
  rejectFollowRequest 
} = require("../controllers/followController");
const upload = require("../middleware/upload");
router.post("/api/register", validatorRegister, register);
router.post("/api/login", validateLogin, login);
router.post("/api/logout", logout);
router.post("/api/refresh", verifyRefreshToken, refreshToken);
router.get("/api/auth/activate/:token", activateAccount);
router.post("/api/forgot-password", forgotPassword);
router.post("/api/reset-password/:token", resetPassword);

router.get("/api/user/profile", authUser, getUserProfile);
router.patch("/api/user/profile", authUser, updateUserProfile);
router.patch(
  "/api/user/profile-image",
  authUser,
  upload.single("profileImage"),
  uploadProfileImage
);
router.delete("/api/user/profile-image", authUser, deleteProfileImage);
router.put("/api/user/privacy", authUser, updatePrivacySettings);

// Follow system routes
router.post("/api/follow/:userId", authUser, followUser);
router.delete("/api/follow/:userId", authUser, unfollowUser);
router.get("/api/follow/status/:userId", authUser, getFollowStatus);
router.get("/api/follow/followers/:userId", authUser, getFollowers);
router.get("/api/follow/following/:userId", authUser, getFollowing);
router.get("/api/follow/requests", authUser, getFollowRequests);
router.put("/api/follow/requests/:requestId/accept", authUser, acceptFollowRequest);
router.put("/api/follow/requests/:requestId/reject", authUser, rejectFollowRequest);

module.exports = router;
