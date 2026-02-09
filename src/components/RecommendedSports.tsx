'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import MovieCard from './MovieCard'; // Reusing MovieCard for consistent look
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Sport {
    id: number;
    title: string;
    image_url: string;
    description: string;
    category: string;
}

export default function RecommendedSports() {
    const [sports, setSports] = useState<Sport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSports = async () => {
            try {
                const res = await api.get('/sports');
                setSports(res.data);
            } catch (error) {
                console.error('Failed to fetch sports', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSports();
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto px-0 py-12">
            <div className="flex items-center justify-between mb-6 px-4 sm:px-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recommended Sports</h2>
                <Link href="/sports" className="flex items-center text-sm font-medium text-blue-500 hover:underline">
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
                        sports.map((sport) => (
                            <CarouselItem key={sport.id} className="pl-4 sm:pl-6 basis-auto">
                                <MovieCard
                                    id={sport.id}
                                    title={sport.title}
                                    image={sport.image_url}
                                    genre={sport.category}
                                    basePath="/sports"
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
