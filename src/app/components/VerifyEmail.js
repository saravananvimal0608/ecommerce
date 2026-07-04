"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiRequest } from "../utils/commonApi";
import Link from "next/link";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import { MdMarkEmailRead } from "react-icons/md";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    if (!code) {
      setStatus("error");
      return;
    }
    const verify = async () => {
      try {
        await apiRequest("/api/user/verify-email", "post", { code });
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };
    verify();
  }, [code]);

  return (
    <div className="min-h-screen common-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-10 text-center">

        {status === "loading" && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
                <FiLoader size={32} className="text-indigo-400 animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verifying your email</h1>
            <p className="text-gray-400 text-sm">Please wait while we verify your account...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <FiCheckCircle size={32} className="text-green-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Email Verified!</h1>
            <p className="text-gray-400 text-sm mb-8">
              Your email has been verified successfully. You can now login to your account.
            </p>
            <Link
              href="/login"
              className="w-full common-btn text-white font-semibold py-3 px-8 rounded-xl inline-block transition-all duration-300 shadow-lg shadow-indigo-500/20"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
                <FiXCircle size={32} className="text-red-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>
            <p className="text-gray-400 text-sm mb-8">
              The verification link is invalid or has expired. Please register again.
            </p>
            <Link
              href="/register"
              className="w-full common-btn text-white font-semibold py-3 px-8 rounded-xl inline-block transition-all duration-300 shadow-lg shadow-indigo-500/20"
            >
              Back to Register
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;
