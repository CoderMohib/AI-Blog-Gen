import React from "react";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text px-6">
      <h1 className="text-7xl font-extrabold text-red-400 mb-4">404</h1>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
        Page Not Found
      </h2>
      <p className="text-text-secondary mb-8 text-center max-w-md">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-full font-medium  bg-button-dark-hover 
        text-button-dark-text
        border border-button-border
        hover:bg-card-muted 
        hover:text-text shadow-md transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Error404;
