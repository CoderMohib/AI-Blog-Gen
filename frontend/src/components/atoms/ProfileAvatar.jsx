import { User } from "lucide-react";


function ProfileAvatar({ user }) {
  
  return (
    <div className="w-10 h-10 rounded-full bg-card-soft flex items-center justify-center overflow-hidden shadow-lg" >
      {user?.profileImage.url ? (
        <img
          src={user.profileImage.url}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <User className="w-6 h-6 text-text-secondary" />
      )}
    </div>
  );
}

export default ProfileAvatar;
