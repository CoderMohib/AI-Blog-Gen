"use client";
import { useState, useEffect } from "react";
import { Camera, User } from "lucide-react";
import api from "@/utils/Api/axiosInstance";
import { useToast } from "@/utils/context/ToastContext";
import ImageViewModal from "./ImageViewModal";

const ProfileImageUpload = ({
  profileImage,
  onImageUpdate,
  size = "large",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { showToast } = useToast();

  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32",
    xlarge: "w-40 h-40",
  };

  // Detect theme
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size should be less than 5MB", "error");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await api.patch("/api/user/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onImageUpdate(res.data.profileImage);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast(
        err?.response?.data?.error || "Failed to upload image",
        "error",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    // Only call API if there's an existing image
    if (!profileImage?.url) {
      showToast("No image to remove", "info");
      setIsModalOpen(false);
      return;
    }

    try {
      setIsUploading(true);
      await api.delete("/api/user/profile-image");
      onImageUpdate(null);
      setIsModalOpen(false);
      showToast("Profile image removed successfully", "success");
    } catch (err) {
      console.error(err);
      showToast(
        err?.response?.data?.error || "Failed to remove image",
        "error",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="relative group">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className={`${sizeClasses[size]} rounded-full overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-200 relative cursor-pointer`}
        >
          {profileImage?.url ? (
            <img
              src={profileImage.url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-full">
              {/* Base background — conditional based on theme */}
              <div
                className={`absolute inset-0 backdrop-blur-sm z-0 ${
                  isDark ? "bg-gray-800" : "bg-gradient-to-br bg-gray-100"
                }`}
              />

              {/* Subtle gradient accent */}
              <div
                className={`absolute inset-0 bg-gradient-to-br z-0 ${
                  isDark
                    ? "from-primary/20 to-primary/5"
                    : "from-primary/20 to-primary/5"
                }`}
              />

              {/* Icon */}
              <User className="relative w-1/2 h-1/2 text-primary z-10 opacity-90" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-20">
            <Camera className="w-8 h-8 text-white" />
          </div>
        </button>
      </div>

      <ImageViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={profileImage?.url}
        onUpload={handleUpload}
        onRemove={handleRemove}
        isUploading={isUploading}
      />
    </>
  );
};

export default ProfileImageUpload;
