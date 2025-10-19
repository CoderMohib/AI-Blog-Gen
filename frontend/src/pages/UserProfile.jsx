"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Camera, User, Trash2 } from "lucide-react";
import api from "@/utils/Api/axiosInstance";
import DotRingSpinner from "@/components/atoms/Loader";
import Button from "@/components/atoms/FormSubmitBtn";
import ProfileField from "@/components/profile/ProfileField";
import ProfileSection from "@/components/profile/ProfileSection";
import StatCard from "@/components/profile/StatCard";
import { useToast } from "@/utils/context/ToastContext";

const UserProfile = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/user/profile");
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await api.patch("/api/user/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Profile image updated successfully", "success");
      setUser({ ...user, profileImage: response.data.profileImage });
      setSelectedImage(null);
    } catch (err) {
      console.error("Failed to upload image", err);
      showToast(
        err?.response?.data?.error || "Failed to update profile image",
        "error"
      );
    } finally {
      setUploading(false);
      setIsModalOpen(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await api.delete("/api/user/profile-image");
      showToast("Profile image deleted successfully", "success");
      setUser({ ...user, profileImage: null });
      setSelectedImage(null);
      setIsModalOpen(false);
    } catch (err) {
      showToast(
        err?.response?.data?.error || "Failed to delete profile image",
        "error"
      );
      console.error("Failed to remove image", err);
    }
  };

  if (isLoading) return <DotRingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 text-text bg-background overflow-x-hidden">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="flex flex-col justify-between w-full lg:w-1/3 bg-card shadow-lg rounded-2xl p-6">
          {/* Top: Avatar + Name */}
          <div className="flex flex-col items-center lg:items-center">
            <div className="w-28 sm:w-32 h-28 sm:h-32 mb-4 relative cursor-pointer">
              {user.profileImage?.url ? (
                <img
                  src={user.profileImage.url}
                  alt={user.fullName}
                  title="Click to view profile image"
                  className="w-full h-full object-cover rounded-full border-4 border-border"
                  onClick={() => setIsModalOpen(true)}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-card-muted flex items-center justify-center border-4 border-border">
                  <User className="w-12 h-12 text-text-secondary" />
                </div>
              )}

              {/* Upload Button Overlay */}
              <label
                className="absolute bottom-0 right-0 bg-button-dark-bg rounded-full p-2 cursor-pointer text-button-dark-text
                    border border-button-border
                    hover:bg-card-muted 
                    hover:text-text"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Camera className="w-5 h-5" />
              </label>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 sm:p-6"
                onClick={() => setIsModalOpen(false)}
              >
                <div
                  className="bg-card rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md md:max-w-lg relative flex flex-col items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Profile Image */}
                  {user.profileImage?.url ? (
                    <img
                      src={user.profileImage.url}
                      alt={user.fullName}
                      className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full object-cover mb-4"
                    />
                  ) : (
                    <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center bg-card-muted rounded-full border-4 border-border mb-4">
                      <User className="w-12 h-12 text-text-secondary" />
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full justify-center">
                    {/* Upload */}
                    <label
                      className="w-full sm:w-50 flex items-center justify-center gap-1 px-4 py-3 rounded-xl cursor-pointer transition bg-button-dark-hover 
                    text-button-dark-text
                    border border-button-border
                    hover:bg-card-muted 
                    hover:text-text"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Camera className="w-5 h-5" /> Upload
                    </label>

                    {/* Remove */}
                    {user.profileImage?.url && (
                      <Button
                        onClick={handleRemovePhoto}
                        className="flex items-center justify-center gap-1 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
                      >
                        <Trash2 className="w-5 h-5" /> Remove
                      </Button>
                    )}

                    {/* Cancel */}
                    <Button
                      onClick={() => setIsModalOpen(false)}
                      className="flex items-center justify-center gap-1 bg-button-dark-bg text-button-dark-text  rounded-xl hover:bg-button-dark-hover transition "
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold mb-1 text-center">
              {user.fullName}
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mb-2 text-center">
              @{user.username}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-2 w-full mt-2.5">
              <StatCard label="Posts" value={user.posts || 0} />
              <StatCard label="Followers" value={user.followers || 0} />
              <StatCard label="Following" value={user.following || 0} />
            </div>
          </div>

          {/* Bottom: Edit Button */}
          <div className="mt-6 flex justify-center lg:justify-stretch">
            <Button>Edit Profile</Button>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col gap-6">
          <ProfileSection title="Personal Information">
            <ProfileField label="Full Name" value={user.fullName} />
            <ProfileField label="Username" value={user.username || "N/A"} />
            <ProfileField
              label="Date of Birth"
              value={user.dob || "Not provided"}
            />
          </ProfileSection>

          <ProfileSection title="Contact Details">
            <ProfileField label="Email" value={user.email} />
            <ProfileField label="Phone" value={user.phone || "Not provided"} />
            <ProfileField
              label="Country"
              value={user.country || "Not specified"}
            />
          </ProfileSection>

          <ProfileSection title="About" fullWidth>
            <p className="text-text-secondary leading-relaxed">
              {user.bio || "No bio provided yet."}
            </p>
          </ProfileSection>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
