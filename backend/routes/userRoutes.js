const express = require("express");
const router = express.Router();
const login = require("../controllers/loginController");
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
const { getUserProfile, updateUserProfile } = require("../controllers/userProfileController");
const { uploadProfileImage, deleteProfileImage } = require("../controllers/userImageController");
const upload = require("../middleware/upload");
router.post("/api/register", validatorRegister, register);
router.post("/api/login", validateLogin, login);
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
module.exports = router;
