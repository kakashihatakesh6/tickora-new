'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        const handleAuth = async () => {
            if (token) {
                try {
                    // Store token mainly for the API call
                    localStorage.setItem('token', token);

                    // Fetch user details
                    const response = await fetch('http://localhost:8080/api/v1/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        localStorage.setItem('user', JSON.stringify(userData));

                        // Dispatch events to update UI components
                        window.dispatchEvent(new Event('storage'));
                        window.dispatchEvent(new Event('auth-update'));

                        toast.success('Successfully logged in!');
                        router.push('/');
                        router.refresh(); // Ensure server components revalidating if needed
                    } else {
                        throw new Error('Failed to fetch user profile');
                    }
                } catch (err) {
                    console.error('Auth error:', err);
                    toast.error('Authentication failed', {
                        description: 'Could not verify user profile'
                    });
                    router.push('/login');
                }
            } else if (error) {
                toast.error('Authentication failed', {
                    description: error === 'AuthenticationFailed' ? 'Could not authenticate with provider' : 'An error occurred'
                });
                router.push('/login');
            } else {
                router.push('/login');
            }
        };

        handleAuth();
    }, [searchParams, router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-gray-500">Completing authentication...</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>}>
            <AuthCallbackContent />
        </Suspense>
    );
}
