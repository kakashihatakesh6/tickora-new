'use client';

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
import api, { ApiResponse } from '@/lib/api';
import { Event } from '@/types';




export default function RecommendedEvents() {
    const [events, setEvents] = useState<Event[]>([]);



    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events') as ApiResponse<Event[]>;

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
        <div className="w-full max-w-7xl mx-auto px-0 py-16">
            <div className="flex items-center justify-between mb-8 px-4 sm:px-0">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Recommended Events</h2>
                <Link href="/events" className="group flex items-center text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
                    See All <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                <CarouselPrevious className="left-4 -translate-x-0 h-12 w-12 border-none bg-slate-100/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-700 shadow-xl backdrop-blur-md hidden sm:flex transition-all hover:scale-110" />
                <CarouselNext className="right-4 translate-x-0 h-12 w-12 border-none bg-slate-100/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-700 shadow-xl backdrop-blur-md hidden sm:flex transition-all hover:scale-110" />
            </Carousel>
        </div>
    );
}
