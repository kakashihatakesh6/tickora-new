'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const resetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const otp = searchParams.get('otp');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!email || !otp) {
            toast.error("Missing information", { description: "Please verify OTP first." });
            router.push('/forgot-password');
        }
    }, [email, otp, router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: ResetPasswordFormValues) => {
        if (!email || !otp) return;

        setIsLoading(true);
        try {
            await api.post<{ message: string }>('/auth/reset-password', {
                email,
                otp,
                password: data.password
            });

            toast.success("Password Reset!", {
                description: "You have successfully reset your password. Please log in.",
            });

            router.push('/login');

        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            const errorMessage = error.response?.data?.error || 'Failed to reset password. Please try again.';
            toast.error("Reset failed", {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Decorative */}
            <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-indigo-950 p-12 text-white lg:flex">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2669&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 to-transparent"></div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                        <div className="rounded-full bg-white/10 p-2 backdrop-blur-sm">
                            <span className="text-indigo-400">TM</span>
                        </div>
                        TicketMaster
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-4xl font-bold leading-tight">
                            Almost there.
                        </h2>
                        <p className="mt-4 text-lg text-indigo-200">
                            Create a new password to secure your account and get back in.
                        </p>
                    </motion.div>
                </div>

                <div className="relative z-10 flex gap-4 text-sm text-indigo-300">
                    <span>© 2024 TicketMaster Inc.</span>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full flex-col justify-center bg-white p-8 lg:w-1/2 lg:p-12">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reset Password</h1>
                        <p className="mt-2 text-gray-600">
                            Enter your new password below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700" htmlFor="password">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password")}
                                    className={`pl-10 h-11 focus:ring-indigo-500 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'}`}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    {...register("confirmPassword")}
                                    className={`pl-10 h-11 focus:ring-indigo-500 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'}`}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Reset Password <CheckCircle2 className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
