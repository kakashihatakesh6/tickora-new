'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Ticket {
    id: number;
    unique_code: string;
    details: string; // JSON string
}

interface Booking {
    id: number;
    event: {
        title: string;
        venue: string;
        city: string;
        date_time: string;
    };
    seat_count: number;
    seat_numbers?: string[];
    total_amount: number;
    status: string;
    ticket?: Ticket;
}

import { TicketModal } from '@/components/ui/ticket-modal';

export default function BookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            // Check auth
            if (!localStorage.getItem('token')) {
                router.push('/login');
                return;
            }

            try {
                // Need to add this endpoint on backend or filter on client if generic GET /bookings returns user specific
                // Assuming POST /bookings/my or GET /bookings returns user's bookings. 
                // Let's assume GET /bookings returns user bookings for now? 
                // Wait, I didn't implement GET /bookings for user in backend yet!
                // I only added handlers.CreateBooking and handlers.VerifyPayment.
                // I need to implement handlers.GetUserBookings

                // For now, I'll write the frontend assuming the endpoint exists: GET /bookings/my
                const res = await api.get('/bookings/my');
                setBookings(res.data || []);
            } catch (error) {
                console.error('Failed to fetch bookings', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [router]);

    if (loading) return <div className="p-12 text-center">Loading your bookings...</div>;

    return (
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-3xl font-bold">My Bookings</h1>
            <div className="space-y-6">
                {bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>{booking.event.title}</CardTitle>
                                    <CardDescription className="mt-1 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> {new Date(booking.event.date_time).toLocaleString()}
                                    </CardDescription>
                                </div>
                                <div className={`rounded-full px-3 py-1 text-xs font-bold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {booking.status}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin className="mr-2 h-4 w-4" /> {booking.event.venue}, {booking.event.city}
                                    </div>
                                    <div className="text-sm font-medium">
                                        {booking.seat_count} Seats • ₹{booking.total_amount}
                                    </div>
                                    {booking.seat_numbers && booking.seat_numbers.length > 0 && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            Seats: <span className="font-semibold text-indigo-600">{booking.seat_numbers.join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col items-end justify-center">
                                    {booking.status === 'CONFIRMED' && (
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2"
                                            onClick={() => setSelectedBooking(booking)}
                                        >
                                            <QrCode className="h-4 w-4" /> View Ticket
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {bookings.length === 0 && (
                    <div className="text-center text-gray-500 py-12">No bookings found.</div>
                )}
            </div>

            <TicketModal
                isOpen={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
                booking={selectedBooking}
            />
        </main>
    );
}
