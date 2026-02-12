'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, ChevronLeft, Star, Clock, Languages, ThumbsUp, User, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import RecommendedMovies from '@/components/RecommendedMovies';

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

interface Review {
    id: number;
    author: string;
    rating: number;
    comment: string;
    date: string;
}

interface Movie {
    id: number;
    title: string;
    description: string;
    city: string;
    venue: string;
    date_time: string;
    price: number;
    available_seats: number;
    image_url: string;
    cast?: CastMember[];
    crew?: CrewMember[];
    duration?: string;
    language?: string;
    rating?: number;
    format?: string;
    screen_number?: string;
}

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);

    // Mock reviews data (in real app, fetch from API)
    const mockReviews: Review[] = [
        {
            id: 1,
            author: "John Doe",
            rating: 4.5,
            comment: "An absolutely thrilling experience! The cinematography was stunning and the performances were top-notch. Highly recommended for anyone who loves action-packed movies.",
            date: "2024-02-01"
        },
        {
            id: 2,
            author: "Jane Smith",
            rating: 5,
            comment: "Best movie I've seen this year! The story kept me engaged from start to finish. The visual effects were mind-blowing and the soundtrack was perfect.",
            date: "2024-02-03"
        },
        {
            id: 3,
            author: "Mike Johnson",
            rating: 4,
            comment: "Great entertainment value. Some minor pacing issues in the second act, but overall a solid film with excellent performances from the entire cast.",
            date: "2024-02-05"
        }
    ];

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await api.get(`/movies/${id}`);
                setMovie(res.data);
            } catch (error) {
                console.error('Failed to fetch movie', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    const handleBook = () => {
        router.push(`/movies/${id}/shows`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pb-20 pt-20 flex justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-96 w-64 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-6 shadow-2xl"></div>
                    <div className="h-10 w-80 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
                    <div className="h-5 w-64 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-black px-4 pt-20">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Movie Not Found</h1>
                <Button onClick={() => router.push('/movies')}>Browse Movies</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Immersive Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
                <Image
                    src={movie.image_url}
                    alt={movie.title}
                    fill
                    className="object-cover blur-2xl opacity-60 dark:opacity-40 scale-110"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
                    <div className="pt-6 pb-8">
                        <Button
                            variant="secondary"
                            className="bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 backdrop-blur-md text-gray-900 dark:text-white border-0 shadow-sm rounded-full px-4 transition-all hover:scale-105"
                            onClick={() => router.back()}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back to Movies
                        </Button>
                    </div>

                    <div className="mt-auto pb-12 md:pb-16 flex flex-col md:flex-row gap-8 items-end">
                        <div className="relative h-72 w-52 md:h-96 md:w-72 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20 dark:ring-white/10 hidden md:block transform hover:scale-[1.02] transition-transform duration-500">
                            <Image
                                src={movie.image_url}
                                alt={movie.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm backdrop-blur-md bg-red-500/90 text-white animate-in fade-in slide-in-from-bottom-2">
                                    Movie
                                </span>
                                {movie.language && (
                                    <span className="px-3 py-1 bg-white/20 dark:bg-white/10 backdrop-blur-md text-gray-900 dark:text-gray-100 text-xs font-bold rounded-full flex items-center gap-1 animate-in fade-in slide-in-from-bottom-2">
                                        <Languages className="w-3 h-3" />
                                        {movie.language}
                                    </span>
                                )}
                                {movie.format && (
                                    <span className="px-3 py-1 bg-gray-800/80 text-white backdrop-blur-md text-xs font-bold rounded-full animate-in fade-in slide-in-from-bottom-2">
                                        {movie.format}
                                    </span>
                                )}
                                {movie.rating && (
                                    <span className="px-3 py-1 bg-yellow-400/90 text-black backdrop-blur-md text-xs font-bold rounded-full flex items-center gap-1 animate-in fade-in slide-in-from-bottom-2">
                                        <Star className="w-3 h-3 fill-current" />
                                        {movie.rating}/5
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tight drop-shadow-sm animate-in fade-in slide-in-from-bottom-3">
                                {movie.title}
                            </h1>

                            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-lg font-medium text-gray-800 dark:text-gray-200 animate-in fade-in slide-in-from-bottom-4">
                                {movie.duration && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        <span>{movie.duration}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    <span>{new Date(movie.date_time).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    <span>{movie.venue}, {movie.city}</span>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-center md:justify-start animate-in fade-in slide-in-from-bottom-5">
                                <Button
                                    size="lg"
                                    className="h-14 px-8 text-lg font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-600/30 transition-all hover:scale-105 hover:shadow-red-600/50"
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
                        {/* About Section */}
                        <section className="animate-in fade-in slide-in-from-bottom-1">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Film className="w-6 h-6 text-red-500" />
                                About the Movie
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                {movie.description}
                            </p>
                        </section>

                        {/* Cast Section */}
                        {movie.cast && movie.cast.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-2">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <User className="w-6 h-6 text-red-500" />
                                    Cast
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                    {movie.cast.map((actor, idx) => (
                                        <div key={idx} className="text-center group cursor-pointer">
                                            <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden shadow-md group-hover:shadow-2xl transition-all ring-2 ring-transparent group-hover:ring-red-500/50 group-hover:ring-[6px]">
                                                <Image
                                                    src={actor.image}
                                                    alt={actor.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-red-500 transition-colors">{actor.name}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">as {actor.role}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Crew Section */}
                        {movie.crew && movie.crew.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-3">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Film className="w-6 h-6 text-red-500" />
                                    Crew
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                    {movie.crew.map((member, idx) => (
                                        <div key={idx} className="text-center group cursor-pointer">
                                            <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-all ring-2 ring-transparent group-hover:ring-red-500 group-hover:ring-4">
                                                <Image
                                                    src={member.image}
                                                    alt={member.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-red-500 transition-colors">{member.name}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Reviews Section */}
                        <section className="animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <ThumbsUp className="w-6 h-6 text-red-500" />
                                Reviews
                            </h2>
                            <div className="space-y-4">
                                {mockReviews.map((review) => (
                                    <Card key={review.id} className="border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-red-500/5 transition-all hover:scale-[1.01] bg-white dark:bg-slate-900/50 backdrop-blur-sm">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
                                                        {review.author[0]}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 dark:text-white">{review.author}</h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {new Date(review.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 bg-yellow-400/20 px-2 py-1 rounded-full">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{review.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <Card className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-24 shadow-xl">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Movie Info</h3>
                                <div className="space-y-3 text-sm">
                                    {movie.screen_number && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">Screen</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{movie.screen_number}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Available Seats</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{movie.available_seats}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Price</span>
                                        <span className="font-medium text-gray-900 dark:text-white">Rs. {movie.price}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* You Might Like Section */}
                <section className="mt-16 animate-in fade-in slide-in-from-bottom-5">
                    <RecommendedMovies />
                </section>
            </main>
        </div>
    );
}
