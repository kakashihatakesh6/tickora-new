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
