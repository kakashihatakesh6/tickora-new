"use client";

import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminHeader() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin/login");
    };

    return (
        <div className="flex items-center justify-end p-4 bg-white border-b shadow-sm h-16">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Admin</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
