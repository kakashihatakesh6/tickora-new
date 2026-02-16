'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: SignupFormValues) => {
        setIsLoading(true);
        try {
            await api.post('/auth/register', data);

            toast.success("Account created!", {
                description: "You can now sign in with your credentials.",
            });

            // After signup, redirect to login
            router.push('/login');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            const errorMessage = error.response?.data?.error || 'Failed to create account. Please try again.';

            toast.error("Signup failed", {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Decorative */}
            <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-purple-950 p-12 text-white lg:flex">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent"></div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                        <div className="rounded-full bg-white/10 p-2 backdrop-blur-sm">
                            <span className="text-purple-400">TM</span>
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
                            Start your journey with us today.
                        </h2>
                        <p className="mt-4 text-lg text-purple-200">
                            Create an account to unlock exclusive access to pre-sale tickets and personalized event recommendations.
                        </p>
                    </motion.div>
                </div>

                <div className="relative z-10 flex gap-4 text-sm text-purple-300">
                    <span>© 2024 TicketMaster Inc.</span>
                    <a href="#" className="hover:text-white">Privacy</a>
                    <a href="#" className="hover:text-white">Terms</a>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full flex-col justify-center bg-white p-8 lg:w-1/2 lg:p-12">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create an account</h1>
                        <p className="mt-2 text-gray-600">
                            Enter your details below to get started
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700" htmlFor="name">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    {...register("name")}
                                    className={`pl-10 h-11 focus:ring-purple-500 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'}`}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    {...register("email")}
                                    className={`pl-10 h-11 focus:ring-purple-500 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'}`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password")}
                                    className={`pl-10 h-11 focus:ring-purple-500 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'}`}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                            )}
                            <p className="text-xs text-gray-500">Must be at least 6 characters long</p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Create Account <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                type="button"
                                disabled={isLoading}
                                onClick={() => window.location.href = 'http://localhost:8080/api/v1/auth/google'}
                            >
                                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                </svg>
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                disabled={isLoading}
                                onClick={() => window.location.href = 'http://localhost:8080/api/v1/auth/github'}
                            >
                                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                                    <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-2.9-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
                                </svg>
                                GitHub
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-500">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
