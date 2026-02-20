"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/header";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";
    const [checking, setChecking] = useState(!isLoginPage);

    useEffect(() => {
        // Skip auth check on the login page itself
        if (isLoginPage) return;

        const token = localStorage.getItem("token");
        const userRaw = localStorage.getItem("user");

        if (!token || !userRaw) {
            router.replace("/admin/login");
            return;
        }

        try {
            const user = JSON.parse(userRaw);
            if (user?.role !== "admin") {
                router.replace("/admin/login");
                return;
            }
        } catch {
            router.replace("/admin/login");
            return;
        }

        setChecking(false);
    }, [isLoginPage, router]);

    // Login page renders without the admin shell (no sidebar/header)
    if (isLoginPage) {
        return <>{children}</>;
    }

    if (checking) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-950">
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            </div>
        );
    }

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <AdminSidebar />
            </div>
            <main className="md:pl-72 h-full bg-gray-50 min-h-screen">
                <AdminHeader />
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
