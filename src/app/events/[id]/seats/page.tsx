'use client';

import { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Info } from 'lucide-react';
import SeatMap from '@/components/SeatMap';
import { cn } from '@/lib/utils'; // Assuming cn utility exists

interface Event {
    id: number;
    title: string;
    event_type: string;
    city: string;
    venue: string;
    date_time: string;
    price: number;
    occupied_seats?: string[];
}

export default function SeatSelectionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const time = searchParams.get('time');
    const dateStr = searchParams.get('date');

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

    const handleProceed = () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }
        const seatsParam = selectedSeats.join(',');
        router.push(`/bookings/checkout?eventId=${id}&seats=${seatsParam}`);
    };

    if (loading) return <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">Loading...</div>;
    if (!event) return <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">Event not found</div>;

    const totalPrice = event.price * selectedSeats.length;
    const dateDisplay = dateStr ? new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }) : '';

    return (
        <div className="min-h-screen bg-white dark:bg-black flex flex-col">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-none">
                                {event.title}
                            </h1>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <span>{event.venue}</span>
                                {time && (
                                    <>
                                        <span>•</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {dateDisplay}, {time}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 hidden md:block border px-2 py-1 rounded">
                        {selectedSeats.length} Tickets
                    </div>
                </div>
            </header>

            {/* Seat Map Container */}
            <main className="flex-1 bg-gray-50 dark:bg-black relative overflow-hidden flex flex-col">
                {/* Visual Screen Indicator */}
                <div className="w-full h-16 bg-gradient-to-b from-indigo-500/10 to-transparent flex items-center justify-center relative">
                    <div className="w-3/4 h-1 bg-indigo-500/50 shadow-[0_0_20px_2px_rgba(99,102,241,0.5)] rounded-full"></div>
                    <span className="absolute top-2 text-[10px] uppercase tracking-[0.3em] text-gray-400">Screen</span>
                </div>

                <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center">
                    <div className="w-full max-w-4xl pb-32"> {/* Padding bottom for footer */}
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

                {/* Sticky Footer */}
                <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 sticky bottom-0 z-50 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex flex-col">
                            {selectedSeats.length > 0 ? (
                                <span className="text-xs text-gray-500 mb-0.5">Total Price</span>
                            ) : (
                                <span className="text-xs text-gray-500">Tickets starting at</span>
                            )}
                            <div className="font-bold text-xl text-gray-900 dark:text-white">
                                {selectedSeats.length > 0 ? `Rs. ${totalPrice}` : `Rs. ${event.price}`}
                            </div>
                        </div>

                        {selectedSeats.length > 0 ? (
                            <Button
                                size="lg"
                                className="px-10 h-12 text-lg font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-600/30"
                                onClick={handleProceed}
                            >
                                Pay Rs. {totalPrice}
                            </Button>
                        ) : (
                            <Button disabled variant="outline" className="px-10 h-12">Select Seats</Button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
