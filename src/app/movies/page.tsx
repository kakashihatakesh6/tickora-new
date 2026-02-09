'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Eye } from 'lucide-react';

interface Movie {
    id: number;
    title: string;
    description: string;
    image_url: string;
    duration?: string;
    language?: string;
    rating?: number;
}

function MovieList() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                // Fetch strictly movies
                const res = await api.get('/movies');
                setMovies(res.data || []);
            } catch (error) {
                console.error('Failed to fetch movies', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {movies.map((movie) => (
                <Card key={movie.id} className="group flex flex-col overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[2/3] w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <Image
                            src={movie.image_url}
                            alt={movie.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 bg-red-600/90 text-white backdrop-blur text-xs font-bold uppercase tracking-wider rounded-md shadow-sm">
                                Movie
                            </span>
                        </div>
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold line-clamp-1 text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">
                            {movie.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                            {movie.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3 py-2">
                        {movie.duration && (
                            <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300">
                                <Calendar className="mr-2 h-4 w-4 text-red-500" />
                                {movie.duration}
                            </div>
                        )}
                        {movie.language && (
                            <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300">
                                <MapPin className="mr-2 h-4 w-4 text-red-500" />
                                {movie.language}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="pt-2 pb-6">
                        <Link href={`/movies/${movie.id}`} className="w-full">
                            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                                Book Now
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
            {movies.length === 0 && (
                <div className="col-span-full py-20 text-center">
                    <h3 className="text-lg font-semibold">No movies found</h3>
                </div>
            )}
        </div>
    );
}

export default function MoviesPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pt-8 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 text-center sm:text-left border-b border-gray-200 dark:border-gray-800 pb-6">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-2">
                        Now Showing
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
                        Watch the latest blockbusters at a theater near you.
                    </p>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <MovieList />
                </Suspense>
            </div>
        </main>
    )
}
