import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Lock,
  Grid,
  Users as UsersIcon,
  UserCheck,
} from "lucide-react";
import { userAPI } from "@/utils/Api/userApi";
import FollowButton from "@/components/organisms/FollowButton";
import BlogCard from "@/components/organisms/BlogCard";
import UserCard from "@/components/organisms/UserCard";
import Loader from "@/components/atoms/Loader";
import EmptyState from "@/components/atoms/EmptyState";
import Pagination from "@/components/molecules/Pagination";

const UserProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("blogs");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const data = await userAPI.getUserProfile(username);
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading profile..." />;
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <EmptyState
          title="User Not Found"
          description={
            <Link to="/users/search" className="text-primary hover:underline">
              Search for users
            </Link>
          }
        />
      </div>
    );
  }

  const { user, followStatus, canViewBlogs, mutualFollowers } = profile;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src={user.profileImage?.url || "/default-avatar.png"}
              alt={user.fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-border mb-4"
            />

            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              <p className="text-muted-foreground">@{user.username}</p>

              {followStatus !== "self" && (
                <div className="pt-2">
                  <FollowButton
                    userId={user._id}
                    user={user}
                    onFollowChange={(status) => {
                      setProfile({ ...profile, followStatus: status });
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 py-4 border-y border-border">
            <div className="text-center">
              <div className="text-2xl font-bold">{user.postCount || 0}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <Link
              to={`#followers`}
              onClick={() => setActiveTab("followers")}
              className="text-center hover:text-primary transition-colors"
            >
              <div className="text-2xl font-bold">
                {user.followersCount || 0}
              </div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </Link>
            <Link
              to={`#following`}
              onClick={() => setActiveTab("following")}
              className="text-center hover:text-primary transition-colors"
            >
              <div className="text-2xl font-bold">
                {user.followingCount || 0}
              </div>
              <div className="text-sm text-muted-foreground">Following</div>
            </Link>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-center text-text-secondary mt-4 max-w-2xl mx-auto">
              {user.bio}
            </p>
          )}

          {/* Additional Info */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {user.country && user.country !== "Not specified" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} />
                <span>{user.country}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={16} />
              <span>
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            {user.isPrivate && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <Lock size={16} />
                <span>Private Account</span>
              </div>
            )}
          </div>

          {/* Mutual Followers */}
          {mutualFollowers && mutualFollowers.length > 0 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Followed by{" "}
              {mutualFollowers.map((follower, index) => (
                <span key={follower._id}>
                  <Link
                    to={`/users/${follower.username}`}
                    className="text-primary hover:underline"
                  >
                    {follower.fullName}
                  </Link>
                  {index < mutualFollowers.length - 1 && ", "}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-card border border-border rounded-lg p-1">
          <button
            onClick={() => setActiveTab("blogs")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === "blogs"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            <Grid size={18} />
            Blogs
          </button>
          <button
            onClick={() => setActiveTab("followers")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === "followers"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            <UsersIcon size={18} />
            Followers
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === "following"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            <UserCheck size={18} />
            Following
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-card border border-border rounded-lg p-6 min-h-[400px]">
          {activeTab === "blogs" &&
            (canViewBlogs ? (
              <BlogsTab username={username} />
            ) : (
              <PrivateAccountMessage username={username} />
            ))}

          {activeTab === "followers" && <FollowersTab username={username} />}

          {activeTab === "following" && <FollowingTab username={username} />}
        </div>
      </div>
    </div>
  );
};

// Private Account Message Component
const PrivateAccountMessage = ({ username }) => {
  return (
    <EmptyState
      icon={Lock}
      title="This Account is Private"
      description={`Follow @${username} to see their blogs`}
    />
  );
};

// Blogs Tab Component
const BlogsTab = ({ username }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [username, page]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await userAPI.getUserBlogs(username, page, 12);
      setBlogs(data.blogs);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (blogs.length === 0) {
    return (
      <EmptyState
        icon={Grid}
        title="No Blogs Yet"
        description="This user hasn't posted any blogs"
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
};

// Followers Tab Component
const FollowersTab = ({ username }) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchFollowers();
  }, [username, page]);

  const fetchFollowers = async () => {
    setLoading(true);
    try {
      const data = await userAPI.getUserFollowers(username, page, 20);
      setFollowers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching followers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (followers.length === 0) {
    return <EmptyState icon={UsersIcon} title="No Followers Yet" />;
  }

  return (
    <div>
      <div className="space-y-3">
        {followers.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
};

// Following Tab Component
const FollowingTab = ({ username }) => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchFollowing();
  }, [username, page]);

  const fetchFollowing = async () => {
    setLoading(true);
    try {
      const data = await userAPI.getUserFollowing(username, page, 20);
      setFollowing(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching following:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (following.length === 0) {
    return <EmptyState icon={UserCheck} title="Not Following Anyone Yet" />;
  }

  return (
    <div>
      <div className="space-y-3">
        {following.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
};

export default UserProfile;
