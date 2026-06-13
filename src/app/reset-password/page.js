"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "../utils/swal";
import { apiRequest } from "../utils/commonApi";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";

const ResetPassword = () => {
  const router = useRouter();

  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [toggle, setToggle] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState(false);
  const [error, setError] = useState({});

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const error = {};

    if (!data.newPassword.trim()) {
      error.newPassword = "Please enter a new password";
    } else if (data.newPassword.length < 8) {
      error.newPassword = "Password must be at least 8 characters long";
    }

    if (!data.confirmPassword.trim()) {
      error.confirmPassword = "Please confirm your password";
    } else if (data.confirmPassword !== data.newPassword) {
      error.confirmPassword = "Password and confirm password do not match";
    }

    setError(error);

    return Object.keys(error).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    try {
      const res = await apiRequest("/api/user/reset-password", "post", data);
      showToast({
        icon: "success",
        title: res.message,
      });
      setTimeout(() => {
        router.push("/login");
      }, 500);
      localStorage.removeItem("resetEmail");
    } catch (error) {
      console.log("Data:", error.response?.data);

      showToast({
        icon: "error",
        title: error.response?.data?.message,
      });
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("resetEmail");

    if (email) {
      setData((prev) => ({
        ...prev,
        email,
      }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-fixed flex items-center justify-center px-4 common-bg">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-3xl p-8 border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Reset Your Password
          </h1>

          <p className="text-gray-400 mt-3 text-sm">
            Please enter your New Password to continue
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              New Password
            </label>
            <div className="relative">
              <input
                type={toggle ? "text" : "password"}
                name="newPassword"
                placeholder="Enter your new password"
                className={`w-full px-4 py-3 bg-black/20 text-white rounded-xl border placeholder-gray-500 outline-none focus:ring-2 transition-all ${
                  error.newPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-white/10 focus:ring-indigo-500"
                }`}
                value={data.newPassword}
                onChange={handleChange}
              />

              {toggle ? (
                <IoEyeSharp
                  onClick={() => setToggle(!toggle)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
                />
              ) : (
                <FaEyeSlash
                  onClick={() => setToggle(!toggle)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
                />
              )}
            </div>
            {error.newPassword && (
              <span className="text-red-400 text-sm">{error.newPassword}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={confirmToggle ? "text" : "password"}
                name="confirmPassword"
                placeholder="Enter your confirm password"
                className={`w-full px-4 py-3 bg-black/20 text-white rounded-xl border placeholder-gray-500 outline-none focus:ring-2 transition-all ${
                  error.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-white/10 focus:ring-indigo-500"
                }`}
                value={data.confirmPassword}
                onChange={handleChange}
              />
              {confirmToggle ? (
                <IoEyeSharp
                  onClick={() => setConfirmToggle(!confirmToggle)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
                />
              ) : (
                <FaEyeSlash
                  onClick={() => setConfirmToggle(!confirmToggle)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
                />
              )}
            </div>
            {error.confirmPassword && (
              <span className="text-red-400 text-sm">
                {error.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full common-btn hover:opacity-95 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
