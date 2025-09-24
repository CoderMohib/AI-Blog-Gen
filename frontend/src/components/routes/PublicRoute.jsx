import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
