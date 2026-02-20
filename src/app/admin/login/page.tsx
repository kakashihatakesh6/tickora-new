"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, ShieldCheck } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { User } from "@/types";

interface LoginResponse {
    token: string;
    user: User;
}

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    // If already logged in as admin, redirect to dashboard
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRaw = localStorage.getItem("user");
        if (token && userRaw) {
            try {
                const user = JSON.parse(userRaw);
                if (user?.role === "admin") {
                    router.replace("/admin");
                    return;
                }
            } catch {
                // ignore
            }
        }
        setCheckingAuth(false);
    }, [router]);

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            const response = await api.post<LoginResponse>("/auth/login", data);
            const { token, user } = response.data;

            if (user?.role !== "admin") {
                toast.error("Access Denied", {
                    description: "You do not have admin privileges.",
                });
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            toast.success("Welcome, Admin!", {
                description: "Redirecting to dashboard...",
            });

            router.push("/admin");
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            const errorMessage =
                error.response?.data?.error ||
                "Invalid credentials. Please try again.";
            toast.error("Login failed", { description: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-950 relative overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                {/* Card */}
                <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <ShieldCheck className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Admin Portal
                            </h1>
                            <p className="text-sm text-gray-400 mt-1">
                                Sign in with your admin credentials
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300" htmlFor="email">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    {...register("email")}
                                    className={`pl-10 h-11 bg-gray-800/60 border-white/10 text-white placeholder:text-gray-600 focus:border-violet-500 focus:ring-violet-500/20 ${errors.email ? "border-red-500" : ""
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("password")}
                                    className={`pl-10 h-11 bg-gray-800/60 border-white/10 text-white placeholder:text-gray-600 focus:border-violet-500 focus:ring-violet-500/20 ${errors.password ? "border-red-500" : ""
                                        }`}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-semibold rounded-lg shadow-lg shadow-violet-500/20 transition-all"
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                "Sign In to Admin"
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-600">
                        © {new Date().getFullYear()} TicketMaster · Admin Panel
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
