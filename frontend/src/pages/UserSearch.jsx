import React, { useState, useEffect } from "react";
import { Search, Users, UserCheck, UserPlus } from "lucide-react";
import { userAPI } from "@/utils/Api/userApi";
import UserCard from "@/components/organisms/UserCard";
import Loader from "@/components/atoms/Loader";
import EmptyState from "@/components/atoms/EmptyState";
import Pagination from "@/components/molecules/Pagination";

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timer = setTimeout(() => {
        searchUsers();
      }, 300); // Debounce 300ms

      return () => clearTimeout(timer);
    } else {
      setUsers([]);
      setPagination(null);
    }
  }, [searchQuery, filter, page]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const data = await userAPI.searchUsers(searchQuery, page, 20, filter);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Search Users</h1>
            <p className="text-muted-foreground">
              Find and connect with other users
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by username or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => handleFilterChange("all")}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              filter === "all"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users size={18} />
            All
          </button>
          <button
            onClick={() => handleFilterChange("following")}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              filter === "following"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserCheck size={18} />
            Following
          </button>
          <button
            onClick={() => handleFilterChange("followers")}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              filter === "followers"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus size={18} />
            Followers
          </button>
        </div>

        {/* Results */}
        <div className="bg-card border border-border rounded-lg p-6">
          {loading && <Loader text="Searching..." />}

          {!loading && searchQuery.length < 2 && (
            <EmptyState
              icon={Search}
              title="Start Searching"
              description="Type at least 2 characters to search for users"
            />
          )}

          {!loading && searchQuery.length >= 2 && users.length === 0 && (
            <EmptyState
              icon={Users}
              title="No Users Found"
              description="Try a different search term"
            />
          )}

          {!loading && users.length > 0 && (
            <div className="space-y-3">
              {users.map((user) => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
