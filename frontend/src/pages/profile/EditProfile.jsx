"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { getNames } from "country-list";
import api from "@/utils/Api/axiosInstance";
import { useToast } from "@/utils/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import DotRingSpinner from "@/components/atoms/Loader";
import EditProfileHeader from "@/components/organisms/EditProfileHeader";
import ProfilePreviewCard from "@/components/organisms/ProfilePreviewCard";
import ProfileTipsCard from "@/components/organisms/ProfileTipsCard";
import PersonalInfoForm from "@/components/organisms/PersonalInfoForm";
import ContactInfoForm from "@/components/organisms/ContactInfoForm";
import BioForm from "@/components/organisms/BioForm";
import MobileActions from "@/components/organisms/MobileActions";
import PrivacySettings from "@/components/organisms/PrivacySettings";

/* ------------------ Validation ------------------ */
const validationSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .required("Full name is required")
    .min(5, "Full name must be at least 5 characters long")
    .max(20, "Full name cannot exceed 20 characters"),
  username: Yup.string().trim().required("Username is required"),
  phone: Yup.string()
    .trim()
    .matches(/^[0-9+\- ()]*$/, "Invalid phone number")
    .nullable(),
  dob: Yup.date().nullable(),
  country: Yup.string().nullable(),
  bio: Yup.string().max(400, "Bio can't exceed 400 characters"),
});

/* ------------------ Component ------------------ */
const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const { showToast } = useToast();
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setCountries(getNames().map((n) => ({ label: n, value: n })));

    // Detect dark mode
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/user/profile");
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      showToast("Failed to load profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.patch("/api/user/profile", values);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      // Update global user state so dashboard sidebar reflects the change
      updateUser(updatedUser);
      showToast("Profile updated successfully", "success", () => {
        navigate("/profile");
      });
    } catch (err) {
      console.error(err);
      showToast(
        err?.response?.data?.message || "Failed to update profile",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <DotRingSpinner />;

  return (
    <div className="min-h-screen bg-background text-text p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <EditProfileHeader />

        <Formik
          enableReinitialize
          initialValues={{
            fullName: user?.fullName || "",
            username: user?.username || "",
            phone: user?.phone || "",
            dob: user?.dob ? new Date(user.dob) : null,
            country: user?.country || "",
            bio: user?.bio || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form id="edit-profile-form">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Preview */}
                <div className="lg:col-span-1 space-y-6">
                  <ProfilePreviewCard 
                    user={user} 
                    values={values} 
                    onImageUpdate={(newImage) => {
                      const updatedUser = { ...user, profileImage: newImage };
                      setUser(updatedUser);
                      // Update global user state so dashboard sidebar reflects the change
                      updateUser(updatedUser);
                    }}
                  />
                  <ProfileTipsCard />
                </div>

                {/* Right Column - Form */}
                <div className="lg:col-span-2 space-y-6">
                  <PersonalInfoForm 
                    isDark={isDark}
                    countries={countries}
                    setFieldValue={setFieldValue}
                    values={values}
                  />
                  <ContactInfoForm />
                  <BioForm values={values} />
                  <PrivacySettings />
                  <MobileActions isSubmitting={isSubmitting} />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditProfile;