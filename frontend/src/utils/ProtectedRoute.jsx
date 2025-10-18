import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import DotRingSpinner from "@/components/atoms/Loader";

const ProtectedRoute = ({ children }) => {
  const { user, isAuthLoading } = useAuth();
  if (isAuthLoading) {
    // You can replace this with a proper spinner or skeleton
    return <DotRingSpinner />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
