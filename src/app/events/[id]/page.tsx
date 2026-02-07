'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
}

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [seats, setSeats] = useState(1);
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

    const handleBook = async () => {
        // Check auth
        if (!localStorage.getItem('token')) {
            router.push('/login');
            return;
        }

        setBookingLoading(true);
        try {
            // 1. Create Booking
            const res = await api.post('/bookings', {
                event_id: Number(id),
                seat_count: Number(seats)
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
                    name: "User Name", // TODO: Get from context
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

    if (loading) return <div className="p-12 text-center">Loading...</div>;
    if (!event) return <div className="p-12 text-center">Event not found</div>;

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="aspect-square w-full rounded-2xl bg-gray-200 object-cover">
                    {event.image_url ? <img src={event.image_url} alt={event.title} className="h-full w-full object-cover rounded-2xl" /> : <div className="flex h-full items-center justify-center text-gray-500">No Image</div>}
                </div>
                <div className="flex flex-col justify-center space-y-6">
                    <div>
                        <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">{event.event_type}</span>
                        <h1 className="mt-2 text-4xl font-extrabold text-gray-900">{event.title}</h1>
                        <p className="mt-4 text-lg text-gray-500">{event.description}</p>
                    </div>

                    <Card>
                        <CardContent className="space-y-4 p-6">
                            <div className="flex items-center text-gray-700">
                                <Calendar className="mr-3 h-5 w-5 text-indigo-600" />
                                <span className="font-medium">{new Date(event.date_time).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <MapPin className="mr-3 h-5 w-5 text-indigo-600" />
                                <span className="font-medium">{event.venue}, {event.city}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <TicketIcon className="mr-3 h-5 w-5 text-indigo-600" />
                                <span className="font-medium">Available Seats: {event.available_seats}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-900">Price per ticket</span>
                            <span className="text-2xl font-bold text-indigo-600">₹{event.price}</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium">Quantity:</span>
                                <Input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={seats}
                                    onChange={(e) => setSeats(Number(e.target.value))}
                                    className="w-24"
                                />
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="font-bold text-indigo-600">₹{event.price * seats}</span>
                            </div>
                            <Button size="lg" className="w-full" onClick={handleBook} isLoading={bookingLoading} disabled={event.available_seats < seats}>
                                {event.available_seats === 0 ? 'Sold Out' : 'Proceed to Book'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Load Razorpay Script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </main>
    );
}
