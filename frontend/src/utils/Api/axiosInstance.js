import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_APP_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ important for refresh token cookie
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and it's not already a retry and not the refresh endpoint itself
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url?.includes("/api/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const res = await api.post("/api/refresh");
        localStorage.setItem("accessToken", res.data.accessToken);

        // retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        // If refresh fails (401 or 403), clear storage and redirect to login
        console.error("Token refresh failed:", err.response?.data?.message || err.message);
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    // If refresh token itself is invalid (403), clear and redirect
    if (
      error.response?.status === 403 && 
      originalRequest.url?.includes("/api/refresh")
    ) {
      console.error("Refresh token expired or invalid");
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
