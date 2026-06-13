"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "../../utils/swal";
import { apiRequest } from "../../utils/commonApi";

const Register = () => {
  const router = useRouter();
  const [data, setData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
  };

  const validateForm = () => {
    const err = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.name.trim()) err.name = "Please enter your name";

    if (!data.email.trim()) err.email = "Please enter your email";
    else if (!emailRegex.test(data.email)) err.email = "Please enter a valid email";

    if (!data.password.trim()) err.password = "Please enter a password";
    else if (data.password.length < 8) err.password = "Password must be at least 8 characters";

    if (!data.confirmPassword.trim()) err.confirmPassword = "Please confirm your password";
    else if (data.password !== data.confirmPassword) err.confirmPassword = "Passwords do not match";

    setError(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const res = await apiRequest("/api/user/register", "post", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      showToast({ icon: "success", title: res.message });
      router.push("/login");
    } catch (err) {
      showToast({ icon: "error", title: err?.response?.data?.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-black/20 text-white rounded-xl border placeholder-gray-500 outline-none focus:ring-2 transition-all ${
      error[field] ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-indigo-500"
    }`;

  return (
    <div className="min-h-screen bg-fixed flex items-center justify-center px-4 common-bg ">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-3xl p-8 border border-white/10 my-20">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white">Create Account</h1>
          <p className="text-gray-400 mt-3 text-sm">Fill in the details below to get started</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              className={inputClass("name")}
              value={data.name}
              onChange={handleChange}
            />
            {error.name && <span className="text-red-400 text-sm">{error.name}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className={inputClass("email")}
              value={data.email}
              onChange={handleChange}
            />
            {error.email && <span className="text-red-400 text-sm">{error.email}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min. 8 characters"
              className={inputClass("password")}
              value={data.password}
              onChange={handleChange}
            />
            {error.password && <span className="text-red-400 text-sm">{error.password}</span>}
          </div>

        
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              className={inputClass("confirmPassword")}
              value={data.confirmPassword}
              onChange={handleChange}
            />
            {error.confirmPassword && <span className="text-red-400 text-sm">{error.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full common-btn hover:opacity-95 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-white">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;
