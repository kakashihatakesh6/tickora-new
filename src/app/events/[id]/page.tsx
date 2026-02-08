'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, ChevronLeft, Share2, Info } from 'lucide-react';
import SeatMap from '@/components/SeatMap';
import { cn } from '@/lib/utils';

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
}

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);


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

    const handleSeatSelect = (seatId: string) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(s => s !== seatId);
            }
            if (prev.length >= 10) {
                alert("You can only select up to 10 seats.");
                return prev;
            }
            return [...prev, seatId];
        });
    };

    const handleBook = () => {
        // Check auth
        if (!localStorage.getItem('token')) {
            router.push('/login');
            return;
        }

        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }

        const seatsParam = selectedSeats.join(',');
        router.push(`/bookings/checkout?eventId=${id}&seats=${seatsParam}`);
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

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="h-40 bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800">
                                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
                                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
                                    <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
                                </div>
                            </div>

                            <div className="h-[400px] bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800" />
                        </div>

                        <div className="lg:col-span-1">
                            <div className="h-80 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6" />
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

    const totalPrice = event.price * selectedSeats.length;

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

                {/* Navbar Spacer */}
                {/* <div className="h-20" /> */}

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
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <span className={cn(
                                    "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm backdrop-blur-md",
                                    event.event_type === 'MOVIE' ? "bg-red-500/90 text-white" :
                                        event.event_type === 'CONCERT' ? "bg-purple-500/90 text-white" :
                                            "bg-indigo-500/90 text-white"
                                )}>
                                    {event.event_type}
                                </span>
                                <span className="px-3 py-1 bg-white/20 dark:bg-white/10 backdrop-blur-md text-gray-900 dark:text-gray-100 text-xs font-bold rounded-full">
                                    {event.city}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tight drop-shadow-sm">
                                {event.title}
                            </h1>

                            <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-3 text-lg font-medium text-gray-800 dark:text-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-full">
                                        <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <span>{new Date(event.date_time).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-pink-100 dark:bg-pink-500/20 rounded-full">
                                        <MapPin className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                                    </div>
                                    <span>{event.venue}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Description & Seats */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Mobile Poster (Visible only on small screens) */}
                        <div className="md:hidden relative h-64 w-full rounded-2xl overflow-hidden shadow-xl mb-6 ring-1 ring-black/5">
                            <Image
                                src={event.image_url}
                                alt={event.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* About Section */}
                        <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-2 mb-4">
                                <Info className="text-indigo-500 w-5 h-5" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About the Event</h2>
                            </div>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                {event.description}
                            </p>
                        </section>

                        {/* Seat Selection Section */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select Seats</h2>
                                <div className="text-sm font-medium px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
                                    Max 10 seats
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                                {/* Legend */}
                                <div className="p-4 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800 flex justify-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-indigo-600 rounded-md shadow-md shadow-indigo-500/20"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Selected</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 opacity-50 cursor-not-allowed rounded-md"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sold</span>
                                    </div>
                                </div>

                                <div className="p-8 md:p-12 relative min-h-[400px] flex justify-center">
                                    {/* Screen Indicator */}
                                    <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center opacity-40 pointer-events-none">
                                        <div className="w-2/3 h-12 bg-gradient-to-t from-gray-200 to-transparent dark:from-gray-800 rounded-t-[50%] transform perspective-3d rotate-x-12"></div>
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-2">Screen This Way</span>
                                    </div>

                                    <div className="pb-16 w-full max-w-3xl z-10">
                                        <SeatMap
                                            totalSeats={100}
                                            occupiedSeats={event.occupied_seats || []}
                                            selectedSeats={selectedSeats}
                                            maxSelectable={10}
                                            onSeatSelect={handleSeatSelect}
                                            price={event.price}
                                            eventType={event.event_type}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Floating Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <Card className="border-0 shadow-2xl dark:shadow-indigo-900/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl ring-1 ring-gray-200 dark:ring-gray-800">
                                <CardContent className="p-6 space-y-6">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price per Ticket</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-gray-900 dark:text-white">₹{event.price}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        {selectedSeats.length > 0 ? (
                                            <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Selected ({selectedSeats.length})</span>
                                                    <span className="font-medium text-gray-900 dark:text-white text-right break-all max-w-[150px]">
                                                        {selectedSeats.join(', ')}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-xl font-bold pt-2 border-t border-gray-100 dark:border-gray-800">
                                                    <span>Total</span>
                                                    <span className="text-indigo-600">₹{totalPrice}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 text-gray-400 text-sm italic">
                                                Select seats to see total price
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        size="lg"
                                        className={cn(
                                            "w-full h-14 text-lg font-bold rounded-xl transition-all duration-300 transform",
                                            selectedSeats.length > 0
                                                ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
                                                : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                                        )}
                                        onClick={handleBook}
                                        disabled={selectedSeats.length === 0}
                                    >
                                        {selectedSeats.length === 0 ? 'Select Seats' : 'Proceed to Book'}
                                    </Button>

                                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                        <div className="flex -space-x-1">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 border border-white dark:border-black"></div>
                                            ))}
                                        </div>
                                        <span>100+ people booked recently</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
