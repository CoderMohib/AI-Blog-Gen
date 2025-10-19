"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { getNames } from "country-list";
import api from "@/utils/Api/axiosInstance";
import { useToast } from "@/utils/context/ToastContext";
import DotRingSpinner from "@/components/atoms/Loader";
import Button from "@/components/atoms/FormSubmitBtn";
import ProfileSection from "@/components/profile/ProfileSection";

// Yup Validation Schema
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  phone: Yup.string()
    .matches(/^[0-9+\- ]*$/, "Invalid phone number")
    .nullable(),
  dob: Yup.date().nullable(),
  country: Yup.string().nullable(),
  bio: Yup.string().max(300, "Bio can't exceed 300 characters"),
});

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    setCountries(getNames().map((name) => ({ label: name, value: name })));
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/user/profile");
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      showToast("Failed to load profile details", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await api.patch("/api/user/profile", values);
      showToast("Profile updated successfully!", "success");
      navigate("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast(
        err?.response?.data?.error || "Failed to update profile",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <DotRingSpinner />;

  return (
    <div className=" bg-background text-text flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold text-center sm:text-left">
            Edit Profile
          </h1>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button
              type="button"
              onClick={() => navigate("/profile")}
              className="bg-button-dark-bg text-button-dark-text hover:bg-button-dark-hover rounded-xl px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="profile-form"
              className="bg-primary text-white hover:bg-primary-dark rounded-xl px-6 py-2"
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-card rounded-2xl shadow-lg p-8 transition-all duration-300 border border-border">
          <Formik
            initialValues={{
              username: user?.username || "",
              phone: user?.phone || "",
              dob: user?.dob ? user.dob.split("T")[0] : "",
              country: user?.country || "",
              bio: user?.bio || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, values, setFieldValue, handleBlur }) => (
              <Form
                id="profile-form"
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Left column */}
                <div className="space-y-8">
                  <ProfileSection title="Personal Information">
                    <div className="space-y-4">
                      {/* Username */}
                      <div>
                        <label className="block text-sm text-text-secondary mb-1">
                          Username
                        </label>
                        <Field
                          type="text"
                          name="username"
                          className="w-full bg-input-bg border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* DOB */}
                      <div>
                        <label className="block text-sm text-text-secondary mb-1">
                          Date of Birth
                        </label>
                        <Field
                          type="date"
                          name="dob"
                          className="w-full bg-input-bg border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <ErrorMessage
                          name="dob"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                  </ProfileSection>

                  <ProfileSection title="About">
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">
                        Bio
                      </label>
                      <Field
                        as="textarea"
                        name="bio"
                        rows="5"
                        placeholder="Write something about yourself..."
                        className="w-full bg-input-bg border border-border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <ErrorMessage
                        name="bio"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </ProfileSection>
                </div>

                {/* Right column */}
                <div className="space-y-8">
                  <ProfileSection title="Contact Details">
                    <div className="space-y-4">
                      {/* Phone */}
                      <div>
                        <label className="block text-sm text-text-secondary mb-1">
                          Phone
                        </label>
                        <Field
                          type="text"
                          name="phone"
                          className="w-full bg-input-bg border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-sm text-text-secondary mb-1">
                          Country
                        </label>
                        <Select
                          name="country"
                          options={countries}
                          value={
                            values.country
                              ? { label: values.country, value: values.country }
                              : null
                          }
                          onChange={(option) =>
                            setFieldValue("country", option?.value || "")
                          }
                          onBlur={handleBlur}
                          className="text-text"
                          classNames={{
                            control: () =>
                              "bg-input-bg border border-border rounded-lg focus:ring-2 focus:ring-primary",
                          }}
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              backgroundColor: "var(--color-card)",
                            }),
                          }}
                          placeholder="Select country..."
                          isClearable
                        />
                        <ErrorMessage
                          name="country"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                  </ProfileSection>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
