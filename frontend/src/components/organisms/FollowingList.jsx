import { useState, useEffect, useCallback } from "react";
import { Search, UserPlus, UserCheck, UserX } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/utils/Api/axiosInstance";
import FollowButton from "./FollowButton";

const FollowingList = ({ userId, onClose }) => {
  const { user: currentUser } = useAuth();
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Load initial data immediately
  useEffect(() => {
    fetchFollowing(false);
  }, [userId]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        // User is searching - show skeleton and search
        fetchFollowing(true);
      } else {
        // User cleared search - go back to original data
        fetchFollowing(false);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentPage]);

  const fetchFollowing = useCallback(async (isSearch = false) => {
    try {
      setIsLoading(true);
      if (isSearch) {
        setIsSearching(true);
      }
      const response = await axiosInstance.get(
        `/api/follow/following/${userId}?page=${currentPage}&limit=20&search=${searchTerm}`
      );
      
      if (response.data.success) {
        setFollowing(response.data.following || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setHasNextPage(response.data.pagination?.hasNextPage || false);
        setHasPrevPage(response.data.pagination?.hasPrevPage || false);
      }
    } catch (error) {
      console.error("Error fetching following:", error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [userId, currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
    // Show searching state while debouncing
    setIsSearching(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-text">Following</h3>
            <p className="text-xs sm:text-sm text-text-secondary">
              {following.length} following
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-card-soft rounded-lg transition-colors flex-shrink-0"
          >
            <UserX className="w-5 h-5 text-text-secondary" />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Search following..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 bg-card-soft border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text text-sm"
        />
      </div>

      {/* Following List */}
      {isSearching ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <div className="animate-pulse">
            <div className="h-16 bg-card-muted rounded-xl mb-3"></div>
            <div className="h-16 bg-card-muted rounded-xl mb-3"></div>
            <div className="h-16 bg-card-muted rounded-xl mb-3"></div>
          </div>
        </div>
      ) : following.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <UserPlus className="w-10 h-10 sm:w-12 sm:h-12 text-text-secondary mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-text-secondary px-2">
            {searchTerm ? "No following found matching your search" : "Not following anyone yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
          {following.map((followingUser) => (
            <div key={followingUser._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-card-soft rounded-lg sm:rounded-xl border border-border">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  {followingUser.profileImage ? (
                    <img
                      src={followingUser.profileImage}
                      alt={followingUser.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary font-semibold text-sm">
                      {followingUser.fullName?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-sm sm:text-base text-text truncate">
                    {followingUser.fullName || 'Unknown User'}
                  </h4>
                  <p className="text-xs sm:text-sm text-text-secondary break-all">
                    @{followingUser.username || 'unknown'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:ml-4">
                {currentUser?._id !== followingUser._id && (
                  <FollowButton 
                    userId={followingUser._id} 
                    user={followingUser}
                    onFollowChange={() => fetchFollowing()}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 sm:mt-6 pt-4 border-t border-border gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-card-soft text-text text-xs sm:text-sm rounded-lg hover:bg-card-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-xs sm:text-sm text-text-secondary whitespace-nowrap">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-card-soft text-text text-xs sm:text-sm rounded-lg hover:bg-card-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FollowingList;
