import { useNavigate } from "react-router-dom";
import { PenTool, Image as ImageIcon, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const QuickPostWidget = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="bg-card p-3 sm:p-4 rounded-xl border border-border shadow-sm">
      <div className="flex items-center gap-2 sm:gap-3 mb-3">
        {/* User Avatar */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
          {user?.profileImage?.url ? (
            <img
              src={user.profileImage.url}
              alt={user.fullName || user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary font-semibold text-sm sm:text-lg">
              {(user?.fullName || user?.username || "U")
                .charAt(0)
                .toUpperCase()}
            </span>
          )}
        </div>

        {/* Input Button */}
        <button
          onClick={() => navigate("/create-blog")}
          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-card-soft hover:bg-card-muted border border-border text-left text-text-secondary transition-colors text-sm sm:text-base truncate"
        >
          <span className="hidden sm:inline">
            What's on your mind,{" "}
            {user?.fullName?.split(" ")[0] || user?.username}?
          </span>
          <span className="sm:hidden">What's on your mind?</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2 pt-3 border-t border-border">
        <button
          onClick={() => navigate("/create-blog")}
          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-card-soft transition-colors group"
        >
          <PenTool className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 group-hover:scale-110 transition-transform flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-text hidden md:inline">
            Write
          </span>
        </button>

        <button
          onClick={() => navigate("/create-blog?tab=ai")}
          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-card-soft transition-colors group"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 group-hover:scale-110 transition-transform flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-text hidden md:inline">
            AI
          </span>
        </button>

        <button
          onClick={() => navigate("/create-blog")}
          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-card-soft transition-colors group"
        >
          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 group-hover:scale-110 transition-transform flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-text hidden md:inline">
            Photo
          </span>
        </button>
      </div>
    </div>
  );
};

export default QuickPostWidget;
