import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/FormSubmitBtn";
import { Lock, Eye } from "lucide-react";
import api from "@/utils/Api/axiosInstance";
import { useToast } from "@/utils/context/ToastContext";

const ResetPassword = ({ token }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordRules = [
    { regex: /.{8,}/, message: "At least 8 characters" },
    { regex: /[A-Z]/, message: "At least one uppercase letter" },
    { regex: /[a-z]/, message: "At least one lowercase letter" },
    { regex: /\d/, message: "At least one number" },
    {
      regex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
      message: "At least one special character",
    },
  ];
  const validationSchema = Yup.object({
    password: Yup.string()
      .required("Password is required")
      .test(
        "password-strength",
        "Password does not meet requirements",
        (value) => {
          if (!value) return false;
          return passwordRules.every((rule) => rule.regex.test(value));
        }
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const res = await api.post(`/api/reset-password/${token}`, {
        password: values.password,
        confirmPassword: values.confirmPassword,
      }); // send all form values
      resetForm();
      showToast(
        res.data.message || "Password reset successful",
        "success",
        () => navigate("/login")
      );
    } catch (err) {
      showToast(
        err?.message || "Error resetting password",
        "error" // type
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Formik
      initialValues={{
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, errors, touched, isSubmitting }) => (
        <Form className="rounded-2xl  flex flex-col gap-4 sm:gap-6 p-3 w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-text text-center">
            Reset Password
          </h2>

          <div>
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              icon={showPassword ? Eye : Lock}
              onIconClick={() => setShowPassword((prev) => !prev)}
              className={
                errors.password && touched.password ? "border-red-500" : ""
              }
            />

            {/* Dynamic error sentence */}
            {touched.password && values.password && (
              <p className="text-red-500 text-sm ml-4 mt-1.5">
                {passwordRules
                  .filter((rule) => !rule.regex.test(values.password)) // only unmet rules
                  .map((rule) => rule.message)
                  .join(", ")}{" "}
                {/* join into a sentence */}
              </p>
            )}

            {/* Final validation message from Formik */}
            {errors.password && touched.password && values.password === "" && (
              <p className="text-red-500 text-sm ml-4 mt-1.5">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={values.confirmPassword}
              onChange={handleChange}
              icon={showConfirmPassword ? Eye : Lock}
              onIconClick={() => setShowConfirmPassword((prev) => !prev)}
              className={
                errors.confirmPassword && touched.confirmPassword
                  ? "border-red-500"
                  : ""
              }
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="text-red-500 text-sm ml-4 mt-1.5">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Re-setting." : "Reset"}
          </Button>

          <p className="text-center text-text-secondary text-sm">
            <Link
              to="/forgot-password"
              className="text-text hover:underline font-bold"
            >
              Find Your Account?
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPassword;
