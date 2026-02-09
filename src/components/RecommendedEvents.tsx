'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import MovieCard from './MovieCard';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Event {
    id: number;
    title: string;
    image_url: string;
    description: string;
    event_type: string;
}

export default function RecommendedEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                setEvents(res.data);
            } catch (error) {
                console.error('Failed to fetch events', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto px-0 py-12">
            <div className="flex items-center justify-between mb-6 px-4 sm:px-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recommended Events</h2>
                <Link href="/events" className="flex items-center text-sm font-medium text-purple-500 hover:underline">
                    See All <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            <Carousel
                opts={{
                    align: "start",
                    loop: false,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4 sm:-ml-6">
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <CarouselItem key={i} className="pl-4 sm:pl-6 basis-auto">
                                <MovieCard id={i} title="" image="" genre="" loading={true} />
                            </CarouselItem>
                        ))
                    ) : (
                        events.map((event) => (
                            <CarouselItem key={event.id} className="pl-4 sm:pl-6 basis-auto">
                                <MovieCard
                                    id={event.id}
                                    title={event.title}
                                    image={event.image_url}
                                    genre={event.description}
                                    basePath="/events"
                                />
                            </CarouselItem>
                        ))
                    )}
                </CarouselContent>
                <CarouselPrevious className="left-0 -translate-x-1/2 h-10 w-10 border-none bg-gray-200/80 hover:bg-gray-300 dark:bg-gray-800/80 dark:hover:bg-gray-700 hidden sm:flex" />
                <CarouselNext className="right-4 translate-x-1/2 h-10 w-10 border-none bg-gray-200/80 hover:bg-gray-300 dark:bg-gray-800/80 dark:hover:bg-gray-700 hidden sm:flex" />
            </Carousel>
        </div>
    );
}
