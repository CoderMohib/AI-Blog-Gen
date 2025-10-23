import { useState, useEffect } from "react";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  UserCheck,
  X,
  MoreHorizontal
} from "lucide-react";
import useNotifications from "@/hooks/useNotifications";
import axiosInstance from "@/utils/Api/axiosInstance";

const NotificationList = ({ onClose, onMarkAsRead, onMarkAllAsRead }) => {
  const { notifications, unreadCount, isLoading, fetchNotifications } = useNotifications();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'blog_like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'blog_comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow_request':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'follow_accepted':
        return <UserCheck className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'blog_like':
        return 'bg-red-50 border-red-200';
      case 'blog_comment':
        return 'bg-blue-50 border-blue-200';
      case 'follow_request':
        return 'bg-green-50 border-green-200';
      case 'follow_accepted':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-card-soft border-border';
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axiosInstance.patch(`/api/notifications/${notificationId}/read`);
      onMarkAsRead(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axiosInstance.patch('/api/notifications/read-all');
      onMarkAllAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axiosInstance.delete(`/api/notifications/${notificationId}`);
      // Refresh notifications after deletion
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

  return (
    <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-text">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-card-soft rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="p-4">
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-card-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-card-muted rounded w-3/4"></div>
                    <div className="h-3 bg-card-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : displayedNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {displayedNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-card-soft transition-colors ${
                  !notification.isRead ? 'bg-primary/5 border-l-4 border-primary' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Notification Icon */}
                  <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-text text-sm">
                          {notification.title}
                        </h4>
                        <p className="text-text-secondary text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-text-secondary mt-1">
                          {notification.timeAgo}
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-1 hover:bg-card-soft rounded transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 text-text-secondary" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification._id)}
                          className="p-1 hover:bg-card-soft rounded transition-colors"
                          title="Delete notification"
                        >
                          <X className="w-4 h-4 text-text-secondary" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 5 && (
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {showAll ? 'Show less' : `Show all ${notifications.length} notifications`}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
