"use client";
import React, { useEffect, useRef, useState } from "react";
import { apiRequest } from "../../utils/commonApi";
import { showToast } from "../../utils/swal";
import Image from "next/image";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiCamera,
  FiSave,
  FiKey,
  FiLogOut,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import SkeletonLoader from "@/app/utils/skeleton";

const TAB = { PROFILE: "profile", PASSWORD: "password" };

const UserProfile = () => {
  const router = useRouter();
  const fileRef = useRef(null);

  const [tab, setTab] = useState(TAB.PROFILE);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // profile form
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [profileErrors, setProfileErrors] = useState({});

  const [fpStep, setFpStep] = useState(1);
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpPasswords, setFpPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [fpLoading, setFpLoading] = useState(false);
  const [fpErrors, setFpErrors] = useState({});

  const fetchUser = async () => {
    try {
      const res = await apiRequest("/api/user/user-details");
      console.log(res.data);
      setUser(res.data);
      setProfile({
        name: res.data.name || "",
        email: res.data.email || "",
      });
      setFpEmail(res.data.email || "");
    } catch {
      showToast({ icon: "error", title: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Avatar upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      setAvatarLoading(true);
      const res = await apiRequest("/api/user/upload-avatar", "put", formData, {
        "Content-Type": "multipart/form-data",
      });
      setUser((prev) => ({ ...prev, avatar: res.data.avatar }));
      showToast({ icon: "success", title: "Avatar updated!" });
    } catch {
      showToast({ icon: "error", title: "Failed to upload avatar" });
    } finally {
      setAvatarLoading(false);
    }
  };

  // Profile update
  const validateProfile = () => {
    const err = {};
    if (!profile.name.trim()) err.name = "Name is required";
    if (!profile.email.trim()) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
      err.email = "Invalid email";
    setProfileErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    try {
      setSaving(true);
      await apiRequest("/api/user/update-user", "put", profile);
      showToast({ icon: "success", title: "Profile updated successfully!" });
      fetchUser();
    } catch {
      showToast({ icon: "error", title: "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  //send OTP
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!fpEmail) {
      setFpErrors({ email: "Email is required" });
      return;
    }
    try {
      setFpLoading(true);
      await apiRequest("/api/user/forgot-password", "post", { email: fpEmail });
      showToast({ icon: "success", title: "OTP sent to your email" });
      setFpStep(2);
      setFpErrors({});
    } catch (err) {
      showToast({
        icon: "error",
        title: err?.response?.data?.message || "Failed to send OTP",
      });
    } finally {
      setFpLoading(false);
    }
  };

  // verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!fpOtp) {
      setFpErrors({ otp: "OTP is required" });
      return;
    }
    try {
      setFpLoading(true);
      await apiRequest("/api/user/verify-otp", "post", {
        email: fpEmail,
        otp: fpOtp,
      });
      showToast({ icon: "success", title: "OTP verified!" });
      setFpStep(3);
      setFpErrors({});
    } catch (err) {
      showToast({
        icon: "error",
        title: err?.response?.data?.message || "Invalid OTP",
      });
    } finally {
      setFpLoading(false);
    }
  };

  // reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const err = {};
    if (!fpPasswords.newPassword) err.newPassword = "Password is required";
    else if (fpPasswords.newPassword.length < 8)
      err.newPassword = "Min 8 characters";
    if (fpPasswords.newPassword !== fpPasswords.confirmPassword)
      err.confirmPassword = "Passwords do not match";
    if (Object.keys(err).length) {
      setFpErrors(err);
      return;
    }
    try {
      setFpLoading(true);
      await apiRequest("/api/user/reset-password", "post", {
        email: fpEmail,
        ...fpPasswords,
      });
      showToast({ icon: "success", title: "Password reset successfully!" });
      setFpStep(1);
      setFpPasswords({ newPassword: "", confirmPassword: "" });
      setFpErrors({});
    } catch (err) {
      showToast({
        icon: "error",
        title: err?.response?.data?.message || "Failed to reset password",
      });
    } finally {
      setFpLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const inputClass = (err) =>
    `w-full pl-10 pr-4 py-3 bg-black/20 text-white rounded-xl border placeholder-gray-500 outline-none focus:ring-2 transition-all text-sm ${
      err
        ? "border-red-500 focus:ring-red-500"
        : "border-white/10 focus:ring-indigo-500"
    }`;

  if (loading) {
    return <SkeletonLoader variant="userProfile" />;
  }

  return (
    <div className="min-h-screen common-bg px-4 py-24">
      <div className="max-w-3xl mx-auto">
        {/* Avatar Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6 flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-indigo-500/20 border-2 border-white/10">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt="avatar"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-indigo-400">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <button
              onClick={() => fileRef.current.click()}
              disabled={avatarLoading}
              className="absolute -bottom-2 -right-2 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-500 transition"
            >
              {avatarLoading ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiCamera size={13} className="text-white" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block font-medium ${user?.verify_email ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
            >
              {user?.verify_email ? "✓ Verified" : "⚠ Not Verified"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white hover:text-red-400 transition border border-white/10 px-4 py-2 rounded-xl hover:border-red-400/30"
          >
            <FiLogOut size={15} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            {
              key: TAB.PROFILE,
              label: "Edit Profile",
              icon: <FiUser size={14} />,
            },
            {
              key: TAB.PASSWORD,
              label: "Change Password",
              icon: <FiKey size={14} />,
            },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                tab === key
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === TAB.PROFILE && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white mb-6">
              Personal Information
            </h3>
            <form onSubmit={handleProfileSave} className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    placeholder="Your full name"
                    className={inputClass(profileErrors.name)}
                  />
                </div>
                {profileErrors.name && (
                  <span className="text-red-400 text-xs">
                    {profileErrors.name}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    placeholder="Your email"
                    className={inputClass(profileErrors.email)}
                  />
                </div>
                {profileErrors.email && (
                  <span className="text-red-400 text-xs">
                    {profileErrors.email}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full common-btn text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiSave size={15} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {tab === TAB.PASSWORD && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            {/* Step indicators */}
            <div className="flex items-center gap-2 mb-8">
              {["Send OTP", "Verify OTP", "Reset Password"].map((label, i) => (
                <React.Fragment key={i}>
                  <div
                    className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full ${fpStep === i + 1 ? "bg-indigo-600 text-white" : fpStep > i + 1 ? "bg-green-500/20 text-green-400" : "bg-white/10 text-gray-400"}`}
                  >
                    <span>{fpStep > i + 1 ? "✓" : i + 1}</span> {label}
                  </div>
                  {i < 2 && (
                    <div
                      className={`flex-1 h-px ${fpStep > i + 1 ? "bg-green-500/40" : "bg-white/10"}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Send OTP */}
            {fpStep === 1 && (
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <h3 className="text-lg font-bold text-white mb-2">
                  Send OTP to Email
                </h3>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={fpEmail}
                      onChange={(e) => setFpEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={inputClass(fpErrors.email)}
                    />
                  </div>
                  {fpErrors.email && (
                    <span className="text-red-400 text-xs">
                      {fpErrors.email}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={fpLoading}
                  className="w-full common-btn text-white font-semibold py-3 rounded-xl disabled:opacity-50"
                >
                  {fpLoading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {/*  Verify OTP */}
            {fpStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <h3 className="text-lg font-bold text-white mb-2">Enter OTP</h3>
                <p className="text-gray-400 text-sm">
                  OTP sent to <span className="text-indigo-400">{fpEmail}</span>
                </p>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-300">
                    OTP
                  </label>
                  <div className="relative">
                    <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={fpOtp}
                      maxLength={6}
                      onChange={(e) => {
                        if (/^\d*$/.test(e.target.value))
                          setFpOtp(e.target.value);
                      }}
                      placeholder="6-digit OTP"
                      className={inputClass(fpErrors.otp)}
                    />
                  </div>
                  {fpErrors.otp && (
                    <span className="text-red-400 text-xs">{fpErrors.otp}</span>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFpStep(1)}
                    className="flex-1 py-3 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={fpLoading}
                    className="flex-1 common-btn text-white font-semibold py-3 rounded-xl disabled:opacity-50"
                  >
                    {fpLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </form>
            )}

            {/*  Reset Password */}
            {fpStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <h3 className="text-lg font-bold text-white mb-2">
                  Set New Password
                </h3>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-300">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={fpPasswords.newPassword}
                      onChange={(e) =>
                        setFpPasswords({
                          ...fpPasswords,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Min 8 characters"
                      className={inputClass(fpErrors.newPassword)}
                    />
                  </div>
                  {fpErrors.newPassword && (
                    <span className="text-red-400 text-xs">
                      {fpErrors.newPassword}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={fpPasswords.confirmPassword}
                      onChange={(e) =>
                        setFpPasswords({
                          ...fpPasswords,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Re-enter new password"
                      className={inputClass(fpErrors.confirmPassword)}
                    />
                  </div>
                  {fpErrors.confirmPassword && (
                    <span className="text-red-400 text-xs">
                      {fpErrors.confirmPassword}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={fpLoading}
                  className="w-full common-btn text-white font-semibold py-3 rounded-xl disabled:opacity-50"
                >
                  {fpLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
