import { useState, useEffect } from "react";
import { UserPlus, UserCheck, UserX, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/utils/Api/axiosInstance";

const FollowButton = ({ userId, user, onFollowChange }) => {
  const { user: currentUser } = useAuth();
  const [followStatus, setFollowStatus] = useState('not_following');
  const [isLoading, setIsLoading] = useState(false);

  // Don't show follow button for own profile
  if (currentUser?._id === userId) {
    return null;
  }

  useEffect(() => {
    fetchFollowStatus();
  }, [userId]);

  const fetchFollowStatus = async () => {
    try {
      const response = await axiosInstance.get(`/api/follow/status/${userId}`);
      if (response.data.success) {
        setFollowStatus(response.data.followStatus);
      }
    } catch (error) {
      console.error("Error fetching follow status:", error);
    }
  };

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/api/follow/${userId}`);
      if (response.data.success) {
        setFollowStatus(response.data.followStatus);
        onFollowChange?.(response.data.followStatus);
      }
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.delete(`/api/follow/${userId}`);
      if (response.data.success) {
        setFollowStatus(response.data.followStatus);
        onFollowChange?.(response.data.followStatus);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    switch (followStatus) {
      case 'following':
        return {
          text: 'Following',
          icon: <UserCheck className="w-4 h-4" />,
          className: 'bg-button-secondary-bg text-button-secondary-text hover:bg-button-secondary-hover',
          action: handleUnfollow
        };
      case 'pending':
        return {
          text: 'Requested',
          icon: <Clock className="w-4 h-4" />,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
          action: null,
          disabled: true
        };
      default:
        return {
          text: 'Follow',
          icon: <UserPlus className="w-4 h-4" />,
          className: 'bg-primary text-white hover:bg-primary/90',
          action: handleFollow
        };
    }
  };

  const buttonContent = getButtonContent();

  return (
    <button
      onClick={buttonContent.action}
      disabled={isLoading || buttonContent.disabled}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium
        transition-all duration-200 cursor-pointer
        ${buttonContent.className}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${buttonContent.disabled ? 'cursor-not-allowed' : 'hover:scale-105'}
      `}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        buttonContent.icon
      )}
      <span>{buttonContent.text}</span>
    </button>
  );
};

export default FollowButton;