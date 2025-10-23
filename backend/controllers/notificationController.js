const Notification = require('../model/notificationModel');
const User = require('../model/userModel');

// Get all notifications for a user
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, unreadOnly = false } = req.query;
    const userId = req.user._id;

    // Build query
    let query = { recipient: userId };
    
    if (type) {
      query.type = type;
    }
    
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    // Get total count
    const totalNotifications = await Notification.countDocuments(query);

    // Get notifications with pagination
    const skip = (page - 1) * limit;
    const notifications = await Notification.find(query)
      .populate('sender', 'fullName username profileImage')
      .populate('data.blogId', 'title')
      .populate('data.commentId', 'content')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get unread count
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    res.status(200).json({
      success: true,
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalNotifications / limit),
        totalCount: totalNotifications,
        hasNextPage: page < Math.ceil(totalNotifications / limit),
        hasPrevPage: page > 1
      },
      unreadCount
    });
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting notifications",
      error: error.message
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Server error marking notification as read",
      error: error.message
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Server error marking all notifications as read",
      error: error.message
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted"
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting notification",
      error: error.message
    });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    res.status(200).json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting unread count",
      error: error.message
    });
  }
};

// Create notification (internal function)
const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    
    // Populate sender info for socket emission
    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'fullName username profileImage')
      .populate('data.blogId', 'title')
      .populate('data.commentId', 'content');

    return populatedNotification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Notification factory functions
const createBlogLikeNotification = async (blogId, likerId, blogOwnerId) => {
  const liker = await User.findById(likerId);
  const blog = await require('../model/blogModel').findById(blogId);
  
  return createNotification({
    recipient: blogOwnerId,
    sender: likerId,
    type: 'blog_like',
    title: 'New Like',
    message: `${liker.fullName} liked your blog "${blog.title}"`,
    data: { blogId }
  });
};

const createBlogCommentNotification = async (blogId, commenterId, blogOwnerId, commentId) => {
  const commenter = await User.findById(commenterId);
  const blog = await require('../model/blogModel').findById(blogId);
  
  return createNotification({
    recipient: blogOwnerId,
    sender: commenterId,
    type: 'blog_comment',
    title: 'New Comment',
    message: `${commenter.fullName} commented on your blog "${blog.title}"`,
    data: { blogId, commentId }
  });
};

const createFollowRequestNotification = async (requesterId, targetUserId) => {
  const requester = await User.findById(requesterId);
  
  return createNotification({
    recipient: targetUserId,
    sender: requesterId,
    type: 'follow_request',
    title: 'Follow Request',
    message: `${requester.fullName} wants to follow you`,
    data: { followId: null }
  });
};

const createFollowAcceptedNotification = async (accepterId, requesterId) => {
  const accepter = await User.findById(accepterId);
  
  return createNotification({
    recipient: requesterId,
    sender: accepterId,
    type: 'follow_accepted',
    title: 'Follow Request Accepted',
    message: `${accepter.fullName} accepted your follow request`,
    data: { followId: null }
  });
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  createNotification,
  createBlogLikeNotification,
  createBlogCommentNotification,
  createFollowRequestNotification,
  createFollowAcceptedNotification
};

