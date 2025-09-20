import React from "react";

const Input = ({
  name,
  type = "text",
  value,
  placeholder,
  onChange,
  className = "",
  icon: Icon,
  onIconClick,
}) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <div
          className={`absolute inset-y-0 left-4 flex items-center ${
            onIconClick ? "cursor-pointer" : "pointer-events-none"
          }`}
          onClick={onIconClick}
        >
          <Icon className="text-text-secondary w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`
          w-full 
          pl-10 pr-2 py-2 text-sm sm:pl-12 sm:py-3 sm:text-base
          rounded-full
          bg-card-soft 
          text-text 
          placeholder:text-text-secondary 
          border border-border 
          focus:outline-none focus:ring-2 focus:ring-button-border
          transition
          ${className}
        `}
      />
    </div>
  );
};

export default Input;
