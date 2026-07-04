"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {getUserFromToken} from '../utils/getRoleFromToken'

const VerifyTokenAndRole = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const role = getUserFromToken(token);

    if (!token) {
      router.push("/login");
      return;
    }

    if (role?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  }, []);
  return null;
};

export default VerifyTokenAndRole;
