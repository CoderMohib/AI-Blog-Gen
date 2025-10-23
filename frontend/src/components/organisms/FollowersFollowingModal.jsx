import { useState } from "react";
import { X, Users, UserPlus } from "lucide-react";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";

const FollowersFollowingModal = ({ isOpen, onClose, userId, initialTab = "followers" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("followers")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "followers"
                  ? "bg-primary text-white"
                  : "bg-card-soft text-text hover:bg-card-muted"
              }`}
            >
              <Users className="w-4 h-4" />
              Followers
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "following"
                  ? "bg-primary text-white"
                  : "bg-card-soft text-text hover:bg-card-muted"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Following
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-card-soft rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {activeTab === "followers" ? (
            <FollowersList userId={userId} />
          ) : (
            <FollowingList userId={userId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersFollowingModal;