'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const verifyOtpSchema = z.object({
    otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

function VerifyOtpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!email) {
            toast.error("Email missing", { description: "Please start from the forgot password page." });
            router.push('/forgot-password');
        }
    }, [email, router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VerifyOtpFormValues>({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: {
            otp: '',
        },
    });

    const onSubmit = async (data: VerifyOtpFormValues) => {
        if (!email) return;

        setIsLoading(true);
        try {
            await api.post<{ message: string }>('/auth/verify-otp', {
                email,
                otp: data.otp
            });

            toast.success("Verified!", {
                description: "OTP verified successfully.",
            });

            // Navigate to reset-password with email and otp
            // IMPORTANT: Passing OTP in query param is not ideal for checking, but for this flow:
            // reset-password endpoint needs OTP again to verify authenticity before changing password.
            // Or we could use a temporary token. For now, passing them carefully.
            router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(data.otp)}`);

        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            const errorMessage = error.response?.data?.error || 'Invalid OTP. Please try again.';
            toast.error("Verification failed", {
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
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
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
                            Security check.
                        </h2>
                        <p className="mt-4 text-lg text-indigo-200">
                            Please verify your identity to continue.
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
                        href="/forgot-password"
                        className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Enter OTP</h1>
                        <p className="mt-2 text-gray-600">
                            We sent a 6-digit code to <span className="font-semibold text-gray-900">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700" htmlFor="otp">OTP Code</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="otp"
                                    type="text"
                                    maxLength={6}
                                    placeholder="123456"
                                    {...register("otp")}
                                    className={`pl-10 h-11 focus:ring-indigo-500 ${errors.otp ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'} tracking-widest`}
                                />
                            </div>
                            {errors.otp && (
                                <p className="text-xs text-red-500 mt-1">{errors.otp.message}</p>
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
                                    Verify Code <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <VerifyOtpContent />
        </Suspense>
    );
}
