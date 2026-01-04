import React, { useContext, useState } from "react";
import { assets } from '../assets.js'
import { Admincontext } from "../context/AdminContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const Login = () => {
  const [state, setState] = useState("Admin");
  const { setAToken, backendUrl } = useContext(Admincontext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          console.log(data.token);
          setAToken(data.token);
          localStorage.setItem("aToken", data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      //   console.error("Login failed:", error);
      //   alert("Login failed. Please try again.");
    }
  };

  return (
    <form className="min-h-[80vh] flex items-center " onSubmit={handleLogin}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96  rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-[#5E6FFF]"> {state} </span>Login
        </p>
        <div className="w-full">
          <p className="text-xl ">Email</p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="text"
            id="username"
            required
          />
        </div>
        <div className="w-full">
          <p className="text-xl ">Password</p>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            required
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
          />
        </div>
        <button className="bg-[#5e6fff] text-white w-full py-2 rounded-md mt-4 hover:bg-[#4a54d9] transition-colors duration-300 cursor-pointer text-base hover:font-semibold">
          Login
        </button>
        {state === "Admin" ? (
          <p className="text-sm text-[#5E5E5E]">
            Doctor Login ?{" "}
            <span
              className="text-[#5e6fff] underline cursor-pointer"
              onClick={() => setState("Doctor")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p className="text-sm text-[#5E5E5E]">
            Admin Login ?{" "}
            <span
              className="text-[#5e6fff] underline cursor-pointer"
              onClick={() => setState("Admin")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
