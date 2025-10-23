import { useState, useEffect } from "react";
import { Shield, Lock, Users, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/utils/Api/axiosInstance";

const PrivacySettings = () => {
  const { user, login } = useAuth();
  const [isPrivate, setIsPrivate] = useState(user?.isPrivate || false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with user context changes
  useEffect(() => {
    if (user?.isPrivate !== undefined) {
      setIsPrivate(user.isPrivate);
    }
  }, [user?.isPrivate]);

  const handlePrivacyToggle = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put("/api/user/privacy", {
        isPrivate: !isPrivate
      });
      
      if (response.data.success) {
        setIsPrivate(!isPrivate);
        // Update user in context
        login(response.data.user, localStorage.getItem("accessToken"));
      }
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      // Show error message to user
      alert(error.response?.data?.message || "Failed to update privacy settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text">Privacy Settings</h3>
          <p className="text-sm text-text-secondary">Control who can see your content</p>
        </div>
      </div>

      {/* Current Privacy Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-card-soft rounded-xl border border-border">
          <div className="flex items-center gap-3">
            {isPrivate ? (
              <Lock className="w-5 h-5 text-primary" />
            ) : (
              <Users className="w-5 h-5 text-primary" />
            )}
            <div>
              <h4 className="font-medium text-text">
                {isPrivate ? "Private Account" : "Public Account"}
              </h4>
              <p className="text-sm text-text-secondary">
                {isPrivate 
                  ? "Your posts are only visible to approved followers" 
                  : "Anyone can see your posts and follow you"
                }
              </p>
            </div>
          </div>
          <button
            onClick={handlePrivacyToggle}
            disabled={isLoading}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${isPrivate 
                ? 'bg-primary' 
                : 'bg-button-secondary-bg'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${isPrivate ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </div>

      {/* Privacy Information */}
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4">
          <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            How Privacy Works
          </h4>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                <strong>Public:</strong> Anyone can see your posts and follow you
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                <strong>Private:</strong> Only approved followers can see your posts
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                <strong>Follow Requests:</strong> Users must request to follow private accounts
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                <strong>Existing Followers:</strong> Current followers remain when switching to private
              </span>
            </li>
          </ul>
        </div>

        {isPrivate && (
          <div className="bg-card-muted border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-primary" />
              <h5 className="font-medium text-text">Private Account</h5>
            </div>
            <p className="text-sm text-text-secondary">
              Your posts are only visible to approved followers. New users must request to follow you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacySettings;