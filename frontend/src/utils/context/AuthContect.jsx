import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../Api/axiosInstance";
const BASE_URL = import.meta.env.VITE_BACKEND_APP_API_URL;

// Create Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Load token from localStorage when app starts
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setAccessToken(storedToken);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoggedIn(true);
    }
    setIsAuthLoading(false);
  }, []);

  // Login function
  const login = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
    setIsLoggedIn(true);

    // Save in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", token);
  };

  // Update user function
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    // Update localStorage as well
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  // Logout function
  const logout = async () => {
    try {
      // Call backend logout to clear refresh token cookie
      await api.post(`/api/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with client-side logout even if backend call fails
    } finally {
      // Clear client-side state
      setUser(null);
      setAccessToken(null);
      setIsLoggedIn(false);

      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to login
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isLoggedIn, isAuthLoading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
