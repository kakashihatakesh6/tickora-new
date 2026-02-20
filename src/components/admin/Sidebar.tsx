"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Film,
    Trophy,
    CalendarCheck,
    LogOut,
    Image,
} from "lucide-react";

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/admin",
            color: "text-sky-500",
        },
        {
            label: "Users",
            icon: Users,
            href: "/admin/users",
            color: "text-violet-500",
        },
        {
            label: "Movies",
            icon: Film,
            href: "/admin/movies",
            color: "text-pink-500",
        },
        {
            label: "Sports",
            icon: Trophy,
            href: "/admin/sports",
            color: "text-orange-500",
        },
        {
            label: "Events",
            icon: CalendarCheck,
            href: "/admin/events",
            color: "text-purple-500",
        },
        {
            label: "Bookings",
            icon: CalendarCheck,
            href: "/admin/bookings",
            color: "text-emerald-500",
        },
        {
            label: "Hero Images",
            icon: Image,
            href: "/admin/hero-images",
            color: "text-gray-400",
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin/login");
    };

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/admin" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-lg animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-bold">Admin</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href
                                    ? "text-white bg-white/10"
                                    : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Logout button at bottom */}
            <div className="px-3 py-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="text-sm flex p-3 w-full justify-start font-medium cursor-pointer text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
}
