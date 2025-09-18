const express = require("express");
const router = express.Router();
const login = require("../controllers/loginController");
const register = require("../controllers/registerController");
const authUser = require("../middleware/user.auth");
const getUserData = require("../controllers/getUserController");
const verifyRefreshToken = require("../middleware/verifyRefreshToken");
const refreshToken = require("../controllers/refreshTokenController");
const deleteUser = require("../controllers/deleteUserController");
const {
  addReminder,
  getReminders,
  updateReminder,
  deleteReminder,
} = require("../controllers/reminderController");
router.post("/api/register", register);
router.post("/api/login", login);
router.get("/api/profile", authUser, getUserData);
router.post("/api/refresh", verifyRefreshToken, refreshToken);
router.delete("/api/profile/delete", authUser, deleteUser);
router.post("/api/profile/reminders", authUser, addReminder);
router.get("/api/profile/reminders", authUser, getReminders);
router.put("/api/profile/reminders/:id", authUser, updateReminder);
router.delete("/api/profile/reminders/:id", authUser, deleteReminder);
module.exports = router;
