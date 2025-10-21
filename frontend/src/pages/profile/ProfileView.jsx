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
} from "lucide-react";
import api from "@/utils/Api/axiosInstance";
import { useToast } from "@/utils/context/ToastContext";
import DotRingSpinner from "@/components/atoms/Loader";
import ProfileImageUpload from "@/components/organisms/ProfileImageUpload";

const ProfileView = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    fetchProfile();
  }, []);

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

  if (isLoading) return <DotRingSpinner />;

  return (
    <div className="min-h-screen bg-background text-text p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Edit Button */}
        {/*  */}

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
                    <p className="text-text-secondary text-lg">
                      @{user?.username}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {user?.posts || 0}
                      </div>
                      <div className="text-sm text-text-secondary">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {user?.followers || 0}
                      </div>
                      <div className="text-sm text-text-secondary">
                        Followers
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {user?.following || 0}
                      </div>
                      <div className="text-sm text-text-secondary">
                        Following
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {user?.bio && (
                  <p className="mt-4 text-text leading-relaxed">{user.bio}</p>
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

        {/* Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Posts */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Recent Posts
            </h2>
            <div className="text-center py-12 text-text-secondary">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-text-secondary/50" />
              <p>No posts yet</p>
            </div>
          </div>

          {/* Activity Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Activity
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-card-soft rounded-xl">
                <div className="text-2xl font-bold text-primary">
                  {user?.posts || 0}
                </div>
                <div className="text-sm text-text-secondary">Total Posts</div>
              </div>
              <div className="p-4 bg-card-soft rounded-xl">
                <div className="text-2xl font-bold text-primary">
                  {user?.followers || 0}
                </div>
                <div className="text-sm text-text-secondary">Followers</div>
              </div>
              <div className="p-4 bg-card-soft rounded-xl">
                <div className="text-2xl font-bold text-primary">
                  {user?.following || 0}
                </div>
                <div className="text-sm text-text-secondary">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
