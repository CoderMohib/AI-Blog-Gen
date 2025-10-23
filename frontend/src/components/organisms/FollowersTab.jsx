import { useState, useEffect } from "react";
import { Users, UserPlus, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/utils/Api/axiosInstance";
import FollowersFollowingModal from "./FollowersFollowingModal";

const FollowersTab = ({ userId }) => {
  const { user: currentUser } = useAuth();
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState("followers");

  useEffect(() => {
    fetchCounts();
  }, [userId]);

  const fetchCounts = async () => {
    try {
      setIsLoading(true);
      
      // Fetch followers count
      const followersResponse = await axiosInstance.get(
        `/api/follow/followers/${userId}?page=1&limit=1`
      );
      
      // Fetch following count
      const followingResponse = await axiosInstance.get(
        `/api/follow/following/${userId}?page=1&limit=1`
      );

      if (followersResponse.data.success) {
        setFollowersCount(followersResponse.data.pagination?.totalCount || 0);
      }

      if (followingResponse.data.success) {
        setFollowingCount(followingResponse.data.pagination?.totalCount || 0);
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowersClick = () => {
    setModalTab("followers");
    setShowModal(true);
  };

  const handleFollowingClick = () => {
    setModalTab("following");
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-card-muted rounded w-1/3 mb-4"></div>
          <div className="flex gap-4">
            <div className="h-12 bg-card-muted rounded w-24"></div>
            <div className="h-12 bg-card-muted rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text">Followers & Following</h3>
            <p className="text-sm text-text-secondary">
              Connect with other users
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Followers */}
          <button
            onClick={handleFollowersClick}
            className="p-4 bg-card-soft rounded-xl border border-border hover:bg-card-muted transition-colors text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-medium text-text">Followers</span>
            </div>
            <div className="text-2xl font-bold text-text">
              {followersCount.toLocaleString()}
            </div>
            <p className="text-sm text-text-secondary mt-1">
              People following you
            </p>
          </button>

          {/* Following */}
          <button
            onClick={handleFollowingClick}
            className="p-4 bg-card-soft rounded-xl border border-border hover:bg-card-muted transition-colors text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <UserPlus className="w-5 h-5 text-primary" />
              <span className="font-medium text-text">Following</span>
            </div>
            <div className="text-2xl font-bold text-text">
              {followingCount.toLocaleString()}
            </div>
            <p className="text-sm text-text-secondary mt-1">
              People you follow
            </p>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex gap-3">
            <button
              onClick={handleFollowersClick}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Users className="w-4 h-4" />
              View Followers
            </button>
            <button
              onClick={handleFollowingClick}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              View Following
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <FollowersFollowingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userId={userId}
        initialTab={modalTab}
      />
    </>
  );
};

export default FollowersTab;