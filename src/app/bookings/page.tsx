'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TicketModal } from '@/components/ui/ticket-modal';

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
        <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 bg-background min-h-screen">
            <h1 className="mb-10 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">My Bookings</h1>
            <div className="space-y-8">
                {bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm">
                        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/20 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">{booking.event.title}</CardTitle>
                                    <CardDescription className="mt-1 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                        <Calendar className="h-4 w-4" /> {new Date(booking.event.date_time).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </CardDescription>
                                </div>
                                <div className={`rounded-full px-4 py-1.5 text-xs font-bold tracking-wider uppercase shadow-sm ${booking.status === 'CONFIRMED' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                    }`}>
                                    {booking.status}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 font-medium">
                                        <MapPin className="mr-3 h-4 w-4 text-red-500" /> {booking.event.venue}, {booking.event.city}
                                    </div>
                                    <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                                        {booking.seat_count} Seats • <span className="text-red-600 dark:text-red-500">₹{booking.total_amount}</span>
                                    </div>
                                    {booking.seat_numbers && booking.seat_numbers.length > 0 && (
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg inline-block">
                                            Seats: <span className="font-bold text-indigo-600 dark:text-indigo-400">{booking.seat_numbers.join(', ')}</span>
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

            {/* Ticket Modal */}
            <TicketModal
                isOpen={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
                booking={selectedBooking}
            />
        </main>
    );
}
