import { User } from "lucide-react";

function ProfileAvatar({ user }) {
  return (
    <div className="w-10 h-10 rounded-full bg-card-soft flex items-center justify-center overflow-hidden shadow-lg">
      {user?.profileImage.url ? (
        <img
          src={user.profileImage.url}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
          <User className="w-1/2 h-1/2 text-primary" />
        </div>
      )}
    </div>
  );
}

export default ProfileAvatar;
