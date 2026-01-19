import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/context/AuthContect";
import ProtectedRoute from "./utils/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/Signup";
import { ToastProvider } from "./utils/context/ToastContext";
import ActivationPage from "./pages/ActivationPage";
import ForgetPassword from "./pages/ForgotPassword";
import Error404 from "./pages/Error404";
import { Navigate } from "react-router-dom";
import PublicRoute from "./components/molecules/PublicRoute";
import DashboardLayout from "./components/templates/DashBoardLayout";
import EditProfile from "./pages/profile/EditProfile";
import ProfileView from "./pages/profile/ProfileView";
import UserSearch from "./pages/UserSearch";
import UserProfile from "./pages/UserProfile";
function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Unprotected Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/sign-up"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />
            <Route path="/auth/activate/:token" element={<ActivationPage />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route
              path="/forgot-password/:token"
              element={<ForgetPassword />}
            />
            {/* Protected Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/users/search" element={<UserSearch />} />
              <Route path="/users/:username" element={<UserProfile />} />
            </Route>

            <Route path="*" element={<Error404 />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
