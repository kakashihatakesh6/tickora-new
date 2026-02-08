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
        return <div className="flex justify-center p-12">Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
                <Card key={event.id} className="flex flex-col overflow-hidden">
                    <div className="relative aspect-video w-full bg-gray-200">
                        {event.image_url ? (
                            <Image
                                src={event.image_url}
                                alt={event.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-500">No Image</div>
                        )}
                    </div>
                    <CardHeader>
                        <div className="flex justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">{event.event_type}</span>
                            <span className="text-xs font-medium text-gray-500">₹{event.price}</span>
                        </div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(event.date_time).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="mr-2 h-4 w-4" />
                            {event.venue}, {event.city}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link href={`/events/${event.id}`} className="w-full">
                            <Button className="w-full">Book Now</Button>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
            {events.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500">No events found in this category.</div>
            )}
        </div>
    );
}

export default function EventsPage() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-3xl font-bold">Upcoming Events</h1>
            <Suspense fallback={<div>Loading events...</div>}>
                <EventList />
            </Suspense>
        </main>
    )
}
