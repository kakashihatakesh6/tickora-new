'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Clock, Armchair, Download, ArrowLeft, Share2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TicketPageProps { }

export default function TicketPage() {
    const params = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const ticketRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!params.id) return;
            try {
                const res = await api.get(`/bookings/${params.id}`);
                setBooking(res.data);
            } catch (error) {
                console.error('Failed to fetch booking', error);
                // Handle error (e.g., redirect or show message)
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [params.id]);

    const handleDownloadPDF = async () => {
        if (!ticketRef.current || !booking) return;
        setDownloading(true);

        try {
            const canvas = await html2canvas(ticketRef.current, {
                scale: 2, // Improve quality
                useCORS: true, // For images
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Ticket-${booking.event.title}-${booking.id}.pdf`);
        } catch (error) {
            console.error('Failed to generate PDF', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading ticket...</div>;
    if (!booking) return <div className="min-h-screen flex items-center justify-center">Ticket not found.</div>;

    const eventDate = new Date(booking.event.date_time);
    const dateStr = eventDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const uniqueCode = booking.ticket?.unique_code || `BM-${booking.id}`;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline" size="icon">
                            <Share2 className="w-4 h-4" />
                        </Button>
                        <Button onClick={handleDownloadPDF} disabled={downloading} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                            <Download className="w-4 h-4" />
                            {downloading ? 'Generating PDF...' : 'Download PDF'}
                        </Button>
                    </div>
                </div>

                {/* Ticket View Area (Captured for PDF) - Using inline styles for colors to avoid html2canvas issues with Tailwind v4 lab/oklch colors */}
                <div ref={ticketRef} style={{ backgroundColor: '#ffffff', color: '#000000', borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid #e5e7eb' }} className="shadow-2xl">
                    {/* Event Image Banner */}
                    <div className="h-64 relative">
                        {booking.event.image_url && (
                            <img
                                src={`/api/image-proxy?url=${encodeURIComponent(booking.event.image_url)}`}
                                alt={booking.event.title}
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                                style={{ display: 'block' }} // Ensure no weird spacing
                            />
                        )}
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #111827, rgba(17, 24, 39, 0.4), transparent)' }}></div>
                        <div className="absolute bottom-6 left-8 text-white">
                            <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)' }} className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                                Official Ticket
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2 drop-shadow-lg" style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{booking.event.title}</h1>
                            <p className="flex items-center font-medium text-lg" style={{ color: '#e5e7eb' }}>
                                <Calendar className="w-5 h-5 mr-2" /> {dateStr} • {timeStr}
                            </p>
                        </div>
                    </div>

                    {/* Ticket Content */}
                    <div className="p-8 md:p-10 relative" style={{ backgroundColor: '#ffffff' }}>
                        {/* Perforation Line - Visual only */}
                        <div className="absolute -top-3 left-0 w-full flex items-center justify-between z-10 px-2">
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {/* Left Info Column */}
                            <div className="md:col-span-2 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <p className="text-xs uppercase tracking-wider font-semibold flex items-center" style={{ color: '#6b7280' }}>
                                            <MapPin className="w-3 h-3 mr-1.5" /> Venue
                                        </p>
                                        <p className="text-lg font-bold leading-tight" style={{ color: '#111827' }}>
                                            {booking.event.venue}
                                        </p>
                                        <p className="text-sm" style={{ color: '#6b7280' }}>{booking.event.city}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs uppercase tracking-wider font-semibold flex items-center" style={{ color: '#6b7280' }}>
                                            <Armchair className="w-3 h-3 mr-1.5" /> Seats
                                        </p>
                                        <p className="text-lg font-bold break-words" style={{ color: '#4f46e5' }}>
                                            {booking.seat_numbers?.join(', ') || `${booking.seat_count} Seats`}
                                        </p>
                                        <p className="text-sm" style={{ color: '#6b7280' }}>{booking.seat_count} Ticket(s)</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-dashed" style={{ borderColor: '#e5e7eb' }}>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#6b7280' }}>Booking ID</p>
                                            <p className="font-mono font-medium" style={{ color: '#111827' }}>{booking.id}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#6b7280' }}>Total Paid</p>
                                            <p className="font-medium" style={{ color: '#111827' }}>₹{booking.total_amount}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl text-xs" style={{ backgroundColor: '#f9fafb', color: '#6b7280' }}>
                                    <p className="mb-2 font-bold uppercase tracking-wide">Important Information</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Please arrive at the venue 30 minutes before the show.</li>
                                        <li>Present this QR code at the entrance for scanning.</li>
                                        <li>Tickets once booked cannot be cancelled or refunded.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Right QR Column */}
                            <div className="flex flex-col items-center justify-center border-l md:border-l md:pl-10 pt-6 md:pt-0" style={{ borderColor: '#f3f4f6' }}>
                                <div className="p-4 rounded-2xl shadow-sm border mb-4" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
                                    <QRCodeCanvas
                                        value={JSON.stringify({
                                            id: booking.id,
                                            code: uniqueCode,
                                            event: booking.event.id
                                        })}
                                        size={180}
                                        level={"H"}
                                    />
                                </div>
                                <p className="text-xs text-center font-mono tracking-widest mb-1" style={{ color: '#9ca3af' }}>TICKET ID</p>
                                <p className="text-sm font-bold text-center font-mono tracking-wider" style={{ color: '#111827' }}>{uniqueCode}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500">
                    Need help? Contact support at <a href="#" className="text-indigo-600 hover:underline">support@ticketmaster.com</a>
                </p>
            </div>
        </main>
    );
}
