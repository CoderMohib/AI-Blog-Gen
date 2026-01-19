import { useState, useEffect, useCallback } from "react";
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
  Search,
  Grid3X3,
  UserCheck,
  UserPlus,
  Loader2,
} from "lucide-react";
import api from "@/utils/Api/axiosInstance";
import { useToast } from "@/utils/context/ToastContext";
import DotRingSpinner from "@/components/atoms/Loader";
import ProfileImageUpload from "@/components/organisms/ProfileImageUpload";
import FollowButton from "@/components/organisms/FollowButton";

// Custom hook for debounced search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ProfileViewTabs = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [followersPage, setFollowersPage] = useState(1);
  const [followingPage, setFollowingPage] = useState(1);
  const [followersPagination, setFollowersPagination] = useState(null);
  const [followingPagination, setFollowingPagination] = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/user/profile");
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      showToast("Failed to load profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFollowers = useCallback(
    async (page = 1, search = "") => {
      if (!user?._id) return;

      setFollowersLoading(true);
      try {
        const response = await api.get(`/api/follow/followers/${user._id}`, {
          params: { page, limit: 20, search },
        });

        if (response.data.success) {
          if (page === 1) {
            setFollowers(response.data.followers);
          } else {
            setFollowers((prev) => [...prev, ...response.data.followers]);
          }
          setFollowersPagination(response.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching followers:", error);
      } finally {
        setFollowersLoading(false);
      }
    },
    [user?._id]
  );

  const fetchFollowing = useCallback(
    async (page = 1, search = "") => {
      if (!user?._id) return;

      setFollowingLoading(true);
      try {
        const response = await api.get(`/api/follow/following/${user._id}`, {
          params: { page, limit: 20, search },
        });

        if (response.data.success) {
          if (page === 1) {
            setFollowing(response.data.following);
          } else {
            setFollowing((prev) => [...prev, ...response.data.following]);
          }
          setFollowingPagination(response.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching following:", error);
      } finally {
        setFollowingLoading(false);
      }
    },
    [user?._id]
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === "followers" && user?._id) {
      setFollowersPage(1);
      fetchFollowers(1, debouncedSearch);
    }
  }, [activeTab, user?._id, debouncedSearch, fetchFollowers]);

  useEffect(() => {
    if (activeTab === "following" && user?._id) {
      setFollowingPage(1);
      fetchFollowing(1, debouncedSearch);
    }
  }, [activeTab, user?._id, debouncedSearch, fetchFollowing]);

  const handleImageUpdate = (newImage) => {
    setUser((prev) => ({ ...prev, profileImage: newImage }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const loadMoreFollowers = () => {
    if (followersPagination?.hasNextPage && !followersLoading) {
      const nextPage = followersPage + 1;
      setFollowersPage(nextPage);
      fetchFollowers(nextPage, debouncedSearch);
    }
  };

  const loadMoreFollowing = () => {
    if (followingPagination?.hasNextPage && !followingLoading) {
      const nextPage = followingPage + 1;
      setFollowingPage(nextPage);
      fetchFollowing(nextPage, debouncedSearch);
    }
  };

  if (isLoading) return <DotRingSpinner />;

  const tabs = [
    {
      id: "posts",
      label: "Posts",
      icon: <Grid3X3 className="w-4 h-4" />,
      count: user?.postCount || 0,
    },
    {
      id: "followers",
      label: "Followers",
      icon: <UserCheck className="w-4 h-4" />,
      count: followersPagination?.totalCount || 0,
    },
    {
      id: "following",
      label: "Following",
      icon: <UserPlus className="w-4 h-4" />,
      count: followingPagination?.totalCount || 0,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Profile Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0 flex items-center justify-center md:items-start scale-95 sm:scale-100">
              <ProfileImageUpload
                profileImage={user?.profileImage}
                onImageUpdate={handleImageUpdate}
                size="xlarge"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 mt-2 sm:mt-0 min-w-0">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold text-text truncate">
                      {user?.fullName || user?.username}
                    </h1>
                    {user?.isPrivate && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium animate-pulse">
                        <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Private</span>
                      </div>
                    )}
                  </div>
                  <p className="text-text-secondary text-base sm:text-lg mb-3 sm:mb-4 break-all">
                    @{user?.username}
                  </p>

                  {/* Bio */}
                  {user?.bio && (
                    <p className="text-text leading-relaxed mb-4 break-words">
                      {user.bio}
                    </p>
                  )}

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    {user?.email && (
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm break-all">{user.email}</span>
                      </div>
                    )}
                    {user?.phone && (
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    )}
                    {user?.country && user.country !== "Not specified" && (
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">{user.country}</span>
                      </div>
                    )}
                    {user?.createdAt && (
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          Joined {formatDate(user.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Follow Button */}
                <div className="flex-shrink-0 mt-2 sm:mt-0">
                  <FollowButton
                    userId={user?._id}
                    user={user}
                    onFollowChange={(status) => {
                      console.log("Follow status changed:", status);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto">
        <div className="flex border-b border-border overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm
                border-b-2 transition-colors whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text"
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className="bg-card-muted text-text-secondary px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {activeTab === "posts" && (
            <div className="text-center py-10 sm:py-12">
              <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-text-secondary/50" />
              <p className="text-text-secondary">No posts yet</p>
            </div>
          )}

          {activeTab === "followers" && (
            <div>
              {/* Search */}
              <div className="relative mb-4 sm:mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search followers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Followers List */}
              <div className="space-y-3">
                {followers.map((follower) => (
                  <div
                    key={follower._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-card border border-border rounded-lg hover:bg-card-soft transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        {follower.profileImage?.url ? (
                          <img
                            src={follower.profileImage.url}
                            alt={follower.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-primary font-semibold">
                            {follower.fullName?.charAt(0) || "U"}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-text truncate">
                          {follower.fullName}
                        </h4>
                        <p className="text-sm text-text-secondary break-all">
                          @{follower.username}
                        </p>
                      </div>
                    </div>
                    <div className="sm:ml-4">
                      <FollowButton userId={follower._id} user={follower} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              {followersPagination?.hasNextPage && (
                <div className="text-center mt-6">
                  <button
                    onClick={loadMoreFollowers}
                    disabled={followersLoading}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    {followersLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "following" && (
            <div>
              {/* Search */}
              <div className="relative mb-4 sm:mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search following..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Following List */}
              <div className="space-y-3">
                {following.map((followingUser) => (
                  <div
                    key={followingUser._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-card border border-border rounded-lg hover:bg-card-soft transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        {followingUser.profileImage?.url ? (
                          <img
                            src={followingUser.profileImage.url}
                            alt={followingUser.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-primary font-semibold">
                            {followingUser.fullName?.charAt(0) || "U"}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-text truncate">
                          {followingUser.fullName}
                        </h4>
                        <p className="text-sm text-text-secondary break-all">
                          @{followingUser.username}
                        </p>
                      </div>
                    </div>
                    <div className="sm:ml-4">
                      <FollowButton
                        userId={followingUser._id}
                        user={followingUser}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              {followingPagination?.hasNextPage && (
                <div className="text-center mt-6">
                  <button
                    onClick={loadMoreFollowing}
                    disabled={followingLoading}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    {followingLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileViewTabs;
