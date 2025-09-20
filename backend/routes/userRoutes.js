const express = require("express");
const router = express.Router();
const login = require("../controllers/loginController");
const register = require("../controllers/registerController");
const verifyRefreshToken = require("../middleware/verifyRefreshToken");
const refreshToken = require("../controllers/refreshTokenController");
const validatorRegister = require("../middleware/validatorRegister");

const { validateLogin } = require("../middleware/validateLogin");
const { activateAccount } = require("../controllers/activationController");
router.post("/api/register", validatorRegister, register);
router.post("/api/login", validateLogin, login);
router.post("/api/refresh", verifyRefreshToken, refreshToken);
router.get("/api/auth/activate/:token", activateAccount);
module.exports = router;
