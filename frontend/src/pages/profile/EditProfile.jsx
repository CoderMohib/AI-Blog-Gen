"use client";
import { useEffect, useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { getNames } from "country-list";
import DatePicker from "react-datepicker";
import TextareaAutosize from "react-textarea-autosize";
import api from "@/utils/Api/axiosInstance";
import { useToast } from "@/utils/context/ToastContext";
import DotRingSpinner from "@/components/atoms/Loader";
import Button from "@/components/atoms/FormSubmitBtn";
import { Calendar, User, Phone, Globe, FileText } from "lucide-react";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";

/* ------------------ Validation ------------------ */
const validationSchema = Yup.object({
  username: Yup.string().trim().required("Username is required"),
  phone: Yup.string()
    .trim()
    .matches(/^[0-9+\- ()]*$/, "Invalid phone number")
    .nullable(),
  dob: Yup.date().nullable(),
  country: Yup.string().nullable(),
  bio: Yup.string().max(400, "Bio can't exceed 400 characters"),
});

/* ------------------ Custom Date Input ------------------ */
const DateInput = forwardRef(({ value, onClick }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="w-full text-left bg-input-bg border border-border rounded-xl px-4 py-3 flex items-center justify-between hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 group"
  >
    <span className={value ? "text-text" : "text-text-secondary"}>
      {value || "Select date"}
    </span>
    <Calendar className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
  </button>
));
DateInput.displayName = "DateInput";

/* ------------------ React Select Custom Styles ------------------ */
const getSelectStyles = (isDark) => ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: isDark ? "#121212" : "#ffffff",
    borderRadius: "0.75rem",
    minHeight: "48px",
    borderColor: state.isFocused
      ? isDark
        ? "#1e90ff"
        : "#2563eb"
      : isDark
      ? "#222222"
      : "#e5e7eb",
    boxShadow: state.isFocused
      ? isDark
        ? "0 0 0 3px rgba(30, 144, 255, 0.1)"
        : "0 0 0 3px rgba(37, 99, 235, 0.1)"
      : "none",
    transition: "all 0.2s",
    "&:hover": {
      borderColor: isDark ? "#1e90ff" : "#2563eb",
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.75rem",
    backgroundColor: isDark ? "#121212" : "#ffffff",
    border: `1px solid ${isDark ? "#222222" : "#e5e7eb"}`,
    boxShadow: isDark
      ? "0 10px 40px rgba(0, 0, 0, 0.5)"
      : "0 10px 40px rgba(0, 0, 0, 0.15)",
    overflow: "hidden",
    zIndex: 100,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: "0.5rem",
    maxHeight: "240px",
    backgroundColor: isDark ? "#121212" : "#ffffff",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? isDark
        ? "#1a1a1a"
        : "#f3f4f6"
      : "transparent",
    color: isDark ? "#ffffff" : "#111827",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "all 0.15s",
    "&:active": {
      backgroundColor: isDark ? "#1a1a1a" : "#f3f4f6",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: isDark ? "#ffffff" : "#111827",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: isDark ? "#b0b0b0" : "#9ca3af",
  }),
  input: (provided) => ({
    ...provided,
    color: isDark ? "#ffffff" : "#111827",
  }),
});

/* ------------------ Component ------------------ */
const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const { showToast } = useToast();
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
      await api.patch("/api/user/profile", values);
      showToast("Profile updated", "success");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      showToast(
        err?.response?.data?.error || "Failed to update profile",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpdate = (newImage) => {
    setUser((prev) => ({ ...prev, profileImage: newImage }));
  };

  if (isLoading) return <DotRingSpinner />;

  return (
    <div className="min-h-screen bg-background text-text p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Edit Profile
            </h1>
            <p className="text-text-secondary mt-2 text-sm">
              Update your personal information and preferences
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-6 py-2.5 rounded-xl border border-border bg-card hover:bg-card-muted text-text font-medium transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-profile-form"
              className="px-6 py-2.5 rounded-xl bg-primary hover:brightness-110 text-white font-medium shadow-lg shadow-primary/25 transition-all duration-200"
            >
              Save Changes
            </Button>
          </div>
        </div>

        <Formik
          enableReinitialize
          initialValues={{
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
                  {/* Profile Preview Card */}
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-6">
                      Profile Preview
                    </h3>

                    <div className="flex flex-col items-center text-center">
                      {/* Profile Image with Upload */}
                      <div className="mb-4">
                        <ProfileImageUpload
                          profileImage={user?.profileImage}
                          onImageUpdate={handleImageUpdate}
                          size="large"
                        />
                      </div>

                      <h3 className="text-xl font-bold mb-1 break-words max-w-full px-2">
                        {user?.fullName || values.username || "Username"}
                      </h3>
                      <p className="text-text-secondary text-sm mb-4 break-words max-w-full px-2">
                        @{values.username || "username"}
                      </p>

                      {values.bio && (
                        <div className="w-full px-2 mb-4">
                          <p className="text-sm text-text-secondary leading-relaxed line-clamp-4 break-words overflow-hidden text-ellipsis">
                            {values.bio}
                          </p>
                        </div>
                      )}

                      {/* Info */}
                      <div className="w-full mt-2 pt-6 border-t border-border space-y-3">
                        {values.country && (
                          <div className="flex items-center justify-center gap-2 text-sm">
                            <Globe className="w-4 h-4 text-text-secondary flex-shrink-0" />
                            <span className="text-text truncate">
                              {values.country}
                            </span>
                          </div>
                        )}
                        {values.phone && (
                          <div className="flex items-center justify-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-text-secondary flex-shrink-0" />
                            <span className="text-text break-all">
                              {values.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Tips */}
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6">
                    <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Profile Tips
                    </h4>
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>
                          Choose a unique username that represents you
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Write a compelling bio to tell your story</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Keep your contact information up to date</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right Column - Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Personal Information */}
                  <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">
                        Personal Information
                      </h2>
                    </div>

                    <div className="space-y-5">
                      {/* Username */}
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Username <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="username"
                          className="w-full bg-input-bg border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-secondary hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                          placeholder="Enter your username"
                        />
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="text-red-500 text-sm mt-2 flex items-center gap-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Date of Birth */}
                        <div>
                          <label className="block text-sm font-medium text-text mb-2">
                            Date of Birth
                          </label>
                          <DatePicker
                            selected={values.dob}
                            onChange={(d) => setFieldValue("dob", d)}
                            dateFormat="yyyy-MM-dd"
                            isClearable
                            placeholderText="Select your birth date"
                            customInput={<DateInput />}
                            maxDate={new Date()}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            wrapperClassName="w-full"
                          />
                          <style>{`
                            .react-datepicker {
                              background-color: #ffffff !important;
                              border: 1px solid #e5e7eb !important;
                              border-radius: 1rem !important;
                              font-family: 'Poppins', sans-serif !important;
                              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
                            }
                            .react-datepicker__header {
                              background-color: #f9fafb !important;
                              border-bottom: 1px solid #e5e7eb !important;
                              border-radius: 1rem 1rem 0 0 !important;
                              padding-top: 1rem !important;
                            }
                            .react-datepicker__current-month {
                              color: #111827 !important;
                              font-weight: 600 !important;
                              font-size: 1rem !important;
                            }
                            .react-datepicker__day-name {
                              color: #6b7280 !important;
                              font-weight: 500 !important;
                            }
                            .react-datepicker__day {
                              color: #111827 !important;
                              font-weight: 500 !important;
                            }
                            .react-datepicker__day:hover {
                              background-color: #2563eb !important;
                              color: white !important;
                              border-radius: 0.5rem !important;
                            }
                            .react-datepicker__day--selected,
                            .react-datepicker__day--keyboard-selected {
                              background-color: #2563eb !important;
                              color: white !important;
                              border-radius: 0.5rem !important;
                              font-weight: 600 !important;
                            }
                            .react-datepicker__day--disabled {
                              color: #d1d5db !important;
                              opacity: 0.5 !important;
                            }
                            .react-datepicker__day--outside-month {
                              color: #9ca3af !important;
                            }
                            .react-datepicker__month-dropdown,
                            .react-datepicker__year-dropdown {
                              background-color: #ffffff !important;
                              border: 1px solid #e5e7eb !important;
                              border-radius: 0.5rem !important;
                              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
                            }
                            .react-datepicker__month-option,
                            .react-datepicker__year-option {
                              color: #111827 !important;
                              padding: 0.5rem 1rem !important;
                            }
                            .react-datepicker__month-option:hover,
                            .react-datepicker__year-option:hover {
                              background-color: #2563eb !important;
                              color: white !important;
                            }
                            .react-datepicker__month-option--selected,
                            .react-datepicker__year-option--selected {
                              background-color: #2563eb !important;
                              color: white !important;
                            }
                            .react-datepicker__navigation-icon::before {
                              border-color: #111827 !important;
                            }
                            .react-datepicker__navigation:hover *::before {
                              border-color: #2563eb !important;
                            }
                            .react-datepicker__triangle {
                              display: none !important;
                            }
                            
                            .dark .react-datepicker {
                              background-color: #121212 !important;
                              border: 1px solid #222222 !important;
                            }
                            .dark .react-datepicker__header {
                              background-color: #181818 !important;
                              border-bottom: 1px solid #222222 !important;
                            }
                            .dark .react-datepicker__current-month,
                            .dark .react-datepicker__day-name,
                            .dark .react-datepicker__day {
                              color: #ffffff !important;
                            }
                            .dark .react-datepicker__day:hover {
                              background-color: #1e90ff !important;
                            }
                            .dark .react-datepicker__day--selected,
                            .dark .react-datepicker__day--keyboard-selected {
                              background-color: #1e90ff !important;
                            }
                            .dark .react-datepicker__day--disabled {
                              color: #444444 !important;
                            }
                            .dark .react-datepicker__day--outside-month {
                              color: #666666 !important;
                            }
                            .dark .react-datepicker__month-dropdown,
                            .dark .react-datepicker__year-dropdown {
                              background-color: #121212 !important;
                              border: 1px solid #222222 !important;
                            }
                            .dark .react-datepicker__month-option,
                            .dark .react-datepicker__year-option {
                              color: #ffffff !important;
                            }
                            .dark .react-datepicker__month-option:hover,
                            .dark .react-datepicker__year-option:hover {
                              background-color: #1e90ff !important;
                            }
                            .dark .react-datepicker__navigation-icon::before {
                              border-color: #ffffff !important;
                            }
                            .dark .react-datepicker__navigation:hover *::before {
                              border-color: #1e90ff !important;
                            }
                          `}</style>
                          <ErrorMessage
                            name="dob"
                            component="div"
                            className="text-red-500 text-sm mt-2"
                          />
                        </div>

                        {/* Country */}
                        <div>
                          <label className="block text-sm font-medium text-text mb-2">
                            Country
                          </label>
                          <Select
                            options={countries}
                            value={
                              values.country &&
                              values.country !== "Not specified"
                                ? {
                                    label: values.country,
                                    value: values.country,
                                  }
                                : null
                            }
                            onChange={(opt) =>
                              setFieldValue("country", opt?.value || "")
                            }
                            isClearable
                            placeholder="Select your country"
                            styles={getSelectStyles(isDark)}
                            className="text-text"
                            classNamePrefix="react-select"
                          />
                          <ErrorMessage
                            name="country"
                            component="div"
                            className="text-red-500 text-sm mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">
                        Contact Information
                      </h2>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Phone Number
                      </label>
                      <Field
                        name="phone"
                        className="w-full bg-input-bg border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-secondary hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        placeholder="+1 555 555 5555"
                      />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-red-500 text-sm mt-2"
                      />
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">About</h2>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Bio
                      </label>
                      <Field name="bio">
                        {({ field }) => (
                          <TextareaAutosize
                            {...field}
                            minRows={4}
                            maxRows={8}
                            placeholder="Tell us about yourself..."
                            className="w-full bg-input-bg border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-secondary hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
                          />
                        )}
                      </Field>
                      <div className="flex items-center justify-between mt-2">
                        <ErrorMessage
                          name="bio"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                        <span
                          className={`text-sm ml-auto ${
                            values.bio?.length > 400
                              ? "text-red-500"
                              : "text-text-secondary"
                          }`}
                        >
                          {values.bio?.length || 0} / 400
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="lg:hidden flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => navigate("/profile")}
                      className="flex-1 px-6 py-3 rounded-xl border border-border bg-card hover:bg-card-muted text-text font-medium transition-all duration-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 rounded-xl bg-primary hover:brightness-110 text-white font-medium shadow-lg shadow-primary/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
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
