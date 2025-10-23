import { useState, useEffect, useMemo } from "react";
import { Bell, BellRing } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import useNotifications from "@/hooks/useNotifications";
import NotificationList from "@/components/organisms/NotificationList";

const NotificationBell = () => {
  const { user } = useAuth();
  const { unreadCount, notifications, markAsRead, markAllAsRead, socket } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  // Memoize the notification data to prevent unnecessary re-renders
  const memoizedNotifications = useMemo(() => notifications, [notifications.length]);

  // Don't show notification bell if user is not authenticated
  if (!user) return null;

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-card-soft transition-colors"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <BellRing className="w-6 h-6 text-primary" />
        ) : (
          <Bell className="w-6 h-6 text-text-secondary" />
        )}
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        
        {/* Connection Status Indicator */}
        {socket && socket.connected && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-h-[500px] bg-card border border-border rounded-2xl shadow-xl z-50">
          <NotificationList 
            onClose={() => setIsOpen(false)}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
          />
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
