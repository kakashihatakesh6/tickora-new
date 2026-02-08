'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, ChevronLeft, Star, Clock, Languages, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define types for Cast and Crew based on backend seed
interface CastMember {
    name: string;
    role: string;
    image: string;
}

interface CrewMember {
    name: string;
    role: string;
    image: string;
}

interface Event {
    id: number;
    title: string;
    description: string;
    event_type: string;
    city: string;
    venue: string;
    date_time: string;
    price: number;
    available_seats: number;
    image_url: string;
    occupied_seats?: string[];
    // New fields
    cast?: CastMember[];
    crew?: CrewMember[];
    duration?: string;
    language?: string;
    rating?: number;
}

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`);
                setEvent(res.data);
            } catch (error) {
                console.error('Failed to fetch event', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBook = () => {
        router.push(`/events/${id}/shows`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
                {/* Hero Skeleton */}
                <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-gray-200 dark:bg-gray-900 animate-pulse">
                    <div className="h-20" /> {/* Navbar Spacer */}
                    <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
                        <div className="pt-6 pb-8">
                            <div className="h-10 w-32 bg-gray-300 dark:bg-gray-800 rounded-full" />
                        </div>
                        <div className="mt-auto pb-12 md:pb-16 flex flex-col md:flex-row gap-8 items-end">
                            {/* Poster Skeleton */}
                            <div className="h-72 w-52 md:h-96 md:w-72 bg-gray-300 dark:bg-gray-800 rounded-2xl shrink-0" />

                            {/* Details Skeleton */}
                            <div className="flex-1 space-y-4 w-full">
                                <div className="flex gap-3 mb-2">
                                    <div className="h-6 w-20 bg-gray-300 dark:bg-gray-800 rounded-full" />
                                    <div className="h-6 w-24 bg-gray-300 dark:bg-gray-800 rounded-full" />
                                </div>
                                <div className="h-12 md:h-16 w-3/4 bg-gray-300 dark:bg-gray-800 rounded-lg" />
                                <div className="flex gap-8 mt-4">
                                    <div className="h-8 w-40 bg-gray-300 dark:bg-gray-800 rounded-lg" />
                                    <div className="h-8 w-40 bg-gray-300 dark:bg-gray-800 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-black px-4 pt-20">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Event Not Found</h1>
                <p className="text-gray-500 mb-6">The event you are looking for does not exist or has been removed.</p>
                <Button onClick={() => router.push('/')}>Browse Events</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
            {/* Immersive Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
                {/* Background Image with Blur */}
                <Image
                    src={event.image_url}
                    alt={event.title}
                    fill
                    className="object-cover blur-2xl opacity-60 dark:opacity-40 scale-110"
                    priority
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/60 to-transparent dark:from-black dark:via-black/60 dark:to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

                {/* Navigation and Content Container */}
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">

                    {/* Back Navigation */}
                    <div className="pt-6 pb-8">
                        <Button
                            variant="secondary"
                            className="bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 backdrop-blur-md text-gray-900 dark:text-white border-0 shadow-sm rounded-full px-4"
                            onClick={() => router.back()}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back to Events
                        </Button>
                    </div>

                    {/* Hero Content */}
                    <div className="mt-auto pb-12 md:pb-16 flex flex-col md:flex-row gap-8 items-end">
                        {/* Poster Image (Desktop) */}
                        <div className="relative h-72 w-52 md:h-96 md:w-72 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20 dark:ring-white/10 hidden md:block transform hover:scale-[1.02] transition-transform duration-500">
                            <Image
                                src={event.image_url}
                                alt={event.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <span className={cn(
                                    "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm backdrop-blur-md",
                                    event.event_type === 'MOVIE' ? "bg-red-500/90 text-white" :
                                        event.event_type === 'CONCERT' ? "bg-purple-500/90 text-white" :
                                            "bg-indigo-500/90 text-white"
                                )}>
                                    {event.event_type}
                                </span>
                                {event.language && (
                                    <span className="px-3 py-1 bg-white/20 dark:bg-white/10 backdrop-blur-md text-gray-900 dark:text-gray-100 text-xs font-bold rounded-full flex items-center gap-1">
                                        <Languages className="w-3 h-3" />
                                        {event.language}
                                    </span>
                                )}
                                {event.rating && (
                                    <span className="px-3 py-1 bg-yellow-400/90 text-black backdrop-blur-md text-xs font-bold rounded-full flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        {event.rating}/5
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tight drop-shadow-sm">
                                {event.title}
                            </h1>

                            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-lg font-medium text-gray-800 dark:text-gray-200">
                                {event.duration && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        <span>{event.duration}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    <span>{new Date(event.date_time).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    <span>{event.venue}, {event.city}</span>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-center md:justify-start">
                                <Button
                                    size="lg"
                                    className="h-14 px-8 text-lg font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-600/30 transition-all hover:scale-105"
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
                    {/* Left Column: Description, Cast, Crew */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Mobile Poster */}
                        <div className="md:hidden relative h-64 w-full rounded-2xl overflow-hidden shadow-xl mb-6 ring-1 ring-black/5">
                            <Image
                                src={event.image_url}
                                alt={event.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* About Section */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About the Event</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                {event.description}
                            </p>
                        </section>

                        {/* Cast Section */}
                        {event.cast && event.cast.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cast</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                    {event.cast.map((actor, idx) => (
                                        <div key={idx} className="text-center group">
                                            <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-all ring-2 ring-transparent group-hover:ring-indigo-500">
                                                <Image
                                                    src={actor.image}
                                                    alt={actor.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{actor.name}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">as {actor.role}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Crew Section */}
                        {event.crew && event.crew.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Crew</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                    {event.crew.map((member, idx) => (
                                        <div key={idx} className="text-center group">
                                            <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-all ring-2 ring-transparent group-hover:ring-indigo-500">
                                                <Image
                                                    src={member.image}
                                                    alt={member.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{member.name}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Top Reviews (Mock) */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Reviews</h2>
                                <Button variant="ghost" className="text-red-500">Write a Review</Button>
                            </div>
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <Card key={i} className="border-0 shadow-sm bg-gray-50 dark:bg-gray-900">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                                                        U{i}
                                                    </div>
                                                    <span className="font-semibold text-gray-900 dark:text-white">User {i}</span>
                                                </div>
                                                <div className="flex items-center text-yellow-400 text-sm">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span className="ml-1 font-medium text-gray-900 dark:text-white">4.{8 - i}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                                Absolutely loved this! The experience was surreal and worth every penny.
                                                The sound quality and visuals were top-notch. Highly recommended!
                                            </p>
                                            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                                                <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                                                    <ThumbsUp className="w-3 h-3" /> Helpful (12)
                                                </button>
                                                <span>2 days ago</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: You might also like */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">You might also like</h3>
                            <div className="space-y-4">
                                {/* Mock Recommendations */}
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="group cursor-pointer flex gap-4 items-start" onClick={() => router.push('/')}>
                                        <div className="relative w-20 h-28 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                                            {/* Placeholder for similar movies */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-red-500 transition-colors line-clamp-2">
                                                Trending Event {i}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1">Action/Thriller</p>
                                            <div className="flex items-center text-xs font-medium text-gray-900 dark:text-white mt-2">
                                                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                                4.5
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl mt-8">
                                <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">Get Updates</h4>
                                <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-4">
                                    Subscribe to hear about the latest events and offers.
                                </p>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Subscribe</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
