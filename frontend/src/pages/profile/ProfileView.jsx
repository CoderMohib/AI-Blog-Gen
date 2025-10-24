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
  const [activeTab, setActiveTab] = useState('posts');
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const { showToast } = useToast();
  const { updateUser, user: currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/user/profile");
      setUser(res.data.user);
      
      // Fetch followers and following counts
      if (res.data.user?._id) {
        try {
          const [followersRes, followingRes] = await Promise.all([
            api.get(`/api/follow/followers/${res.data.user._id}?page=1&limit=1`),
            api.get(`/api/follow/following/${res.data.user._id}?page=1&limit=1`)
          ]);
          
          setFollowersCount(followersRes.data.pagination?.totalCount || 0);
          setFollowingCount(followingRes.data.pagination?.totalCount || 0);
        } catch (error) {
          console.error("Error fetching counts:", error);
        }
      }
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
    <div className="min-h-screen bg-background text-text p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Cover/Banner */}
          <div className="h-32 sm:h-56 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => navigate("/profile/edit")}
                className="
        flex items-center gap-2
        px-2 sm:px-3 py-2 rounded-xl font-medium
        bg-primary text-white
        hover:bg-primary/90
        shadow-sm shadow-primary/25
        transition-all duration-200 cursor-pointer
      "
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row gap-6 -mt-16 sm:-mt-20">
              {/* Profile Image */}
              <div className="flex-shrink-0 flex items-center justify-center md:items-start">
                <ProfileImageUpload
                  profileImage={user?.profileImage}
                  onImageUpdate={handleImageUpdate}
                  size="xlarge"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 mt-16 sm:mt-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-text">
                      {user?.fullName || user?.username}
                    </h1>
                    <div className="flex items-center gap-2">
                      <p className="text-text-secondary text-lg">
                        @{user?.username}
                      </p>
                      {user?.isPrivate && (
                        <div className="flex items-center gap-1  text-primary rounded-full text-sm font-medium animate-pulse">
                          <Lock className="w-4 h-4" />
                          <span>Private</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Bio */}
                {user?.bio && (
                  <p className="mt-4 text-text leading-relaxed">{user.bio}</p>
                )}

                {/* Follow Button - Only show for other users, not your own profile */}
                {currentUser?._id !== user?._id && (
                  <div className="mt-6">
                    <FollowButton 
                      userId={user?._id} 
                      user={user}
                      onFollowChange={(status) => {
                        console.log('Follow status changed:', status);
                      }}
                    />
                  </div>
                )}

                {/* Contact Info Grid */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {user?.email && (
                    <div className="flex items-center gap-3 text-text-secondary">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-text-secondary">Email</div>
                        <div className="text-sm text-text">{user.email}</div>
                      </div>
                    </div>
                  )}

                  {user?.phone && (
                    <div className="flex items-center gap-3 text-text-secondary">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-text-secondary">Phone</div>
                        <div className="text-sm text-text">{user.phone}</div>
                      </div>
                    </div>
                  )}

                  {user?.country && user.country !== "Not specified" && (
                    <div className="flex items-center gap-3 text-text-secondary">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-text-secondary">
                          Country
                        </div>
                        <div className="text-sm text-text">{user.country}</div>
                      </div>
                    </div>
                  )}

                  {user?.createdAt && (
                    <div className="flex items-center gap-3 text-text-secondary">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
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
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs Header */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'posts' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-text-secondary hover:text-text'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Posts</span>
              <span className="bg-card-muted text-text-secondary px-2 py-1 rounded-full text-xs">
                {user?.posts || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('followers')}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'followers' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-text-secondary hover:text-text'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Followers</span>
              <span className="bg-card-muted text-text-secondary px-2 py-1 rounded-full text-xs">
                {followersCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'following' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-text-secondary hover:text-text'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Following</span>
              <span className="bg-card-muted text-text-secondary px-2 py-1 rounded-full text-xs">
                {followingCount}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'posts' && (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-text-secondary/50" />
                <p className="text-text-secondary">No posts yet</p>
              </div>
            )}

            {activeTab === 'followers' && (
              <FollowersList userId={user?._id} />
            )}

            {activeTab === 'following' && (
              <FollowingList userId={user?._id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
