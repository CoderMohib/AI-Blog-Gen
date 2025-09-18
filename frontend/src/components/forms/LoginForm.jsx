import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call API here normally
    login({ email });
    navigate("/dashboard");
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
          gap-6
        "
      >
        <h2 className="text-3xl font-bold text-text text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          Login
        </button>

        <p className="text-center text-text-secondary text-sm">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-text hover:underline transition font-bold"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
