'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { XCircle, Download, ChevronDown, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';
import { Booking } from '@/types';

interface TicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking | null;

}

export function TicketModal({ isOpen, onClose, booking }: TicketModalProps) {
    const [mounted, setMounted] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const ticketRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleDownloadPDF = async () => {
        if (!ticketRef.current || !booking) return;
        setDownloading(true);

        try {
            // Wait for images to load if needed, but usually they are loaded by now or useCORS handles it
            const canvas = await html2canvas(ticketRef.current, {
                scale: 3, // Higher scale for better quality
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false
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

    if (!mounted) return null;

    const eventDate = booking ? new Date(booking.event.date_time) : new Date();
    const dateStr = eventDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    // Fallbacks
    const language = booking?.event?.language || 'Hindi';
    const format = booking?.event?.format || '2D';
    const screen = booking?.event?.screen_number || 'AUDI 2';
    const ticketLevel = booking?.event?.ticket_level || 'CLASSIC';

    // Generate alphanumeric Booking ID
    // If backend doesn't provide a string ID, we mock it consistently based on ID
    const alphanumericId = booking?.ticket?.unique_code || `WPSC${(booking?.id || 0).toString().padStart(2, '0')}Q`;

    return (
        <AnimatePresence>
            {isOpen && booking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal Content - Centered Card */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="relative w-full max-w-xs sm:max-w-sm md:max-w-md max-h-[85vh] h-auto bg-gray-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header with Close */}
                        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800">Booking Summary</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-4 pb-24">

                            {/* Ticket Wrapper for Capture */}
                            <div className="flex justify-center mb-6">
                                <div ref={ticketRef} style={{ width: '100%', maxWidth: '340px', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', position: 'relative' }}>

                                    {/* Top Section: Movie Details */}
                                    <div style={{ padding: '16px', display: 'flex', gap: '16px', position: 'relative' }}>
                                        {/* Poster */}
                                        <div style={{ width: '80px', height: '110px', flexShrink: 0, position: 'relative' }}>
                                            <Image
                                                src={`/api/image-proxy?url=${encodeURIComponent(booking.event.image_url)}`}
                                                alt={booking.event.title}
                                                fill
                                                className="object-cover rounded-lg"
                                                unoptimized
                                            />
                                        </div>


                                        {/* Info */}
                                        <div style={{ flex: 1, fontFamily: 'sans-serif' }}>
                                            <h2 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 4px 0', color: '#000', lineHeight: '1.2' }}>{booking.event.title}</h2>
                                            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 6px 0' }}>{language}, {format}</p>
                                            <p style={{ fontSize: '11px', color: '#333', margin: '0 0 2px 0' }}>{dateStr} | {timeStr}</p>
                                            <p style={{ fontSize: '11px', color: '#666', margin: '0' }}>{booking.event.venue}</p>
                                        </div>
                                    </div>

                                    {/* Divider with Cutouts */}
                                    <div style={{ position: 'relative', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                                        <div style={{ width: '20px', height: '20px', backgroundColor: '#f3f4f6', borderRadius: '50%', position: 'absolute', left: '-10px' }}></div>
                                        <div style={{ width: '100%', borderTop: '1px dashed #e5e7eb', margin: '0 10px' }}></div>
                                        <div style={{ width: '20px', height: '20px', backgroundColor: '#f3f4f6', borderRadius: '50%', position: 'absolute', right: '-10px' }}></div>
                                    </div>

                                    {/* Bottom Section: QR & Seat Info */}
                                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                                        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                                            <p style={{ fontSize: '12px', color: '#666' }}>{booking.seat_count} Ticket(s)</p>
                                            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#000' }}>{screen}</p>
                                            <p style={{ fontSize: '14px', color: '#333' }}>{ticketLevel} - <span style={{ fontWeight: 'bold' }}>{booking.seat_numbers?.join(', ')}</span></p>
                                        </div>

                                        <div style={{ width: '120px', height: '120px', padding: '10px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #eee' }}>
                                            <QRCodeCanvas
                                                value={JSON.stringify({ id: booking.id, code: alphanumericId })}
                                                size={100}
                                                level={"M"}
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </div>

                                        <div style={{ marginTop: '12px', textAlign: 'center' }}>
                                            <p style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Booking ID</p>
                                            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#000', letterSpacing: '2px' }}>{alphanumericId}</p>
                                        </div>

                                    </div>

                                    {/* M-Ticket Label Vertical */}
                                    <div style={{ position: 'absolute', right: '-6px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontSize: '9px', fontWeight: 'bold', color: '#e5e7eb', letterSpacing: '2px', pointerEvents: 'none' }}>
                                        M-TICKET
                                    </div>
                                </div>
                            </div>

                            {/* Info Text */}
                            <p className="text-xs text-center text-gray-500 mb-6 px-8 leading-non">
                                A confirmation is sent on e-mail/SMS/WhatsApp within 15 minutes of booking.
                            </p>

                            {/* Actions Grid */}
                            <div className="grid grid-cols-2 gap-4 px-4 mb-6">
                                <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-white/50 transition-colors">
                                    <div className="p-2 bg-white rounded-full shadow-sm text-gray-600">
                                        <XCircle className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600">Cancel booking</span>
                                </button>
                                <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-white/50 transition-colors">
                                    <div className="p-2 bg-white rounded-full shadow-sm text-gray-600">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600">Contact support</span>
                                </button>
                            </div>

                            {/* Download Button (Secondary, since users might want to keep the PDF) */}
                            <div className="flex justify-center mb-6">
                                <Button
                                    variant="outline"
                                    onClick={handleDownloadPDF}
                                    disabled={downloading}
                                    className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                >
                                    <Download className="w-4 h-4" />
                                    {downloading ? 'Saving...' : 'Download Ticket PDF'}
                                </Button>
                            </div>

                        </div>

                        {/* Total Amount Footer */}
                        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg z-20">
                            <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors">
                                <span className="text-xs font-semibold text-gray-500">Total Amount</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900">Rs. {booking.total_amount.toFixed(2)}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
