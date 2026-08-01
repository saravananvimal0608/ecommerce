"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "../utils/swal";
import { apiRequest } from "../utils/commonApi";

const VerifyOtp = () => {
  const router = useRouter();

  const [data, setData] = useState({
    email: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState({});
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const email = localStorage.getItem("resetEmail");
    if (email) setData((prev) => ({ ...prev, email }));
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { clearInterval(intervalRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleResendOtp = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    try {
      const res = await apiRequest("/api/user/forgot-password", "post", { email: data.email });
      showToast({ icon: "success", title: res.message || "OTP resent successfully" });
      setOtp(["", "", "", "", "", ""]);
      setError({});
      setTimer(60);
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) { clearInterval(intervalRef.current); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      showToast({ icon: "error", title: err.response?.data?.message || "Failed to resend OTP" });
    } finally {
      setResending(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const validateForm = () => {
    const errors = {};

    if (otp.join("").length !== 6) {
      errors.otp = "Please enter a valid 6-digit OTP";
    }

    setError(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      email: data.email,
      otp: otp.join(""),
    };

    try {
      const res = await apiRequest(
        "/api/user/verify-otp",
        "post",
        payload
      );

      showToast({
        icon: "success",
        title: res.message,
      });

      setTimeout(() => {
        router.push("/reset-password");
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
            Verify OTP
          </h1>

          <p className="text-gray-400 mt-3 text-sm">
            Please enter your 6-digit OTP to continue
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              OTP
            </label>

            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, index)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(e, index)
                  }
                  className={`w-12 h-12 text-center text-xl font-bold bg-black/20 text-white rounded-xl border outline-none transition-all ${
                    error.otp
                      ? "border-red-500"
                      : "border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  }`}
                />
              ))}
            </div>

            {error.otp && (
              <span className="text-red-400 text-sm">
                {error.otp}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full common-btn hover:opacity-95 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20"
          >
            Verify OTP
          </button>

          <div className="text-center text-sm">
            {timer > 0 ? (
              <p className="text-gray-400">
                Resend OTP in <span className="text-indigo-400 font-semibold">{timer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition disabled:opacity-50"
              >
                {resending ? "Resending..." : "Resend OTP"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;