import React from "react";
import bgImage from "@/assets/SideSection.png"; // adjust path
import logo from "@/assets/logo.png"; // adjust path

const SideSection = () => {
  return (
    <div
      className="hidden lg:flex lg:flex-col lg:gap-50 md:w-1/2 p-3 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex flex-col items-center rounded-full  w-30 h-30 justify-center">
        <img src={logo} alt="Logo" className="" />
      </div>
      <div >
        <h1 className="text-3xl font-bold text-center text-[#222222]">Welcome To Our App!</h1>
      </div>
    </div>
  );
};

export default SideSection;
