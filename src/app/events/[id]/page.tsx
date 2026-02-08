'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';
import SeatMap from '@/components/SeatMap';

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
    const [bookingLoading, setBookingLoading] = useState(false);

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

    const handleBook = async () => {
        // Check auth
        if (!localStorage.getItem('token')) {
            router.push('/login');
            return;
        }

        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }

        setBookingLoading(true);
        try {
            // 1. Create Booking with specific seats
            const res = await api.post('/bookings', {
                event_id: Number(id),
                seat_numbers: selectedSeats // Send array of seat IDs
            });

            const { booking, order_id } = res.data;

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: booking.total_amount * 100,
                currency: "INR",
                name: "Ticket Master",
                description: `Booking for ${event?.title}`,
                order_id: order_id,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        await api.post('/bookings/verify', {
                            booking_id: booking.id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        // Success
                        router.push('/bookings');
                    } catch (verifyError) {
                        alert('Payment verification failed!');
                        console.error(verifyError);
                    }
                },
                prefill: {
                    name: "User Name",
                    email: "user@example.com",
                },
                theme: {
                    color: "#4f46e5"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();

        } catch (error: any) {
            console.error('Booking failed', error);
            alert(error.response?.data?.error || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading...</div>;
    if (!event) return <div className="p-12 text-center text-gray-500">Event not found</div>;

    const totalPrice = event.price * selectedSeats.length;

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Event Details */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="relative aspect-[3/4] w-full rounded-2xl bg-gray-200 overflow-hidden shadow-xl">
                        {event.image_url ? (
                            <Image
                                src={event.image_url}
                                alt={event.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 33vw"
                                priority
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-500">No Image</div>
                        )}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                                {event.event_type}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">{event.title}</h1>
                        <p className="mt-4 text-base text-gray-500 dark:text-gray-400 leading-relaxed">{event.description}</p>
                    </div>

                    <Card className="border-0 shadow-none bg-gray-50 dark:bg-gray-900/50">
                        <CardContent className="space-y-4 p-4">
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <Calendar className="mr-3 h-5 w-5 text-indigo-500" />
                                <span className="font-medium">{new Date(event.date_time).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <MapPin className="mr-3 h-5 w-5 text-indigo-500" />
                                <span className="font-medium">{event.venue}, {event.city}</span>
                            </div>
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <TicketIcon className="mr-3 h-5 w-5 text-indigo-500" />
                                <span className="font-medium">Price: <span className="text-indigo-600 font-bold">₹{event.price}</span> / seat</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Seat Selection */}
                <div className="lg:col-span-2">
                    <Card className="h-full border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
                        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                            <h2 className="font-bold text-lg">Select Seats</h2>
                            <span className="text-sm bg-indigo-500/50 px-3 py-1 rounded-full">
                                {selectedSeats.length > 0 ? `${selectedSeats.length} Selected` : 'Tap to select'}
                            </span>
                        </div>

                        <div className="p-6 flex-grow bg-gray-50/50 dark:bg-black/20 flex flex-col items-center justify-center">
                            <SeatMap
                                totalSeats={100} // Hardcoded for simplified grid demo, ideally event.total_seats
                                occupiedSeats={event.occupied_seats || []}
                                selectedSeats={selectedSeats}
                                maxSelectable={10}
                                onSeatSelect={handleSeatSelect}
                                price={event.price}
                                eventType={event.event_type}
                            />
                        </div>

                        {/* Bottom Bar: Action */}
                        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Price</p>
                                    <p className="text-3xl font-bold text-indigo-600">₹{totalPrice}</p>
                                    {selectedSeats.length > 0 && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Seats: {selectedSeats.join(', ')}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto px-12 h-12 text-lg shadow-indigo-200 dark:shadow-none shadow-lg"
                                    onClick={handleBook}
                                    disabled={bookingLoading || selectedSeats.length === 0}
                                >
                                    {bookingLoading ? 'Processing...' : `Pay ₹${totalPrice}`}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            {/* Load Razorpay Script (keep as backup if layout load fails) */}
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </main>
    );
}
