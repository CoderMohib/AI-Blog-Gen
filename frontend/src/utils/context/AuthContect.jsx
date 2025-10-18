import React, { createContext, useState, useEffect } from "react";

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

  // Logout function
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setIsLoggedIn(false);

    // Clear storage
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isLoggedIn,isAuthLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
