import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/FormSubmitBtn";
import { AtSign } from "lucide-react";
import { useToast } from "@/utils/context/ToastContext";
import api from "@/utils/Api/axiosInstance";

const ResetPasswordEmail = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const res = await api.post("/api/login", {
        email: values.email,
      });

      // Save tokens
      localStorage.setItem("accessToken", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      resetForm();

      // Show success and redirect
      showToast(res.data.message || "Login successful", "success");
    } catch (err) {
      showToast(err?.message || "Login failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, errors, touched, isSubmitting }) => (
        <Form className="rounded-2xl p-3 md:p-8 flex flex-col gap-4  sm:gap-6 w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-text text-center">
            Find Your Account
          </h2>

          {/* Email Input */}
          <div>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              icon={AtSign}
              className={errors.email && touched.email ? "border-red-500" : ""}
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-sm ml-4 mt-1.5">{errors.email}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
          <p className="text-center text-text-secondary text-sm">
            Don’t have an account?{" "}
            <Link
              to="/sign-up"
              className="text-text hover:underline transition font-bold"
            >
              Sign up
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPasswordEmail;
