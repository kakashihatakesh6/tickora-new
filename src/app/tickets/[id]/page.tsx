'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Download, ChevronDown, XCircle, Phone } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Share2 } from 'lucide-react';

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
                scale: 2,
                useCORS: true,
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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading ticket...</div>;
    if (!booking) return <div className="min-h-screen flex items-center justify-center bg-gray-100">Ticket not found.</div>;

    const eventDate = new Date(booking.event.date_time);
    const dateStr = eventDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const language = booking.event.language || 'Hindi';
    const format = booking.event.format || '2D';
    const screen = booking.event.screen_number || 'AUDI 2';
    const ticketLevel = booking.event.ticket_level || 'CLASSIC';
    const uniqueCode = booking.ticket?.unique_code || `BM-${booking.id}`;

    return (
        <main className="min-h-screen bg-gray-100 py-8 px-4 flex flex-col items-center font-sans text-gray-900">

            {/* Header Actions */}
            <div className="w-full max-w-sm flex justify-between items-center mb-6">
                <Button variant="ghost" onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
                    &larr; Back
                </Button>
                <Button onClick={handleDownloadPDF} disabled={downloading} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm rounded-full px-4 h-8 text-xs">
                    <Download className="w-3 h-3" />
                    {downloading ? 'Saving...' : 'Download'}
                </Button>
            </div>

            {/* Ticket Card Container */}
            <div className="w-full max-w-sm">
                {/* Visual Capture Area */}
                <div ref={ticketRef} style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', position: 'relative', marginBottom: '24px' }}>

                    {/* Top Section: Movie Details */}
                    <div style={{ padding: '16px', display: 'flex', gap: '16px', position: 'relative' }}>
                        {/* Poster */}
                        <div style={{ width: '80px', height: '120px', flexShrink: 0 }}>
                            <img
                                src={`/api/image-proxy?url=${encodeURIComponent(booking.event.image_url)}`}
                                alt={booking.event.title}
                                crossOrigin="anonymous"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, fontFamily: 'sans-serif' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0', color: '#000', lineHeight: '1.2' }}>{booking.event.title}</h2>
                            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>{language}, {format}</p>
                            <p style={{ fontSize: '12px', color: '#333', margin: '0 0 2px 0' }}>{dateStr} | {timeStr}</p>
                            <p style={{ fontSize: '12px', color: '#666', margin: '0' }}>{booking.event.venue}</p>
                        </div>

                        {/* M-Ticket Vertical Label */}
                        <div style={{ position: 'absolute', right: '-8px', top: '30px', transform: 'rotate(-90deg)', transformOrigin: 'center', fontSize: '10px', color: '#e5e7eb', letterSpacing: '1px', fontWeight: 'bold' }}>
                            M-TICKET
                        </div>
                    </div>

                    {/* Divider with Cutouts */}
                    <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                        <div style={{ width: '24px', height: '24px', backgroundColor: '#f3f4f6', borderRadius: '50%', position: 'absolute', left: '-12px' }}></div>
                        <div style={{ width: '100%', borderTop: '2px dashed #e5e7eb', margin: '0 12px' }}></div>
                        <div style={{ width: '24px', height: '24px', backgroundColor: '#f3f4f6', borderRadius: '50%', position: 'absolute', right: '-12px' }}></div>
                    </div>

                    {/* Bottom Section: QR & Seat Info */}
                    <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* QR Code */}
                        <div style={{ width: '100px', height: '100px', flexShrink: 0 }}>
                            <QRCodeCanvas
                                value={JSON.stringify({ id: booking.id, code: uniqueCode })}
                                size={100}
                                level={"M"}
                            />
                        </div>

                        {/* Seat Details */}
                        <div style={{ flex: 1, paddingLeft: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
                            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>{booking.seat_count} Ticket(s)</p>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#000', textTransform: 'uppercase' }}>{screen}</h3>
                            <p style={{ fontSize: '13px', color: '#666', margin: '0 0 12px 0' }}>{ticketLevel} - <span style={{ fontWeight: 'bold', color: '#000' }}>{booking.seat_numbers?.join(', ')}</span></p>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#333' }}>
                                    BOOKING ID: {booking.id}
                                </div>
                                <p style={{ fontSize: '9px', color: '#999', marginTop: '2px' }}>Tap to see more</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Content */}
                <div className="mt-4 text-center px-2">
                    <p className="text-xs text-gray-500 mb-8 mx-auto leading-relaxed">
                        A confirmation is sent on e-mail/SMS/WhatsApp within 15 minutes of booking.
                    </p>

                    <div className="flex justify-around items-center mb-8 border-t border-gray-200 pt-6">
                        <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <XCircle className="w-5 h-5" />
                            <span className="text-[10px] font-medium uppercase tracking-wide">Cancel booking</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Phone className="w-5 h-5" />
                            <span className="text-[10px] font-medium uppercase tracking-wide">Contact support</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Total Amount Footer Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                <div className="max-w-sm mx-auto flex justify-between items-center cursor-pointer">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Amount</span>
                    <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-gray-900">Rs. {booking.total_amount}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Spacer */}
            <div className="h-16"></div>

        </main>
    );
}
