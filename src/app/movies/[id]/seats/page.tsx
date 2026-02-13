'use client';

import { useEffect, useState, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api, { ApiResponse } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import SeatMap from '@/components/SeatMap';

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
    occupied_seats?: string[];
}

interface Movie {
    id: number;
    title: string;
    description: string;
    image_url: string;
}

function MovieSeatSelectionContent({ params }: { params: Promise<{ id: string }> }) {
    const { id: movieId } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const showId = searchParams.get('showId');

    const [movie, setMovie] = useState<Movie | null>(null);
    const [show, setShow] = useState<MovieShow | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState<{ id: string; price: number; tier: string }[]>([]);

    useEffect(() => {
        // Check authentication first
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
            // Redirect to login with return URL
            const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
            router.push(`/login?returnUrl=${returnUrl}`);
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch movie details
                const movieRes = await api.get(`/movies/${movieId}`) as ApiResponse<Movie>;
                setMovie(movieRes.data);

                // Fetch show details with occupied seats
                if (showId) {
                    const showRes = await api.get(`/movie-shows/${showId}`) as ApiResponse<MovieShow>;
                    setShow(showRes.data);
                }

            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [movieId, showId, router]);

    const handleSeatSelect = async (seatId: string, price: number, tier: string) => {
        const isSelected = selectedSeats.some(s => s.id === seatId);

        if (isSelected) {
            // Deselect: Unlock seat
            try {
                await api.post('/bookings/unlock', {
                    eventId: showId,
                    seatId: seatId
                });
                setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
            } catch (error) {
                console.error("Failed to unlock seat", error);
                // Even if unlock fails, deselect locally to allow user to proceed/cancel
                setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
            }
        } else {
            // Select: Lock seat
            if (selectedSeats.length >= 10) {
                alert("You can only select up to 10 seats.");
                return;
            }

            try {
                const res = await api.post('/bookings/lock', {
                    eventId: showId,
                    seatId: seatId
                });
                if (res.status === 200) {
                    setSelectedSeats(prev => [...prev, { id: seatId, price, tier }]);
                }
            } catch (error: unknown) {
                console.error("Failed to lock seat", error);
                const errorMessage = (error as { response?: { data?: { error?: string } } }).response?.data?.error || "Failed to lock seat. It might be already taken.";
                alert(errorMessage);
            }

        }
    };

    const handleProceed = () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }
        const seatsParam = selectedSeats.map(s => s.id).join(',');
        // Redirect to booking/checkout with showId and bookingType=MOVIE
        router.push(`/bookings/checkout?eventId=${showId}&seats=${seatsParam}&type=MOVIE`);
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
    if (!movie || !show) return <div className="min-h-screen bg-background flex items-center justify-center">Show not found</div>;

    const totalPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0);
    const showTime = new Date(show.dateTime);
    const dateDisplay = showTime.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    const timeDisplay = showTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            {/* Header - Purple Gradient */}
            <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/20 hover:text-white">
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-bold leading-none">
                                {selectedSeats.length > 0 ? `Select ${selectedSeats.length} Seats` : 'Select Seats'}
                            </h1>
                            <div className="text-xs text-blue-100 mt-1 flex items-center gap-1 opacity-90">
                                <span>{movie.title}</span>
                                <span>•</span>
                                <span className="font-medium">
                                    {dateDisplay}, {timeDisplay}
                                </span>
                                <span>•</span>
                                <span>{show.format}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Seat Map Container */}
            <main className="flex-1 bg-background relative overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center">
                    <div className="w-full max-w-4xl pb-32 pt-8">
                        <SeatMap
                            occupiedSeats={show.occupied_seats || []}
                            selectedSeats={selectedSeats.map(s => s.id)}
                            maxSelectable={10}
                            onSeatSelect={handleSeatSelect}
                            basePrice={show.price}
                            category="Movie"
                        />

                    </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-4 sticky bottom-0 z-50 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex flex-col">
                            {selectedSeats.length > 0 ? (
                                <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2">
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase mb-0.5">
                                        SEAT {selectedSeats.length}
                                    </span>
                                    <div className="text-2xl font-black text-gray-900 dark:text-white flex items-baseline gap-1">
                                        <span>{selectedSeats[selectedSeats.length - 1].id.replace(/([A-Z])(\d+)/, '$1 $2')}</span>
                                        {selectedSeats.length > 1 && <span className="text-sm font-normal text-gray-400 ml-1">(+{selectedSeats.length - 1} more)</span>}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 mb-0.5">Tickets starting at</span>
                                    <div className="font-bold text-xl text-gray-900 dark:text-white">
                                        ₹{show.price}
                                    </div>
                                </div>
                            )}
                        </div>

                        {selectedSeats.length > 0 ? (
                            <Button
                                size="lg"
                                className="px-12 h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-600/20 transition-all hover:scale-105"
                                onClick={handleProceed}
                            >
                                <div className="flex flex-col items-center leading-none gap-1">
                                    <span>Pay ₹{totalPrice}</span>
                                </div>
                            </Button>
                        ) : (
                            <Button disabled variant="outline" className="px-10 h-12 rounded-xl opacity-50">Select Seats</Button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function MovieSeatSelectionPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
            <MovieSeatSelectionContent params={params} />
        </Suspense>
    );
}
