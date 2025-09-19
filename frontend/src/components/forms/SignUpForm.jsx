import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/FormSubmitBtn";
import { User, AtSign, Lock, Phone, Eye } from "lucide-react";
import api from "@/utils/Api/axiosInstance";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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
    fullName: Yup.string()
      .required("Full Name is required")
      .min(5, "Full Name must be at least 5 characters")
      .max(20, "Full Name cannot exceed 20 characters"),

    username: Yup.string()
      .required("Username is required")
      .min(5, "Username must be at least 5 characters")
      .max(15, "Username cannot exceed 15 characters"),
    email: Yup.string().email("Invalid email").required("Email is required"),
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
    phone: Yup.string()
      .matches(/^\d{10,15}$/, "Phone number is invalid")
      .required("Phone number is required"),
  });
  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    console.log(values);
    try {
      const res = await api.post("/api/register", values); // send all form values
      console.log(res.data);
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Formik
      initialValues={{
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, errors, touched, isSubmitting }) => (
        <Form className="rounded-2xl  flex flex-col gap-4 sm:gap-6 p-3 w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-text text-center">
            Sign Up
          </h2>

          {/* Grid: 2 columns on md+, 1 column on small screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 md:gap-6 lg:gap-4">
            <div>
              <Input
                name="fullName"
                placeholder="Full Name"
                value={values.fullName}
                onChange={handleChange}
                icon={User}
                className={
                  errors.fullName && touched.fullName ? "border-red-500" : ""
                }
              />
              {errors.fullName && touched.fullName && (
                <p className="text-red-500 text-sm ml-4 mt-1.5">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <Input
                name="username"
                placeholder="Username"
                value={values.username}
                onChange={handleChange}
                icon={User}
                className={
                  errors.username && touched.username ? "border-red-500" : ""
                }
              />
              {errors.username && touched.username && (
                <p className="text-red-500 text-sm ml-4 mt-1.5">
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
                icon={AtSign}
                className={
                  errors.email && touched.email ? "border-red-500" : ""
                }
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm ml-4 mt-1.5">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <Input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={values.phone}
                onChange={handleChange}
                icon={Phone}
                className={
                  errors.phone && touched.phone ? "border-red-500" : ""
                }
              />
              {errors.phone && touched.phone && (
                <p className="text-red-500 text-sm ml-4 mt-1.5">
                  {errors.phone}
                </p>
              )}
            </div>

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
              {errors.password &&
                touched.password &&
                values.password === "" && (
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
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </Button>

          <p className="text-center text-text-secondary text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-text hover:underline font-bold">
              Login
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpForm;
