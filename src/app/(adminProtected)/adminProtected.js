"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { showToast } from "../utils/swal";

export default function AdminProtectedLayout({ children }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAdminAccess = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                const decoded = jwtDecode(token);

                if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
                    localStorage.clear();
                    showToast({ icon: 'warning', title: 'Session Expired' });
                    router.replace("/login");
                    return;
                }

                if (decoded.role !== "admin") {
                    showToast({ icon: 'error', title: 'Access Denied' });
                    router.replace("/user");
                    return;
                }

                setIsAuthorized(true);
            } catch (error) {
                localStorage.clear();
                showToast({ icon: 'error', title: 'Invalid Session' });
                router.replace("/login");
            }
        };

        checkAdminAccess();
    }, [router]);

    if (!isAuthorized) {
        return null;
    }

    return children;
}