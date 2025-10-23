import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';
import axiosInstance from '@/utils/Api/axiosInstance';

const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  // Initialize socket connection - only once when user changes
  useEffect(() => {
    let isMounted = true;

    const initializeSocket = async () => {
      if (user && !socketRef.current && isMounted) {
        const token = localStorage.getItem('accessToken');
        console.log('Creating socket connection for user:', user.username);
        
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        const newSocket = io('http://localhost:3000', {
          auth: {
            token: token
          },
          transports: ['websocket', 'polling'],
          timeout: 20000,
          forceNew: false,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          autoConnect: true
        });

        newSocket.on('connect', () => {
          if (isMounted) {
            console.log('Connected to notification socket');
          }
        });

        newSocket.on('new_notification', (notification) => {
          if (isMounted) {
            console.log('New notification received:', notification);
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        });

        newSocket.on('notification_count_update', (data) => {
          if (isMounted) {
            setUnreadCount(data.count);
          }
        });

        newSocket.on('notification_read', (data) => {
          if (isMounted) {
            setNotifications(prev => 
              prev.map(notif => 
                notif._id === data.notificationId 
                  ? { ...notif, isRead: true, readAt: new Date() }
                  : notif
              )
            );
          }
        });

        newSocket.on('disconnect', () => {
          if (isMounted) {
            console.log('Disconnected from notification socket');
          }
        });

        newSocket.on('connect_error', (error) => {
          if (isMounted) {
            console.error('Socket connection error:', error);
          }
        });

        newSocket.on('error', (error) => {
          if (isMounted) {
            console.error('Socket error:', error);
          }
        });

        if (isMounted) {
          socketRef.current = newSocket;
          setSocket(newSocket);
        } else {
          newSocket.close();
        }
      }
    };

    initializeSocket();

    // Cleanup function - only runs on unmount
    return () => {
      isMounted = false;
      if (socketRef.current) {
        console.log('Cleaning up socket connection');
        socketRef.current.close();
        socketRef.current = null;
        setSocket(null);
      }
    };
  }, [user?.id]); // Only depend on user ID, not the entire user object

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/notifications?limit=50');
      
      if (response.data.success) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif._id === notificationId 
          ? { ...notif, isRead: true, readAt: new Date() }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true, readAt: new Date() }))
    );
    setUnreadCount(0);
  }, []);

  // Delete notification
  const deleteNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(notif => notif._id === notificationId);
      const wasUnread = notification && !notification.isRead;
      
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      return prev.filter(notif => notif._id !== notificationId);
    });
  }, []);

  // Load notifications on mount
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    socket
  };
};

export { useNotifications };
export default useNotifications;
