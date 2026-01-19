import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// User search and profile APIs
export const userAPI = {
  // Search users
  searchUsers: async (query, page = 1, limit = 20, filter = "all") => {
    const response = await api.get("/api/users/search", {
      params: { q: query, page, limit, filter },
    });
    return response.data;
  },

  // Get user profile
  getUserProfile: async (username) => {
    const response = await api.get(`/api/users/${username}/profile`);
    return response.data;
  },

  // Get user blogs
  getUserBlogs: async (username, page = 1, limit = 10) => {
    const response = await api.get(`/api/users/${username}/blogs`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get user followers
  getUserFollowers: async (username, page = 1, limit = 20, search = "") => {
    const response = await api.get(`/api/users/${username}/followers`, {
      params: { page, limit, search },
    });
    return response.data;
  },

  // Get user following
  getUserFollowing: async (username, page = 1, limit = 20, search = "") => {
    const response = await api.get(`/api/users/${username}/following`, {
      params: { page, limit, search },
    });
    return response.data;
  },
};

// Follow APIs
export const followAPI = {
  // Follow user
  followUser: async (userId) => {
    const response = await api.post(`/api/follow/${userId}`);
    return response.data;
  },

  // Unfollow user
  unfollowUser: async (userId) => {
    const response = await api.delete(`/api/follow/${userId}`);
    return response.data;
  },

  // Get follow status
  getFollowStatus: async (userId) => {
    const response = await api.get(`/api/follow/status/${userId}`);
    return response.data;
  },

  // Get follow requests
  getFollowRequests: async () => {
    const response = await api.get("/api/follow/requests");
    return response.data;
  },

  // Accept follow request
  acceptFollowRequest: async (requestId) => {
    const response = await api.put(`/api/follow/requests/${requestId}/accept`);
    return response.data;
  },

  // Reject follow request
  rejectFollowRequest: async (requestId) => {
    const response = await api.put(`/api/follow/requests/${requestId}/reject`);
    return response.data;
  },
};

export default api;
