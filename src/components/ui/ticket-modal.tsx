'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { X, MapPin, Calendar, Clock, Armchair, Ticket as TicketIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface TicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: any;
}

export function TicketModal({ isOpen, onClose, booking }: TicketModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.overflow = 'auto'; // ensure cleanup
        };
    }, [isOpen]);

    if (!mounted || !isOpen || !booking) return null;

    const eventDate = new Date(booking.event.date_time);
    const dateStr = eventDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeStr = eventDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Create a unique code if one doesn't exist (fallback)
    const uniqueCode = booking.ticket?.unique_code || `BM-${booking.id}-${Date.now().toString().slice(-4)}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 ring-1 ring-white/10">

                {/* Close Button absolute */}
                <div className="absolute top-4 right-4 z-20">
                    <button
                        onClick={onClose}
                        className="bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition-colors backdrop-blur-md"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Header Pattern */}
                <div className="h-40 bg-indigo-600 relative overflow-hidden flex flex-col justify-end p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700"></div>
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>

                    <div className="relative z-10 text-white">
                        <div className="flex items-center gap-2 mb-2 opacity-90">
                            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider border border-white/10">
                                Official Ticket
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold leading-tight line-clamp-2 drop-shadow-sm">{booking.event.title}</h2>
                    </div>
                </div>

                {/* Ticket Body using CSS 'mask' for perforations if possible, but using pseudo-elements for now */}
                <div className="relative bg-white dark:bg-zinc-900">
                    {/* The jagged line separator */}
                    <div className="w-full h-4 relative -mt-2 z-10">
                        {/* Circle cutouts */}
                        <div className="absolute left-0 -top-2 w-4 h-8 bg-black/80 dark:bg-black/80 rounded-r-full"></div>
                        <div className="absolute right-0 -top-2 w-4 h-8 bg-black/80 dark:bg-black/80 rounded-l-full"></div>
                        {/* Dashed line */}
                        <div className="absolute top-2 left-4 right-4 border-t-2 border-dashed border-gray-300 dark:border-gray-600 opacity-50"></div>
                    </div>

                    <div className="px-6 py-6 space-y-6">
                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div className="space-y-1.5">
                                <div className="flex items-center text-gray-400 text-[11px] uppercase tracking-wider font-semibold">
                                    <Calendar className="w-3 h-3 mr-1.5" /> Date
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">{dateStr}</p>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center text-gray-400 text-[11px] uppercase tracking-wider font-semibold">
                                    <Clock className="w-3 h-3 mr-1.5" /> Time
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">{timeStr}</p>
                            </div>
                            <div className="col-span-2 space-y-1.5">
                                <div className="flex items-center text-gray-400 text-[11px] uppercase tracking-wider font-semibold">
                                    <MapPin className="w-3 h-3 mr-1.5" /> Venue
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{booking.event.venue}, {booking.event.city}</p>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center text-gray-400 text-[11px] uppercase tracking-wider font-semibold">
                                    <Armchair className="w-3 h-3 mr-1.5" /> Seats
                                </div>
                                <p className="text-base font-black text-indigo-600 dark:text-indigo-400">
                                    {booking.seat_numbers?.join(', ') || `${booking.seat_count} Seats`}
                                </p>
                            </div>
                            <div className="space-y-1.5 text-right">
                                <div className="text-gray-400 text-[11px] uppercase tracking-wider font-semibold inline-block">
                                    Price
                                </div>
                                <p className="text-base font-black text-gray-900 dark:text-gray-100">
                                    ₹{booking.total_amount}
                                </p>
                            </div>
                        </div>

                        {/* QR Code Section - Centered and prominent */}
                        <div className="flex flex-col items-center justify-center pt-2">
                            <div className="p-3 bg-white border-4 border-gray-100 dark:border-gray-800 rounded-2xl shadow-inner">
                                <QRCodeCanvas
                                    value={JSON.stringify({
                                        id: booking.id,
                                        code: uniqueCode,
                                        event: booking.event.id
                                    })}
                                    size={180}
                                    level={"M"}
                                    includeMargin={true}
                                />
                            </div>
                            <div className="mt-4 flex flex-col items-center space-y-1">
                                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.2em]">Ticket ID</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white font-mono tracking-widest">{uniqueCode}</p>
                            </div>
                        </div>

                        {/* Scan Instruction */}
                        <div className="text-center pb-2">
                            <p className="text-[10px] text-gray-400 bg-gray-50 dark:bg-white/5 py-1 px-3 rounded-full inline-block">
                                Present this QR code at the entrance
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Decorative Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            </div>
        </div>
    );
}
