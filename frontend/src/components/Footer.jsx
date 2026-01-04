import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className=" flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm ">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img src={assets.logo} alt="Logo" className="w-40 h-auto mb-5" />
          <p className="text-gray-600 text-sm md:text-base w-full md:w-2/3 leading-6">
            Đặt lịch khám bệnh DOCTOR - Nền tảng đặt lịch hẹn với các bác sĩ
            uy tín một cách nhanh chóng và tiện lợi.
          </p>
        </div>

        {/* Center Section */}
        <div className="text-center md:text-left">
          <h1 className="text-lg font-semibold text-gray-800 mb-5">COMPANY</h1>
          <ul className="space-y-2 text-sm text-gray-600 ">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="text-center md:text-left">
          <h1 className="text-lg font-semibold text-gray-800 mb-4">
            LIÊN HỆ
          </h1>
          <ul className="space-y-2 text-sm text-gray-600 ">
            <li className="text-sm text-gray-600">+1-212-456-7890</li>
            <li className="text-sm text-gray-600">hospital22DRTA1@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <div className="flex justify-center text-gray-600 text-sm md:text-base mt-4 mb-2">
        <p className="text-lg font-semibold">
          &copy; 2026 BookingDoctor .
        </p>
      </div>
    </div>
  );
};

export default Footer;
