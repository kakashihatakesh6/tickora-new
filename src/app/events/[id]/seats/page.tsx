'use client';

import { useEffect, useState, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api, { ApiResponse } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import SeatMap from '@/components/SeatMap';
import { SeatLayoutSkeleton } from '@/components/skeletons';

interface Event {
    id: number;
    title: string;
    event_type: string;
    city: string;
    venue: string;
    date_time: string;
    price: number;
    occupied_seats?: string[];
    category?: string;
}

function SeatSelectionContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const time = searchParams.get('time');
    const dateStr = searchParams.get('date');

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    // State now stores objects to track price and tier
    const [selectedSeats, setSelectedSeats] = useState<{ id: string; price: number; tier: string }[]>([]);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`) as ApiResponse<Event>;
                setEvent(res.data);

            } catch (error) {
                console.error('Failed to fetch event', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleSeatSelect = (seatId: string, price: number, tier: string) => {
        setSelectedSeats(prev => {
            const exists = prev.find(s => s.id === seatId);
            if (exists) {
                return prev.filter(s => s.id !== seatId);
            }
            if (prev.length >= 10) {
                alert("You can only select up to 10 seats.");
                return prev;
            }
            return [...prev, { id: seatId, price, tier }];
        });
    };

    const handleProceed = () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }
        // Pass seat IDs to checkout
        const seatsParam = selectedSeats.map(s => s.id).join(',');
        router.push(`/bookings/checkout?eventId=${id}&seats=${seatsParam}`);
    };

    if (loading) return <SeatLayoutSkeleton />;
    if (!event) return <div className="min-h-screen bg-background flex items-center justify-center">Event not found</div>;

    const totalPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0);
    const dateDisplay = dateStr ? new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }) : '';

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
                                <span>{event.title}</span>
                                {time && (
                                    <>
                                        <span>•</span>
                                        <span className="font-medium">
                                            {dateDisplay}, {time}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* More options kebab menu could go here */}
                </div>
            </header>

            {/* Seat Map Container */}
            <main className="flex-1 bg-background relative overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center">
                    <div className="w-full max-w-4xl pb-32 pt-8">
                        <SeatMap
                            occupiedSeats={event.occupied_seats || []}
                            selectedSeats={selectedSeats.map(s => s.id)}
                            maxSelectable={10}
                            onSeatSelect={handleSeatSelect}
                            basePrice={event.price}
                            category={event.category}
                        />
                    </div>
                </div>


                {/* Bottom Action Footer */}
                <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-4 sticky bottom-0 z-50 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex flex-col">
                            {selectedSeats.length > 0 ? (
                                <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2">
                                    {/* Show the last selected seat details explicitly as per reference */}
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase mb-0.5">
                                        SEAT {selectedSeats.length}
                                    </span>
                                    <div className="text-2xl font-black text-gray-900 dark:text-white flex items-baseline gap-1">
                                        {/* Split the ID of the last seat, e.g. H11 -> H 11 */}
                                        <span>{selectedSeats[selectedSeats.length - 1].id.replace(/([A-Z])(\d+)/, '$1 $2')}</span>
                                        {selectedSeats.length > 1 && <span className="text-sm font-normal text-gray-400 ml-1">(+{selectedSeats.length - 1} more)</span>}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 mb-0.5">Tickets starting at</span>
                                    <div className="font-bold text-xl text-gray-900 dark:text-white">
                                        Rs. {event.price}
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
                                    <span>Pay Rs. {totalPrice}</span>
                                    {/* <span className="text-[10px] font-normal opacity-80">Proceed to Pay</span> */}
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

export default function SeatSelectionPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<SeatLayoutSkeleton />}>
            <SeatSelectionContent params={params} />
        </Suspense>
    );
}
