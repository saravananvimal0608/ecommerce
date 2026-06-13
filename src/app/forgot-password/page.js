"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "../utils/swal";
import { apiRequest } from "../utils/commonApi";

const Login = () => {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
  });
  const [error, setError] = useState({});

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const error = {};

    // email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // email validation
    if (!data.email.trim()) {
      error.email = "Please enter your email";
    } else if (!emailRegex.test(data.email)) {
      error.email = "Please enter a valid email";
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
      const res = await apiRequest("/api/user/forgot-password", "post", data);
      showToast({
        icon: "success",
        title: res.message,
      });
      localStorage.setItem("resetEmail", data.email);
      setTimeout(() => {
        router.push("/verify-otp");
      }, 500);
    } catch (error) {
      console.log("Data:", error.response?.data);

      showToast({
        icon: "error",
        title: error.response?.data?.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-fixed flex items-center justify-center px-4 common-bg">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-3xl p-8 border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Forgot Password
          </h1>

          <p className="text-gray-400 mt-3 text-sm">
            Please enter your Email to continue
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-3 bg-black/20 text-white rounded-xl border placeholder-gray-500 outline-none focus:ring-2 transition-all ${
                error.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-white/10 focus:ring-indigo-500"
              }`}
              value={data.email}
              onChange={handleChange}
            />
            {error.email && (
              <span className="text-red-400 text-sm">{error.email}</span>
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

export default Login;
