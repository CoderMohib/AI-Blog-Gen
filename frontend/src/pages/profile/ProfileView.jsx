"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Globe,
  Calendar,
  Users,
  Image as ImageIcon,
  Edit,
  Lock,
} from "lucide-react";
import FollowButton from "@/components/organisms/FollowButton";
import FollowersList from "@/components/organisms/FollowersList";
import FollowingList from "@/components/organisms/FollowingList";
import api from "@/utils/Api/axiosInstance";
import { useToast } from "@/utils/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import DotRingSpinner from "@/components/atoms/Loader";
import ProfileImageUpload from "@/components/organisms/ProfileImageUpload";

const ProfileView = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const { showToast } = useToast();
  const { updateUser, user: currentUser, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/user/profile");
      setUser(res.data.user);

      // Counts are now included in the profile response
      setFollowersCount(res.data.user?.followersCount || 0);
      setFollowingCount(res.data.user?.followingCount || 0);
    } catch (err) {
      console.error(err);
      showToast("Failed to load profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageUpdate = (newImage) => {
    const updatedUser = { ...user, profileImage: newImage };
    setUser(updatedUser);
    // Update global user state so dashboard sidebar reflects the change
    updateUser(updatedUser);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) return <DotRingSpinner />;

  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden w-full">
      <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto w-full">
          {/* Profile Header Card */}
          <div className="bg-card border border-border rounded-lg sm:rounded-2xl shadow-xl overflow-hidden mb-4 sm:mb-6">
            {/* Cover/Banner */}
            <div className="h-32 sm:h-44 md:h-56 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 relative">
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/25 transition-all duration-200"
                >
                  <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="px-3 sm:px-6 pb-6">
              {/* Mobile Layout: Centered Avatar + Info Below */}
              <div className="sm:hidden">
                {/* Avatar - Centered */}
                <div className="flex justify-center -mt-16">
                  <ProfileImageUpload
                    profileImage={user?.profileImage}
                    onImageUpdate={handleImageUpdate}
                    size="large"
                  />
                </div>

                {/* User Info - Centered */}
                <div className="mt-4 text-center">
                  <h1 className="text-xl sm:text-2xl font-bold text-text px-2">
                    {user?.fullName || user?.username}
                  </h1>
                  <div className="flex items-center justify-center gap-2 flex-wrap mt-1 px-2 ">
                    <p className="text-text-secondary text-sm sm:text-base break-all">
                      @{user?.username}
                    </p>
                    {user?.isPrivate && (
                      <div className="flex items-center gap-1 text-primary rounded-full text-xs font-medium animate-pulse">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Private</span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  {user?.bio && (
                    <p className="mt-3 text-sm text-text leading-relaxed break-words px-2">
                      {user.bio}
                    </p>
                  )}

                  {/* Contact Info Grid */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left justify-center">
                    {user?.email && (
                      <div className="flex items-center gap-3 text-text-secondary">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-text-secondary">
                            Email
                          </div>
                          <div className="text-xs sm:text-sm text-text break-all">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    )}

                    {user?.phone && (
                      <div className="flex items-center gap-3 text-text-secondary">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-text-secondary">
                            Phone
                          </div>
                          <div className="text-xs sm:text-sm text-text">
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    )}

                    {user?.country && user.country !== "Not specified" && (
                      <div className="flex items-center gap-3 text-text-secondary">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Globe className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-text-secondary">
                            Country
                          </div>
                          <div className="text-xs sm:text-sm text-text">
                            {user.country}
                          </div>
                        </div>
                      </div>
                    )}

                    {user?.createdAt && (
                      <div className="flex items-center gap-3 text-text-secondary">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-text-secondary">
                            Joined
                          </div>
                          <div className="text-xs sm:text-sm text-text">
                            {formatDate(user.createdAt.$date || user.createdAt)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Desktop/Tablet Layout: Side by Side */}
              <div className="hidden sm:flex md:flex-row md:items-start gap-6 -mt-20">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <ProfileImageUpload
                    profileImage={user?.profileImage}
                    onImageUpdate={handleImageUpdate}
                    size="xlarge"
                  />
                </div>

                {/* User Info */}
                <div className="flex-1 mt-2 min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h1 className="text-3xl font-bold text-text truncate">
                        {user?.fullName || user?.username}
                      </h1>
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        <p className="text-text-secondary text-lg break-all">
                          @{user?.username}
                        </p>
                        {user?.isPrivate && (
                          <div className="flex items-center gap-1 text-primary rounded-full text-sm font-medium animate-pulse">
                            <Lock className="w-4 h-4" />
                            <span>Private</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {user?.bio && (
                    <p className="mt-4 text-text leading-relaxed break-words">
                      {user.bio}
                    </p>
                  )}

                  {/* Contact Info Grid */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.email && (
                      <div className="flex items-center gap-3 text-text-secondary">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-text-secondary">
                            Email
                          </div>
                          <div className="text-sm text-text break-all">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    )}

                    {user?.phone && (
                      <div className="flex items-center gap-3 text-text-secondary">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-text-secondary">
                            Phone
                          </div>
                          <div className="text-sm text-text">{user.phone}</div>
                        </div>
                      </div>
                    )}

                    {user?.country && user.country !== "Not specified" && (
                      <div className="flex items-center gap-3 text-text-secondary">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Globe className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-text-secondary">
                            Country
                          </div>
                          <div className="text-sm text-text">
                            {user.country}
                          </div>
                        </div>
                      </div>
                    )}

                    {user?.createdAt && (
                      <div className="flex items-center gap-3 text-text-secondary">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-text-secondary">
                            Joined
                          </div>
                          <div className="text-sm text-text">
                            {formatDate(user.createdAt.$date || user.createdAt)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-card border border-border rounded-lg sm:rounded-2xl shadow-xl overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-border overflow-x-auto">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 md:px-6 py-2 sm:py-4 font-medium text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === "posts"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text"
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5 sm:w-4 sm:h-4" />
                <span>Posts</span>
                <span className="bg-card-muted text-text-secondary px-1 sm:px-1.5 py-0.5 sm:py-1 rounded-full text-xs">
                  {user?.postCount || 0}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("followers")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 md:px-6 py-2 sm:py-4 font-medium text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === "followers"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text"
                }`}
              >
                <Users className="h-3.5 w-3.5 sm:w-4 sm:h-4" />
                <span>Followers</span>
                <span className="bg-card-muted text-text-secondary px-1 sm:px-1.5 py-0.5 sm:py-1 rounded-full text-xs">
                  {followersCount}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 md:px-6 py-2 sm:py-4 font-medium text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === "following"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text"
                }`}
              >
                <Users className="h-3.5 w-3.5 sm:w-4 sm:h-4" />
                <span>Following</span>
                <span className="bg-card-muted text-text-secondary px-1 sm:px-1.5 py-0.5 sm:py-1 rounded-full text-xs">
                  {followingCount}
                </span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-3 sm:p-4 md:p-6">
              {activeTab === "posts" && (
                <div className="text-center py-10 sm:py-12">
                  <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-text-secondary/50" />
                  <p className="text-text-secondary text-sm sm:text-base">
                    No posts yet
                  </p>
                </div>
              )}

              {activeTab === "followers" && (
                <FollowersList userId={user?._id} />
              )}

              {activeTab === "following" && (
                <FollowingList userId={user?._id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
