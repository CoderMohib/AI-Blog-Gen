// src/pages/ActivationPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/utils/Api/axiosInstance";
import { Loader2 } from "lucide-react";
import { useToast } from "@/utils/context/ToastContext";

const ActivationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // ✅ prevents duplicate calls in StrictMode

    const activateAccount = async () => {
      try {
        const res = await api.get(`/api/auth/activate/${token}`);
        if (!isMounted) return;

        showToast(
          res.data.message || "Account activated successfully!",
          "success",
          () => navigate("/login")
        );
      } catch (err) {
        if (!isMounted) return;

        showToast(
          err?.response?.data?.message ||
            err?.message ||
            "Activation failed. Try again later.",
          "error",
          () => navigate("/sign-up")
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (token) activateAccount();
    else {
      showToast("Invalid activation link.", "error", () => navigate("/sign-up"));
      setLoading(false);
    }

    return () => {
      isMounted = false; // ✅ cleanup on unmount
    };
  }, [token, navigate, showToast]);

  if (!loading) {
    // ✅ once done, let toast handle all UI
    return null;
  }

  // ✅ loader while waiting for API
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-card rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <Loader2 className="mx-auto h-12 w-12 text-text animate-spin" />
        <h2 className="mt-4 text-lg font-semibold text-text">
          Activating your account...
        </h2>
        <p className="text-text-secondary text-sm mt-2">
          Please wait while we verify your token.
        </p>
      </div>
    </div>
  );
};

export default ActivationPage;
