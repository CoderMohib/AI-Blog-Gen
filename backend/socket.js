const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./model/userModel');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      methods: ["GET", "POST"],
      credentials: true,
      allowedHeaders: ["*"]
    }
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      console.log('Socket auth attempt with token:', token ? 'Token provided' : 'No token');
      
      if (!token) {
        console.log('No token provided');
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully for user:', decoded.id);
      
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('User not found:', decoded.id);
        return next(new Error('User not found'));
      }

      console.log('Socket authentication successful for user:', user.username);
      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      console.log('Socket authentication error:', error.message);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected to notifications`);

    // Join user to their personal notification room
    socket.join(`user_${socket.userId}`);

    // Handle notification events
    socket.on('mark_notification_read', async (notificationId) => {
      try {
        // Emit back to confirm read status
        socket.emit('notification_read', { notificationId });
      } catch (error) {
        socket.emit('error', { message: 'Failed to mark notification as read' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected from notifications`);
    });
  });

  return io;
};

// Function to emit notification to specific user
const emitNotification = (userId, notification) => {
  if (io) {
    io.to(`user_${userId}`).emit('new_notification', notification);
  }
};

// Function to emit notification count update
const emitNotificationCount = (userId, count) => {
  if (io) {
    io.to(`user_${userId}`).emit('notification_count_update', { count });
  }
};

// Function to emit notification read status
const emitNotificationRead = (userId, notificationId) => {
  if (io) {
    io.to(`user_${userId}`).emit('notification_read', { notificationId });
  }
};

module.exports = {
  initializeSocket,
  emitNotification,
  emitNotificationCount,
  emitNotificationRead
};
