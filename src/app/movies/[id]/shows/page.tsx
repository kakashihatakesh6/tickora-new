'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import api, { ApiResponse } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { ChevronLeft, Search, Filter, Info, Heart } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Movie {
    id: number;
    title: string;
    description: string;
    image_url: string;
    language?: string;
    rating?: number;
    duration?: string;
}

interface MovieShow {
    id: number;
    movieId: number;
    venue: string;
    city: string;
    screenNumber: string;
    dateTime: string;
    price: number;
    totalSeats: number;
    availableSeats: number;
    format: string;
}

export default function MovieShowsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [shows, setShows] = useState<MovieShow[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch movie details
                const movieRes = await api.get(`/movies/${id}`) as ApiResponse<Movie>;
                setMovie(movieRes.data);

                // Fetch all shows for this movie
                const showsRes = await api.get(`/movies/${id}/shows`) as ApiResponse<MovieShow[]>;
                setShows(showsRes.data);

            } catch (error) {
                console.error('Failed to fetch movie data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleShowSelect = (showId: number) => {
        router.push(`/movies/${id}/seats?showId=${showId}`);
    };

    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    // Filter shows by selected date
    const selectedDateObj = dates[selectedDate];
    const filteredShows = shows.filter(show => {
        const showDate = new Date(show.dateTime);
        return showDate.toDateString() === selectedDateObj.toDateString();
    });

    // Group shows by venue
    const showsByVenue = filteredShows.reduce((acc, show) => {
        const venueKey = `${show.venue}-${show.city}`;
        if (!acc[venueKey]) {
            acc[venueKey] = {
                venue: show.venue,
                city: show.city,
                shows: []
            };
        }
        acc[venueKey].shows.push(show);
        return acc;
    }, {} as Record<string, { venue: string; city: string; shows: MovieShow[] }>);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
            </div>
        </div>
    );

    if (!movie) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
            <Button onClick={() => router.push('/movies')}>Back to Movies</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                <ChevronLeft className="w-6 h-6" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none">
                                    {movie.title}
                                </h1>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <span className="border border-gray-300 dark:border-gray-700 px-1 rounded">UA16+</span>
                                    <span>{movie.language || 'English'}</span>
                                    {movie.duration && (
                                        <>
                                            <span>•</span>
                                            <span>{movie.duration}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <Button variant="ghost" size="sm"><Search className="w-4 h-4 mr-2" /> Search</Button>
                        </div>
                    </div>
                </div>

                {/* Date Slider */}
                <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto no-scrollbar">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex gap-4 py-2 min-w-max">
                            {dates.map((date, idx) => {
                                const isSelected = selectedDate === idx;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedDate(idx)}
                                        className={cn(
                                            "flex flex-col items-center justify-center w-14 h-16 rounded-lg transition-all",
                                            isSelected
                                                ? "bg-red-500 text-white shadow-md scale-105"
                                                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                                        )}
                                    >
                                        <span className="text-xs uppercase font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                        <span className="text-lg font-bold">{date.getDate()}</span>
                                        <span className="text-[10px] uppercase">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 overflow-x-auto no-scrollbar">
                    <button className="flex items-center hover:text-red-500 whitespace-nowrap">
                        Price Range <Filter className="w-3 h-3 ml-1" />
                    </button>
                    <button className="flex items-center hover:text-red-500 whitespace-nowrap">
                        Show Times <Filter className="w-3 h-3 ml-1" />
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div> Available
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div> Fast Filling
                    </div>
                </div>
            </div>

            {/* Venue List */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
                {Object.values(showsByVenue).length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 dark:text-gray-400">No shows available for the selected date.</p>
                    </div>
                ) : (
                    Object.values(showsByVenue).map((venueData, venueIdx) => (
                        <div key={venueIdx} className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 group">
                            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer" />
                                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">
                                                {venueData.venue}, {venueData.city}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex items-center gap-6 text-xs text-gray-500 mt-2">
                                        <span className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                            <Info className="w-3 h-3" /> M-Ticket Available
                                        </span>
                                        <span className="flex items-center gap-1 text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                                            <Info className="w-3 h-3" /> Food & Beverage
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 md:flex-[2]">
                                    <div className="flex flex-wrap gap-4">
                                        {venueData.shows.map((show) => {
                                            const showTime = new Date(show.dateTime);
                                            const availabilityPercent = (show.availableSeats / show.totalSeats) * 100;
                                            const status = availabilityPercent === 0 ? 'SOLD_OUT' : availabilityPercent < 30 ? 'FAST_FILLING' : 'AVAILABLE';

                                            return (
                                                <div key={show.id} className="group/time relative">
                                                    <button
                                                        onClick={() => status !== 'SOLD_OUT' && handleShowSelect(show.id)}
                                                        disabled={status === 'SOLD_OUT'}
                                                        className={cn(
                                                            "w-28 py-2 px-1 border rounded-lg text-sm transition-all flex flex-col items-center justify-center gap-0.5",
                                                            status === 'AVAILABLE'
                                                                ? "border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                                : status === 'FAST_FILLING'
                                                                    ? "border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                                                    : "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                                                        )}
                                                    >
                                                        <span className="font-bold">
                                                            {showTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <span className="text-[10px] uppercase font-medium">{show.format}</span>
                                                        <span className="text-[9px] text-gray-400">{show.screenNumber}</span>
                                                    </button>

                                                    {status !== 'SOLD_OUT' && (
                                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover/time:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                            ₹{show.price}
                                                            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                                        <span>Cancellation Available</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}
