import React from "react";

const Button = ({ type = "button", children, className = "", ...props }) => {
  return (
    <button
      type={type}
      className={`
        w-full
        sm:w-50
        m-auto 
        py-2
        sm:py-3 
        rounded-full
        bg-button-dark-hover 
        text-button-dark-text
        border border-button-border
        hover:bg-card-muted 
        hover:text-text
        font-medium 
        transition-colors 
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
