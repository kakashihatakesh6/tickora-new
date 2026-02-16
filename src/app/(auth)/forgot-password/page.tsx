'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordContent() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setIsLoading(true);
        try {
            const response = await api.post<{ message: string }>('/auth/forgot-password', data);

            toast.success("OTP Sent!", {
                description: response.data.message || "Check your email for the OTP.",
            });

            // Navigate to verify-otp with email as query param to pre-fill or use context
            router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);

        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            const errorMessage = error.response?.data?.error || 'Something went wrong. Please try again.';
            toast.error("Request failed", {
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
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
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
                            Don&apos;t worry, we got you.
                        </h2>
                        <p className="mt-4 text-lg text-indigo-200">
                            Reset your password in a few simple steps and get back to discovering events.
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
                    <Link
                        href="/login"
                        className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to login
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Forgot password?</h1>
                        <p className="mt-2 text-gray-600">
                            No worries, we&apos;ll send you reset instructions.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    {...register("email")}
                                    className={`pl-10 h-11 focus:ring-indigo-500 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'}`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
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
                                    Send OTP <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ForgotPasswordContent />
        </Suspense>
    );
}
