import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth"; // optional if you handle auth here

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const navigate = useNavigate();
//   const { login } = useAuth(); // replace with signup if available

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call your signup API here
    // signup(formData) or login(formData)
    alert("Signed up successfully!");
    navigate("/login");
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="
          rounded-2xl
          p-3 
          md:p-8 
          flex flex-col 
          gap-3
          sm:gap-6
        "
      >
        <h2 className="text-3xl font-bold text-text text-center">Sign Up</h2>

        {/* First Name */}
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="
            w-full 
            px-4 
            py-3 
            rounded-full
            bg-card-soft 
            text-text 
            placeholder:text-text-secondary 
            border border-border 
            focus:outline-none focus:ring-2 focus:ring-button-border
            transition
          "
        />

        {/* Last Name */}
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="
            w-full 
            px-4 
            py-3 
            rounded-full
            bg-card-soft 
            text-text 
            placeholder:text-text-secondary 
            border border-border 
            focus:outline-none focus:ring-2 focus:ring-button-border
            transition
          "
        />

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="
            w-full 
            px-4 
            py-3 
            rounded-full
            bg-card-soft 
            text-text 
            placeholder:text-text-secondary 
            border border-border 
            focus:outline-none focus:ring-2 focus:ring-button-border
            transition
          "
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="
            w-full 
            px-4 
            py-3 
            rounded-full
            bg-card-soft 
            text-text 
            placeholder:text-text-secondary 
            border border-border 
            focus:outline-none focus:ring-2 focus:ring-button-border
            transition
          "
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="
            w-full 
            px-4 
            py-3 
            rounded-full
            bg-card-soft 
            text-text 
            placeholder:text-text-secondary 
            border border-border 
            focus:outline-none focus:ring-2 focus:ring-button-border
            transition
          "
        />

        {/* Phone Number */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="
            w-full 
            px-4 
            py-3 
            rounded-full
            bg-card-soft 
            text-text 
            placeholder:text-text-secondary 
            border border-border 
            focus:outline-none focus:ring-2 focus:ring-button-border
            transition
          "
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="
            w-full 
            py-3 
            rounded-full
            bg-button-dark-hover
            text-button-dark-text
            border border-button-border
            hover:bg-card-muted
            hover:text-text
            font-medium 
            transition-colors 
            cursor-pointer
          "
        >
          Sign Up
        </button>

        <p className="text-center text-text-secondary text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-text hover:underline transition font-bold"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
