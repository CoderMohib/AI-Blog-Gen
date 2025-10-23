const express = require("express");
const router = express.Router();
const authUser = require("../middleware/user.auth");

// Import notification controllers
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require("../controllers/notificationController");

// Get notifications with pagination and filters
router.get("/api/notifications", authUser, getNotifications);

// Get unread notification count
router.get("/api/notifications/unread-count", authUser, getUnreadCount);

// Mark specific notification as read
router.patch("/api/notifications/:notificationId/read", authUser, markAsRead);

// Mark all notifications as read
router.patch("/api/notifications/read-all", authUser, markAllAsRead);

// Delete specific notification
router.delete("/api/notifications/:notificationId", authUser, deleteNotification);

module.exports = router;

