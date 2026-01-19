import React from "react";
import { Link } from "react-router-dom";
import FollowButton from "../organisms/FollowButton";

const UserCard = ({ user }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all duration-200">
      <Link
        to={`/users/${user.username}`}
        className="flex items-center gap-4 flex-1 min-w-0"
      >
        <img
          src={user.profileImage?.url || "/default-avatar.png"}
          alt={user.fullName}
          className="w-14 h-14 rounded-full object-cover border-2 border-border flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{user.fullName}</h3>
          <p className="text-sm text-muted-foreground truncate">
            @{user.username}
          </p>
          {user.bio && (
            <p className="text-sm text-text-secondary mt-1 line-clamp-2">
              {user.bio}
            </p>
          )}
          {user.mutualFollowers > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Followed by {user.mutualFollowers}{" "}
              {user.mutualFollowers === 1 ? "person" : "people"} you follow
            </p>
          )}
        </div>
      </Link>
      <div className="flex-shrink-0">
        <FollowButton userId={user._id} user={user} />
      </div>
    </div>
  );
};

export default UserCard;
