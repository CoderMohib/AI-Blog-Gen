"use client";
import React from "react";

const DotRingSpinner = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            animation: "spin 3s linear infinite",
          }}
        >
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * 360;
            return (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: "var(--color-text)",
                  transform: `rotate(${angle}deg) translate(28px)`,
                  opacity: 0.9,
                }}
              ></span>
            );
          })}
        </div>

        {/* Inner Ring */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            animation: "spinReverse 2s linear infinite",
          }}
        >
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * 360;
            return (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  width: "3px",
                  height: "3px",
                  backgroundColor: "var(--color-text)",
                  transform: `rotate(${angle}deg) translate(16px)`,
                  opacity: 0.7,
                }}
              ></span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DotRingSpinner;
