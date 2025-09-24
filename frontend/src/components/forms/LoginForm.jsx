import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/FormSubmitBtn";
import { AtSign, Lock, Eye } from "lucide-react";
import { useToast } from "@/utils/context/ToastContext";
import api from "@/utils/Api/axiosInstance";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const res = await api.post("/api/login", {
        email: values.email,
        password: values.password,
      });

      // Save tokens
      login(res.data.user, res.data.token);
      resetForm();
      // Show success and redirect
      // showToast(res.data.message || "Login successful", "success");
      navigate("/dashboard");
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
            Login
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

          {/* Password Input */}
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
            {errors.password && touched.password && (
              <p className="text-red-500 text-sm ml-4 mt-1.5">
                {errors.password}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
          <div className="text-center  sm:-mt-4 sm:-mb-2">
            <Link
              to="/forgot-password"
              className="text-sm text-text underline hover:opacity-60 transition "
            >
              Forgot password
            </Link>
          </div>
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

export default LoginForm;
