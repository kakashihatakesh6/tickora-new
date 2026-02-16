'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Ticket as TicketIcon, User, Mail, Phone, Receipt } from 'lucide-react';
import { ApiResponse } from '@/lib/api';
import { Booking } from '@/types';
import PaymentProcessing from '@/components/PaymentProcessing';
import { AnimatePresence } from 'framer-motion';


// Razorpay Types
interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayOptions {
    key: string | undefined;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    theme: {
        color: string;
    };
}

// Global declaration for Razorpay
declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => { open: () => void };
    }
}

interface BookingEvent {
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

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const eventId = searchParams.get('eventId');
    const bookingType = searchParams.get('type') || 'EVENT'; // Default to EVENT for backward compatibility

    const seatsParam = searchParams.get('seats');

    const [event, setEvent] = useState<BookingEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        gst: ''
    });

    const selectedSeats = seatsParam ? seatsParam.split(',') : [];

    // Check if Razorpay SDK is loaded
    useEffect(() => {
        const checkRazorpay = () => {
            if (typeof window !== 'undefined' && window.Razorpay) {
                // setRazorpayLoaded(true);
                return true;
            }
            return false;
        };

        // Check immediately
        if (checkRazorpay()) return;

        // If not loaded, check periodically
        const interval = setInterval(() => {
            if (checkRazorpay()) {
                clearInterval(interval);
            }
        }, 100);

        // Cleanup after 10 seconds
        const timeout = setTimeout(() => {
            clearInterval(interval);
        }, 10000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    // Helper function to wait for Razorpay to load
    const waitForRazorpay = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (typeof window !== 'undefined' && window.Razorpay) {
                resolve(true);
                return;
            }

            let attempts = 0;
            const maxAttempts = 50; // 5 seconds max wait
            const interval = setInterval(() => {
                attempts++;
                if (typeof window !== 'undefined' && window.Razorpay) {
                    clearInterval(interval);
                    resolve(true);
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    resolve(false);
                }
            }, 100);
        });
    };

    useEffect(() => {
        if (!eventId) return;

        const fetchEvent = async () => {
            try {
                // Fetch from the appropriate endpoint based on booking type
                let endpoint = '/events';
                if (bookingType === 'MOVIE') {
                    endpoint = '/movie-shows';
                } else if (bookingType === 'SPORT') {
                    endpoint = '/sports';
                }

                const res = await api.get(`${endpoint}/${eventId}`) as ApiResponse<BookingEvent>;
                setEvent(res.data);

                // Try to prefill user details if available in local storage
                const storedEmail = localStorage.getItem('user_email');
                if (storedEmail) setFormData(prev => ({ ...prev, email: storedEmail }));
            } catch (error) {
                console.error('Failed to fetch event', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId, bookingType]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProceedToPay = async () => {
        // Validate
        if (!formData.name || !formData.email || !formData.phone) {
            alert("Please fill in all required fields (Name, Email, Phone).");
            return;
        }

        if (!event) return;

        // Check auth (redundant if middleware handles it, but good safety)
        if (!localStorage.getItem('token')) {
            // Ideally should redirect to login with return URL
            alert("Please log in to continue.");
            router.push('/login');
            return;
        }

        setBookingLoading(true);

        try {
            // Wait for Razorpay SDK to load
            const isRazorpayLoaded = await waitForRazorpay();
            if (!isRazorpayLoaded) {
                alert("Payment gateway is loading. Please wait a moment and try again.");
                setBookingLoading(false);
                return;
            }

            // 1. Create Booking with appropriate booking type
            const res = await api.post('/bookings', {
                event_id: Number(eventId),
                seat_numbers: selectedSeats,
                bookingType: bookingType, // Include the booking type (MOVIE, SPORT, or EVENT)
                price: pricePerSeat // Send the price per seat to handle variable pricing for sports
            }) as ApiResponse<{ booking: Booking, order_id: string }>;

            const { booking, order_id } = res.data;


            // 2. Open Razorpay
            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: booking.total_amount * 100, // Amount in paise
                currency: "INR",
                name: "Ticket Master",
                description: `Booking for ${event.title}`,
                order_id: order_id,
                // ... inside Razorpay handler ...
                handler: async function (response: RazorpayResponse) {
                    setIsVerifying(true); // Show full screen loader
                    try {
                        await api.post('/bookings/verify', {
                            booking_id: booking.id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        // Allow some time for the progress bar to complete visually
                        setTimeout(() => {
                            router.push('/bookings');
                        }, 2000);
                    } catch (verifyError: unknown) {
                        setIsVerifying(false); // Hide loader on error
                        const error = verifyError as { message?: string };
                        const message = error.message || 'Payment verification failed!';
                        alert(message);
                        console.error(verifyError);
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: "#4f46e5"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error: unknown) {
            console.error('Booking failed', error);
            let errorMessage = 'Booking failed. Please try again.';

            if (typeof error === 'object' && error !== null && 'response' in error) {
                const apiError = error as { response: { data: { error: string } } };
                if (apiError.response?.data?.error) {
                    errorMessage = apiError.response.data.error;
                }
            }
            alert(errorMessage);
        } finally {
            setBookingLoading(false);
        }
    };

    if (!eventId || (!loading && !event)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center max-w-md w-full">
                    <div className="mb-6 mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center">
                        <TicketIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Session Expired</h2>
                    <p className="mt-2 text-gray-500 mb-6">Your booking session has invalid data. Please select your seats again.</p>
                    <Button className="w-full h-12 text-lg" onClick={() => router.push('/')}>Return to Events</Button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-background">
                <div className="animate-bounce text-red-600 font-bold tracking-tight">Preparing your booking...</div>
            </div>
        );
    }

    let pricePerSeat = event!.price;

    // For Sports, use the price passed from the previous screen (selected stand price)
    // The backend should also validate this price during booking creation
    const priceParam = searchParams.get('price');
    if (bookingType === 'SPORT' && priceParam) {
        pricePerSeat = Number(priceParam);
    }
    const seatCount = selectedSeats.length;
    const subtotal = pricePerSeat * seatCount;
    // const convenienceFee = Math.ceil(subtotal * 0.02);
    // const tax = Math.ceil((subtotal + convenienceFee) * 0.18);
    const totalPrice = subtotal;

    return (
        <main className="min-h-screen bg-background pt-10 pb-20 px-4 sm:px-6 lg:px-8">
            <AnimatePresence>
                {isVerifying && <PaymentProcessing />}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Checkout</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Complete your details to secure your tickets.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* LEFT COLUMN: EVENT & ORDER SUMMARY (STICKY) */}
                    <div className="lg:col-span-4 order-2 lg:order-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Ticket Card Design */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative">
                                {/* Ticket Design Top */}
                                <div className="relative h-48">
                                    <Image
                                        src={event!.image_url}
                                        alt={event!.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                        <h3 className="text-xl font-bold leading-tight mb-1">{event!.title}</h3>
                                        <p className="text-sm opacity-90 flex items-center">
                                            <Calendar className="w-3 h-3 mr-1.5" />
                                            {new Date(event!.date_time).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Perforation Lines */}
                                <div className="relative h-6 bg-white dark:bg-slate-900">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-r-full"></div>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-l-full"></div>
                                    <div className="border-b-2 border-dashed border-slate-200 dark:border-slate-800 w-full h-full transform translate-y-1/2 opacity-50"></div>
                                </div>

                                {/* Order Details */}
                                <div className="p-6 pt-2 space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Venue</p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{event!.venue}</p>
                                                <p className="text-xs text-gray-500">{event!.city}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                                <TicketIcon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Selected Seats</p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white break-all">
                                                    {selectedSeats.join(', ')}
                                                </p>
                                                <p className="text-xs text-gray-500">{seatCount} Ticket{seatCount > 1 ? 's' : ''}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600 dark:text-slate-400 font-medium">Subtotal</span>
                                            <span className="font-bold text-slate-900 dark:text-slate-100">₹{subtotal}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xl font-black text-slate-900 dark:text-white pt-2">
                                            <span>Total</span>
                                            <span className="text-red-600 dark:text-red-500">₹{totalPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                    100% Secure Payment with Razorpay
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: USER DETAILS FORM */}
                    <div className="lg:col-span-8 order-1 lg:order-2">
                        <Card className="border-0 shadow-lg bg-white dark:bg-gray-900 overflow-hidden">
                            <div className="p-6 md:p-8 space-y-8">
                                <div className="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Contact Information</h3>
                                        <p className="text-sm text-gray-500">We&apos;ll send your tickets here.</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Full Name <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative group">
                                                <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    placeholder="e.g. John Doe"
                                                    className="pl-10 h-12 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-200 rounded-xl transition-all"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Email Address <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="e.g. john@example.com"
                                                    className="pl-10 h-12 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-200 rounded-xl transition-all"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Phone Number <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative group">
                                                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="+91 98765 43210"
                                                    className="pl-10 h-12 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-200 rounded-xl transition-all"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="gst" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                GST Number (Optional)
                                            </Label>
                                            <div className="relative group">
                                                <Receipt className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <Input
                                                    id="gst"
                                                    name="gst"
                                                    placeholder="Optional"
                                                    className="pl-10 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-red-500 focus:ring-red-200 rounded-xl transition-all font-medium"
                                                    value={formData.gst}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                                    <Button
                                        size="lg"
                                        className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 rounded-xl transition-all transform active:scale-[0.98]"
                                        onClick={handleProceedToPay}
                                        disabled={bookingLoading}
                                    >
                                        {bookingLoading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Processing Secure Payment...
                                            </span>
                                        ) : (
                                            `Make Payment ₹${totalPrice}`
                                        )}
                                    </Button>
                                    <p className="mt-4 text-center text-xs text-gray-500">
                                        By proceeding, you agree to our Terms of Service and Privacy Policy.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
