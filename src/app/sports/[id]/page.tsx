'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, ChevronLeft, Map, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Sport {
    id: number;
    title: string;
    description: string;
    category: string;
    city: string;
    venue: string;
    date_time: string;
    price: number;
    available_seats: number;
    image_url: string;
    // Sport specific
    // teams?: string[]; // If we had team names separately
}

export default function SportDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [sport, setSport] = useState<Sport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSport = async () => {
            try {
                // Fetch from /sports endpoint
                const res = await api.get(`/sports/${id}`);
                setSport(res.data);
            } catch (error) {
                console.error('Failed to fetch sport', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSport();
    }, [id]);

    const handleBook = () => {
        router.push(`/sports/${id}/shows`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black pb-20 pt-20 flex justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-64 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
                    <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
            </div>
        );
    }

    if (!sport) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-black px-4 pt-20">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sport Event Not Found</h1>
                <Button onClick={() => router.push('/sports')}>Browse Sports</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
            {/* Immersive Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
                <Image
                    src={sport.image_url}
                    alt={sport.title}
                    fill
                    className="object-cover blur-2xl opacity-60 dark:opacity-40 scale-110"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/60 to-transparent dark:from-black dark:via-black/60 dark:to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
                    <div className="pt-6 pb-8">
                        <Button
                            variant="secondary"
                            className="bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 backdrop-blur-md text-gray-900 dark:text-white border-0 shadow-sm rounded-full px-4"
                            onClick={() => router.back()}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back to Sports
                        </Button>
                    </div>

                    <div className="mt-auto pb-12 md:pb-16 flex flex-col md:flex-row gap-8 items-end">
                        <div className="relative h-72 w-52 md:h-96 md:w-72 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20 dark:ring-white/10 hidden md:block transform hover:scale-[1.02] transition-transform duration-500">
                            <Image
                                src={sport.image_url}
                                alt={sport.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm backdrop-blur-md bg-blue-500/90 text-white">
                                    {sport.category}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tight drop-shadow-sm">
                                {sport.title}
                            </h1>

                            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-lg font-medium text-gray-800 dark:text-gray-200">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    <span>{new Date(sport.date_time).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    <span>{sport.venue}, {sport.city}</span>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-center md:justify-start">
                                <Button
                                    size="lg"
                                    className="h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/30"
                                    onClick={handleBook}
                                >
                                    Book Tickets
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About the Match</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                {sport.description}
                            </p>
                        </section>

                        {/* Could add team players here if we enhance the model */}
                    </div>
                </div>
            </main>
        </div>
    );
}
