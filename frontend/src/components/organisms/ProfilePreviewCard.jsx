import { Globe, Phone, Lock } from "lucide-react";
import ProfileImageUpload from "./ProfileImageUpload";

const ProfilePreviewCard = ({ user, values, onImageUpdate }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
      <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-6">
        Profile Preview
      </h3>

      <div className="flex flex-col items-center text-center">
        {/* Profile Image with Upload */}
        <div className="mb-4">
          <ProfileImageUpload
            profileImage={user?.profileImage}
            onImageUpdate={onImageUpdate}
            size="large"
          />
        </div>

        <h3 className="text-xl font-bold mb-1 break-words max-w-full px-2">
          {values.fullName || user?.fullName || "Full Name"}
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-text-secondary text-sm break-words max-w-full px-2">
            @{values.username || user?.username || "username"}
          </p>
          {user?.isPrivate && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium animate-pulse">
              <Lock className="w-3 h-3" />
              <span>Private</span>
            </div>
          )}
        </div>

        {values.bio && (
          <div className="w-full px-2 mb-4">
            <p className="text-sm text-text-secondary leading-relaxed line-clamp-4 break-words overflow-hidden text-ellipsis">
              {values.bio}
            </p>
          </div>
        )}

        {/* Info */}
        <div className="w-full mt-2 pt-6 border-t border-border space-y-3">
          {values.country && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-text-secondary flex-shrink-0" />
              <span className="text-text truncate">
                {values.country}
              </span>
            </div>
          )}
          {values.phone && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-text-secondary flex-shrink-0" />
              <span className="text-text break-all">
                {values.phone}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePreviewCard;


