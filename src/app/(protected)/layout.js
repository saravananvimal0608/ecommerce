"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.replace("/login");
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      localStorage.clear();
      router.replace("/login");
    }
  }, [router]);

  if (!isAuthorized) {
    return null;
  }

  return children;
}