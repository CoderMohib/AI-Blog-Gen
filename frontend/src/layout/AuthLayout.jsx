import ReservedRights from "@/components/atoms/ReservedRights";
import SideSection from "@/components/SideSection";
import ThemeToggle from "@/components/ThemeToggle";
import React from "react";
import logo from "@/assets/mainlogo.png";
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-text flex items-center justify-center p-4 sm:p-8 md:p-16">
      <div className="flex flex-col lg:flex-row w-full max-w-screen-2xl min-h-[600px] sm:min-h-[650px] bg-card-muted lg:bg-card rounded-3xl shadow-[0_10px_30px_var(--shadow-color)] overflow-hidden">
        <SideSection />
        <div className="w-full min-h-[600px] sm:min-h-[650px] lg:w-1/2 flex flex-col items-center justify-center md:p-12 relative">
          <div className="flex flex-col items-center rounded-full  w-20 h-20 justify-center absolute left-2 sm:left-4 top-2 sm:top-4 md:right-3 lg:hidden">
            <img src={logo} alt="Logo" className="" />
          </div>
          <ThemeToggle className="absolute right-0.5 top-4 sm:top-6 md:right-4" />

          {children}
          <ReservedRights className="absolute bottom-6 left-1/2 transform -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}
