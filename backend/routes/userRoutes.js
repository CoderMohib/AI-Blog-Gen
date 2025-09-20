const express = require("express");
const router = express.Router();
const login = require("../controllers/loginController");
const register = require("../controllers/registerController");
const verifyRefreshToken = require("../middleware/verifyRefreshToken");
const refreshToken = require("../controllers/refreshTokenController");
const validatorRegister = require("../middleware/validatorRegister");

const { validateLogin } = require("../middleware/validateLogin");
const { activateAccount } = require("../controllers/activationController");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/resetPasswordController");
router.post("/api/register", validatorRegister, register);
router.post("/api/login", validateLogin, login);
router.post("/api/refresh", verifyRefreshToken, refreshToken);
router.get("/api/auth/activate/:token", activateAccount);
router.post("/api/forgot-password", forgotPassword);
router.post("/api/reset-password/:token", resetPassword);
module.exports = router;
