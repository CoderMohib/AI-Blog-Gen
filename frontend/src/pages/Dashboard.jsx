import React, { useState, useEffect } from "react";
import {
  Home,
  TrendingUp,
  Users,
  FileText,
  UserPlus,
  Bell,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/utils/Api/axiosInstance";
import FollowRequests from "@/components/organisms/FollowRequests";
import QuickPostWidget from "@/components/organisms/QuickPostWidget";

const Dashboard = () => {
  const { user } = useAuth();
  const [followRequestsCount, setFollowRequestsCount] = useState(0);
  const [showFollowRequests, setShowFollowRequests] = useState(false);

  useEffect(() => {
    fetchFollowRequestsCount();
  }, []);

  const fetchFollowRequestsCount = async () => {
    try {
      const response = await api.get("/api/follow-requests");
      setFollowRequestsCount(response.data.followRequests.length);
    } catch (error) {
      console.error("Failed to fetch follow requests count:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6 px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 md:mb-6">
        <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
          <Home className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Welcome back, {user?.fullName || user?.username}!
          </p>
        </div>
      </div>

      {/* Quick Post Widget */}
      <QuickPostWidget />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 md:mb-6">
        <div className="bg-card p-4 sm:p-6 rounded-lg border">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold">My Blogs</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage content
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card p-4 sm:p-6 rounded-lg border">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold">Analytics</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                View stats
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card p-4 sm:p-6 rounded-lg border">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold">Followers</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Connections
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card p-4 sm:p-6 rounded-lg border">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold">
                Notifications
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {followRequestsCount} pending
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Follow Requests Section */}
      {followRequestsCount > 0 && (
        <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">
                Follow Requests ({followRequestsCount})
              </span>
              <span className="sm:hidden">
                Requests ({followRequestsCount})
              </span>
            </h2>
            <button
              onClick={() => setShowFollowRequests(!showFollowRequests)}
              className="text-xs sm:text-sm text-primary hover:text-primary/80"
            >
              {showFollowRequests ? "Hide" : "View All"}
            </button>
          </div>

          {showFollowRequests && <FollowRequests />}
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-card p-4 sm:p-6 rounded-lg border">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Recent Activity
        </h2>
        <div className="text-center py-6 sm:py-8 text-muted-foreground">
          <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm sm:text-base">No recent activity to show</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
