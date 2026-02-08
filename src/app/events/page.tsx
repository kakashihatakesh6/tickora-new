'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';

interface Event {
    id: number;
    title: string;
    description: string;
    event_type: string;
    city: string;
    venue: string;
    date_time: string;
    price: number;
    image_url: string;
}

function EventList() {
    const searchParams = useSearchParams();
    const category = searchParams.get('category');
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const url = category ? `/events?category=${category}` : '/events';
                const res = await api.get(url);
                setEvents(res.data || []);
            } catch (error) {
                console.error('Failed to fetch events', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [category]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
                        <div className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse" />
                        <div className="p-6 space-y-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse" />
                            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
                <Card key={event.id} className="group flex flex-col overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[16/9] w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        {event.image_url ? (
                            <Image
                                src={event.image_url}
                                alt={event.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-500">No Image</div>
                        )}
                        <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 bg-white/90 dark:bg-black/90 backdrop-blur text-xs font-bold uppercase tracking-wider text-indigo-600 rounded-md shadow-sm">
                                {event.event_type}
                            </span>
                        </div>
                    </div>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-2">
                            <CardTitle className="text-xl font-bold line-clamp-1 text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                {event.title}
                            </CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                            {event.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3 py-2">
                        <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300">
                            <Calendar className="mr-2 h-4 w-4 text-indigo-500" />
                            {new Date(event.date_time).toLocaleDateString(undefined, {
                                weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </div>
                        <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300">
                            <MapPin className="mr-2 h-4 w-4 text-indigo-500" />
                            <span className="line-clamp-1">{event.venue}, {event.city}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2 pb-6 flex items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 uppercase font-semibold">Price</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">₹{event.price}</span>
                        </div>
                        <Link href={`/events/${event.id}`} className="flex-1">
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                                Book Now
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
            {events.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No events found</h3>
                    <p className="text-gray-500 mt-1 max-w-sm">
                        {category ? `No events found in the "${category}" category.` : "There are currently no upcoming events."}
                    </p>
                    <Link href="/" className="mt-6">
                        <Button variant="outline">View All Categories</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function EventsPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pt-8 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 text-center sm:text-left border-b border-gray-200 dark:border-gray-800 pb-6">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-2">
                        Explore Events
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
                        Discover the best concerts, movies, and plays happening near you.
                    </p>
                </div>

                <Suspense fallback={
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                        ))}
                    </div>
                }>
                    <EventList />
                </Suspense>
            </div>
        </main>
    )
}
