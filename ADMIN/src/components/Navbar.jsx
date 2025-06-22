import React, { useContext } from "react";
import { assets } from "../assets/assets_admin/assets";
import { Admincontext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { aToken, setAToken } = useContext(Admincontext);
  const navigate = useNavigate();
  const logout = () => {
    navigate("/");
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
    window.location.reload();
  };
  return (
    <div className="flex justify-between items-center bg-white px-4 sm:px-10 border-b py-3 ">
      <div className="flex items-center gap-2 text-xs sm:text-base">
        <img
          className="w-36 cursor-pointer sm:w-40"
          src={assets.admin_logo}
          alt=""
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600   ">
          {aToken ? "Admin " : "Doctor "}
        </p>
      </div>
      <button
        onClick={logout}
        className="bg-[#5e6fff] px-10 py-2 rounded-full text-white text-xs sm:text-base hover:bg-[#4a54d9] transition-colors duration-300 cursor-pointer font-semibold"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
