import { useState, useEffect } from "react";
import { UserCheck, UserX, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/utils/Api/axiosInstance";

const FollowRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFollowRequests();
  }, []);

  const fetchFollowRequests = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/follow/requests");
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error("Error fetching follow requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequest = async (requestId, action) => {
    try {
      const response = await axiosInstance.put(`/api/follow/requests/${requestId}`, {
        action: action
      });
      
      if (response.data.success) {
        setRequests(prev => prev.filter(req => req._id !== requestId));
      }
    } catch (error) {
      console.error("Error handling follow request:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-card-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-card-muted rounded"></div>
            <div className="h-12 bg-card-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text">Follow Requests</h3>
          <p className="text-sm text-text-secondary">
            {requests.length} pending request{requests.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No pending follow requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <div key={request._id} className="flex items-center justify-between p-4 bg-card-soft rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {request.follower?.fullName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-text">
                    {request.follower?.fullName || 'Unknown User'}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    @{request.follower?.username || 'unknown'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRequest(request._id, 'accept')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  Accept
                </button>
                <button
                  onClick={() => handleRequest(request._id, 'reject')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-button-secondary-bg text-button-secondary-text rounded-lg hover:bg-button-secondary-hover transition-colors"
                >
                  <UserX className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowRequests;