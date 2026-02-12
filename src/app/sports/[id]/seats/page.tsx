'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Search, ZoomIn, ZoomOut, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Define seat categories and prices
const SEAT_CATEGORIES = [
    { id: 'pink', price: 400, color: 'bg-pink-500', label: '₹400' },
    { id: 'blue', price: 750, color: 'bg-blue-500', label: '₹750' },
    { id: 'gold', price: 1000, color: 'bg-yellow-500', label: '₹1000' },
    { id: 'platinum', price: 2000, color: 'bg-purple-600', label: '₹2000' },
];

// Helper functions for SVG paths
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

const describeSector = (x: number, y: number, rInner: number, rOuter: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, rOuter, endAngle);
    const end = polarToCartesian(x, y, rOuter, startAngle);
    const startInner = polarToCartesian(x, y, rInner, endAngle);
    const endInner = polarToCartesian(x, y, rInner, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M", start.x, start.y,
        "A", rOuter, rOuter, 0, largeArcFlag, 0, end.x, end.y,
        "L", endInner.x, endInner.y,
        "A", rInner, rInner, 0, largeArcFlag, 1, startInner.x, startInner.y,
        "Z"
    ].join(" ");
};

// Define the stadium layout with granular blocks
const STADIUM_BLOCKS = [
    // ========== INNER LAYER (Lower Tier) ==========
    // North Stand (Top/North) - centered around 0
    { id: 'NS-A', name: 'Block A', price: 400, category: 'pink', startAngle: 330, endAngle: 345, rInner: 220, rOuter: 300, stand: 'North Stand', layer: 'lower', seats: 50 },
    { id: 'NS-B', name: 'Block B', price: 400, category: 'pink', startAngle: 345, endAngle: 360, rInner: 220, rOuter: 300, stand: 'North Stand', layer: 'lower', seats: 50 },
    { id: 'NS-C', name: 'Block C', price: 400, category: 'pink', startAngle: 0, endAngle: 15, rInner: 220, rOuter: 300, stand: 'North Stand', layer: 'lower', seats: 50 },
    { id: 'NS-D', name: 'Block D', price: 400, category: 'pink', startAngle: 15, endAngle: 30, rInner: 220, rOuter: 300, stand: 'North Stand', layer: 'lower', seats: 50 },

    // Sunil Gavaskar Pavilion (East)
    { id: 'SG-E', name: 'Block E', price: 1000, category: 'gold', startAngle: 35, endAngle: 55, rInner: 220, rOuter: 290, stand: 'Sunil Gavaskar Pavilion', layer: 'lower', seats: 50 },
    { id: 'SG-F', name: 'Block F', price: 1000, category: 'gold', startAngle: 55, endAngle: 75, rInner: 220, rOuter: 290, stand: 'Sunil Gavaskar Pavilion', layer: 'lower', seats: 50 },
    { id: 'SG-G', name: 'Block G', price: 1000, category: 'gold', startAngle: 75, endAngle: 95, rInner: 220, rOuter: 290, stand: 'Sunil Gavaskar Pavilion', layer: 'lower', seats: 50 },

    // Vijay Merchant Pavilion (South East)
    { id: 'VM-H', name: 'Block H', price: 750, category: 'blue', startAngle: 100, endAngle: 115, rInner: 220, rOuter: 280, stand: 'Vijay Merchant Pavilion', layer: 'lower', seats: 50 },
    { id: 'VM-I', name: 'Block I', price: 750, category: 'blue', startAngle: 115, endAngle: 130, rInner: 220, rOuter: 280, stand: 'Vijay Merchant Pavilion', layer: 'lower', seats: 50 },

    // MCA Pavilion (South)
    { id: 'MCA-J', name: 'Block J', price: 750, category: 'blue', startAngle: 135, endAngle: 165, rInner: 220, rOuter: 280, stand: 'MCA Pavilion', layer: 'lower', seats: 50 },
    { id: 'MCA-K', name: 'Block K', price: 750, category: 'blue', startAngle: 165, endAngle: 195, rInner: 220, rOuter: 280, stand: 'MCA Pavilion', layer: 'lower', seats: 50 },

    // Divecha Pavilion (South West)
    { id: 'DP-L', name: 'Block L', price: 500, category: 'blue', startAngle: 200, endAngle: 220, rInner: 220, rOuter: 280, stand: 'Divecha Pavilion', layer: 'lower', seats: 50 },

    // Sachin Tendulkar Pavilion (West)
    { id: 'ST-M', name: 'Block M', price: 2000, category: 'platinum', startAngle: 225, endAngle: 245, rInner: 220, rOuter: 290, stand: 'Sachin Tendulkar Pavilion', layer: 'lower', seats: 50 },
    { id: 'ST-N', name: 'Block N', price: 2000, category: 'platinum', startAngle: 245, endAngle: 265, rInner: 220, rOuter: 290, stand: 'Sachin Tendulkar Pavilion', layer: 'lower', seats: 50 },
    { id: 'ST-O', name: 'Block O', price: 2000, category: 'platinum', startAngle: 265, endAngle: 285, rInner: 220, rOuter: 290, stand: 'Sachin Tendulkar Pavilion', layer: 'lower', seats: 50 },

    // Garware Pavilion (North West)
    { id: 'GP-P', name: 'Block P', price: 1000, category: 'gold', startAngle: 290, endAngle: 305, rInner: 220, rOuter: 290, stand: 'Garware Pavilion', layer: 'lower', seats: 50 },
    { id: 'GP-Q', name: 'Block Q', price: 1000, category: 'gold', startAngle: 305, endAngle: 320, rInner: 220, rOuter: 290, stand: 'Garware Pavilion', layer: 'lower', seats: 50 },

    // ========== OUTER LAYER (Upper Tier) ==========
    // North Stand Upper
    { id: 'NSU-R', name: 'Block R', price: 300, category: 'pink', startAngle: 330, endAngle: 345, rInner: 310, rOuter: 380, stand: 'North Stand Upper', layer: 'upper', seats: 35 },
    { id: 'NSU-S', name: 'Block S', price: 300, category: 'pink', startAngle: 345, endAngle: 360, rInner: 310, rOuter: 380, stand: 'North Stand Upper', layer: 'upper', seats: 35 },
    { id: 'NSU-T', name: 'Block T', price: 300, category: 'pink', startAngle: 0, endAngle: 15, rInner: 310, rOuter: 380, stand: 'North Stand Upper', layer: 'upper', seats: 35 },
    { id: 'NSU-U', name: 'Block U', price: 300, category: 'pink', startAngle: 15, endAngle: 30, rInner: 310, rOuter: 380, stand: 'North Stand Upper', layer: 'upper', seats: 35 },

    // Sunil Gavaskar Pavilion Upper
    { id: 'SGU-V', name: 'Block V', price: 800, category: 'gold', startAngle: 35, endAngle: 55, rInner: 300, rOuter: 360, stand: 'Sunil Gavaskar Pavilion Upper', layer: 'upper', seats: 35 },
    { id: 'SGU-W', name: 'Block W', price: 800, category: 'gold', startAngle: 55, endAngle: 75, rInner: 300, rOuter: 360, stand: 'Sunil Gavaskar Pavilion Upper', layer: 'upper', seats: 35 },
    { id: 'SGU-X', name: 'Block X', price: 800, category: 'gold', startAngle: 75, endAngle: 95, rInner: 300, rOuter: 360, stand: 'Sunil Gavaskar Pavilion Upper', layer: 'upper', seats: 35 },

    // Vijay Merchant Pavilion Upper
    { id: 'VMU-Y', name: 'Block Y', price: 600, category: 'blue', startAngle: 100, endAngle: 115, rInner: 290, rOuter: 350, stand: 'Vijay Merchant Pavilion Upper', layer: 'upper', seats: 35 },
    { id: 'VMU-Z', name: 'Block Z', price: 600, category: 'blue', startAngle: 115, endAngle: 130, rInner: 290, rOuter: 350, stand: 'Vijay Merchant Pavilion Upper', layer: 'upper', seats: 35 },

    // MCA Pavilion Upper
    { id: 'MCAU-AA', name: 'Block AA', price: 600, category: 'blue', startAngle: 135, endAngle: 165, rInner: 290, rOuter: 350, stand: 'MCA Pavilion Upper', layer: 'upper', seats: 35 },
    { id: 'MCAU-AB', name: 'Block AB', price: 600, category: 'blue', startAngle: 165, endAngle: 195, rInner: 290, rOuter: 350, stand: 'MCA Pavilion Upper', layer: 'upper', seats: 35 },

    // Divecha Pavilion Upper
    { id: 'DPU-AC', name: 'Block AC', price: 400, category: 'pink', startAngle: 200, endAngle: 220, rInner: 290, rOuter: 350, stand: 'Divecha Pavilion Upper', layer: 'upper', seats: 35 },

    // Sachin Tendulkar Pavilion Upper
    { id: 'STU-AD', name: 'Block AD', price: 1500, category: 'platinum', startAngle: 225, endAngle: 245, rInner: 300, rOuter: 360, stand: 'Sachin Tendulkar Pavilion Upper', layer: 'upper', seats: 35 },
    { id: 'STU-AE', name: 'Block AE', price: 1500, category: 'platinum', startAngle: 245, endAngle: 265, rInner: 300, rOuter: 360, stand: 'Sachin Tendulkar Pavilion Upper', layer: 'upper', seats: 35 },
    { id: 'STU-AF', name: 'Block AF', price: 1500, category: 'platinum', startAngle: 265, endAngle: 285, rInner: 300, rOuter: 360, stand: 'Sachin Tendulkar Pavilion Upper', layer: 'upper', seats: 35 },

    // Garware Pavilion Upper
    { id: 'GPU-AG', name: 'Block AG', price: 800, category: 'gold', startAngle: 290, endAngle: 305, rInner: 300, rOuter: 360, stand: 'Garware Pavilion Upper', layer: 'upper', seats: 35 },
    { id: 'GPU-AH', name: 'Block AH', price: 800, category: 'gold', startAngle: 305, endAngle: 320, rInner: 300, rOuter: 360, stand: 'Garware Pavilion Upper', layer: 'upper', seats: 35 },

    // ========== TOP LAYER (Third Tier) ==========
    // North Stand Top
    { id: 'NST-AI', name: 'Block AI', price: 250, category: 'pink', startAngle: 330, endAngle: 345, rInner: 390, rOuter: 440, stand: 'North Stand Top', layer: 'top', seats: 25 },
    { id: 'NST-AJ', name: 'Block AJ', price: 250, category: 'pink', startAngle: 345, endAngle: 360, rInner: 390, rOuter: 440, stand: 'North Stand Top', layer: 'top', seats: 25 },
    { id: 'NST-AK', name: 'Block AK', price: 250, category: 'pink', startAngle: 0, endAngle: 15, rInner: 390, rOuter: 440, stand: 'North Stand Top', layer: 'top', seats: 25 },
    { id: 'NST-AL', name: 'Block AL', price: 250, category: 'pink', startAngle: 15, endAngle: 30, rInner: 390, rOuter: 440, stand: 'North Stand Top', layer: 'top', seats: 25 },

    // Sunil Gavaskar Pavilion Top
    { id: 'SGT-AM', name: 'Block AM', price: 650, category: 'blue', startAngle: 35, endAngle: 55, rInner: 370, rOuter: 420, stand: 'Sunil Gavaskar Pavilion Top', layer: 'top', seats: 25 },
    { id: 'SGT-AN', name: 'Block AN', price: 650, category: 'blue', startAngle: 55, endAngle: 75, rInner: 370, rOuter: 420, stand: 'Sunil Gavaskar Pavilion Top', layer: 'top', seats: 25 },
    { id: 'SGT-AO', name: 'Block AO', price: 650, category: 'blue', startAngle: 75, endAngle: 95, rInner: 370, rOuter: 420, stand: 'Sunil Gavaskar Pavilion Top', layer: 'top', seats: 25 },

    // Vijay Merchant Pavilion Top
    { id: 'VMT-AP', name: 'Block AP', price: 500, category: 'pink', startAngle: 100, endAngle: 115, rInner: 360, rOuter: 410, stand: 'Vijay Merchant Pavilion Top', layer: 'top', seats: 22 },
    { id: 'VMT-AQ', name: 'Block AQ', price: 500, category: 'pink', startAngle: 115, endAngle: 130, rInner: 360, rOuter: 410, stand: 'Vijay Merchant Pavilion Top', layer: 'top', seats: 22 },

    // MCA Pavilion Top
    { id: 'MCAT-AR', name: 'Block AR', price: 500, category: 'pink', startAngle: 135, endAngle: 165, rInner: 360, rOuter: 410, stand: 'MCA Pavilion Top', layer: 'top', seats: 22 },
    { id: 'MCAT-AS', name: 'Block AS', price: 500, category: 'pink', startAngle: 165, endAngle: 195, rInner: 360, rOuter: 410, stand: 'MCA Pavilion Top', layer: 'top', seats: 22 },

    // Divecha Pavilion Top
    { id: 'DPT-AT', name: 'Block AT', price: 350, category: 'pink', startAngle: 200, endAngle: 220, rInner: 360, rOuter: 410, stand: 'Divecha Pavilion Top', layer: 'top', seats: 22 },

    // Sachin Tendulkar Pavilion Top
    { id: 'STT-AU', name: 'Block AU', price: 1200, category: 'gold', startAngle: 225, endAngle: 245, rInner: 370, rOuter: 420, stand: 'Sachin Tendulkar Pavilion Top', layer: 'top', seats: 25 },
    { id: 'STT-AV', name: 'Block AV', price: 1200, category: 'gold', startAngle: 245, endAngle: 265, rInner: 370, rOuter: 420, stand: 'Sachin Tendulkar Pavilion Top', layer: 'top', seats: 25 },
    { id: 'STT-AW', name: 'Block AW', price: 1200, category: 'gold', startAngle: 265, endAngle: 285, rInner: 370, rOuter: 420, stand: 'Sachin Tendulkar Pavilion Top', layer: 'top', seats: 25 },

    // Garware Pavilion Top
    { id: 'GPT-AX', name: 'Block AX', price: 650, category: 'blue', startAngle: 290, endAngle: 305, rInner: 370, rOuter: 420, stand: 'Garware Pavilion Top', layer: 'top', seats: 25 },
    { id: 'GPT-AY', name: 'Block AY', price: 650, category: 'blue', startAngle: 305, endAngle: 320, rInner: 370, rOuter: 420, stand: 'Garware Pavilion Top', layer: 'top', seats: 25 },
];

interface Sport {
    id: string;
    title: string;
    team1: string;
    team2: string;
    team1_flag?: string;
    team2_flag?: string;
    date_time: string;
}

export default function SportsSeatsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [sport, setSport] = useState<Sport | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [ticketCount, setTicketCount] = useState(10);
    const [timeLeft, setTimeLeft] = useState(240); // 4 minutes
    const [isBooking, setIsBooking] = useState(false);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        const fetchSport = async () => {
            try {
                const res = await api.get(`/sports/${id}`);
                setSport(res.data);
            } catch (error) {
                console.error('Failed to fetch sport', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSport();
    }, [id]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSeatClick = async (seatId: string) => {
        const isSelected = selectedSeats.includes(seatId);

        if (isSelected) {
            // Deselect: Unlock seat
            try {
                await api.post('/bookings/unlock', {
                    eventId: id,
                    seatId: seatId
                });
                setSelectedSeats(selectedSeats.filter(s => s !== seatId));
            } catch (error) {
                console.error("Failed to unlock seat", error);
                // Even if unlock fails, deselect locally to allow user to proceed/cancel
                setSelectedSeats(selectedSeats.filter(s => s !== seatId));
            }
        } else {
            // Select: Lock seat
            if (selectedSeats.length >= ticketCount) {
                alert(`You can only select up to ${ticketCount} seats.`);
                return;
            }

            try {
                const res = await api.post('/bookings/lock', {
                    eventId: id,
                    seatId: seatId
                });
                if (res.status === 200) {
                    setSelectedSeats([...selectedSeats, seatId]);
                }
            } catch (error: any) {
                console.error("Failed to lock seat", error);
                alert(error.response?.data?.error || "Failed to lock seat. It might be already taken.");
            }
        }
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.5, 6));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.5, 0.5));
    };

    const handleBook = () => {
        if (selectedSeats.length === 0 || !sport) return;

        setIsBooking(true);
        try {
            const seats = selectedSeats.join(',');
            const firstSeatBlock = STADIUM_BLOCKS.find(b =>
                selectedSeats[0].startsWith(b.name.replace('Block ', ''))
            );
            const price = firstSeatBlock?.price || 0;

            const queryParams = new URLSearchParams({
                eventId: sport.id,
                type: 'SPORT',
                seats: seats,
                price: price.toString()
            });

            router.push(`/bookings/checkout?${queryParams.toString()}`);
        } catch (error) {
            console.error('Navigation failed', error);
            setIsBooking(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
    if (!sport) return <div className="min-h-screen bg-background flex items-center justify-center">Sport not found</div>;

    // Generate seats within each block
    const renderSeatsInBlock = (block: typeof STADIUM_BLOCKS[0]) => {
        const blockLetter = block.name.replace('Block ', '');
        const seats = [];
        const rowCount = block.seats || 50; // Use block-specific seat count
        const seatsPerRow = 5; // 5 seats per radial row
        const radialRows = block.layer === 'top' ? 5 : block.layer === 'upper' ? 7 : 10; // 5 rows for top, 7 for upper, 10 for lower

        // Calculate positions for seats within the sector
        const angleSpan = block.endAngle - block.startAngle;

        for (let row = 1; row <= rowCount; row++) {
            const seatId = `${blockLetter}${row}`;
            const isSelected = selectedSeats.includes(seatId);

            // Distribute seats in a grid pattern within the sector
            const radialIndex = Math.floor((row - 1) / seatsPerRow);
            const angularIndex = (row - 1) % seatsPerRow;

            // Position seats radially and angularly within the block
            const radiusStep = (block.rOuter - block.rInner - 20) / (radialRows + 1);
            const radius = block.rInner + 10 + ((radialIndex + 1) * radiusStep);

            const angleStep = angleSpan / (seatsPerRow + 1);
            const angle = block.startAngle + ((angularIndex + 1) * angleStep);

            const pos = polarToCartesian(500, 500, radius, angle);

            seats.push(
                <circle
                    key={seatId}
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 3 : 2}
                    fill={isSelected ? '#9333ea' : '#ffffff'}
                    stroke={isSelected ? '#9333ea' : '#9ca3af'}
                    strokeWidth={isSelected ? 1.5 : 0.8}
                    className="cursor-pointer hover:fill-purple-400 transition-all"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSeatClick(seatId);
                    }}
                />
            );
        }

        return seats;
    };

    return (
        <div className="min-h-screen bg-background font-sans text-slate-900 dark:text-slate-100">
            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-700 dark:text-slate-300">
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <div>
                            <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {sport.team1} vs {sport.team2} - {sport.title}
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {(() => {
                                    try {
                                        const d = new Date(sport.date_time);
                                        if (isNaN(d.getTime())) return 'Date TBA';
                                        return `${d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })} | ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
                                    } catch { return 'Date TBA'; }
                                })()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timer Bar */}
                <div className="bg-purple-900 text-white text-center text-sm py-2 font-medium sticky top-16 z-40">
                    You have approximately <span className="font-bold text-pink-300">{Math.ceil(timeLeft / 60)} minutes</span> to select your seats.
                </div>

                <style jsx global>{`
                    body {
                        overflow: hidden;
                        margin: 0;
                        padding: 0;
                    }
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </header>

            <main className="pt-[0px] flex h-screen overflow-hidden bg-background no-scrollbar">
                {/* Sidebar - Left */}
                <aside className="w-80 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-md px-4 pb-4 mb-4 hidden lg:flex flex-col h-full overflow-hidden">
                    {/* Top Section - Match Info */}
                    <div className="py-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-1">
                            {sport.team1_flag && <Image src={sport.team1_flag} alt={sport.team1} width={32} height={32} className="object-contain" />}
                            <span className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase">vs</span>
                            {sport.team2_flag && <Image src={sport.team2_flag} alt={sport.team2} width={32} height={32} className="object-contain" />}
                        </div>
                        <h2 className="text-base font-bold leading-tight text-slate-900 dark:text-slate-100">
                            {sport.team1} vs {sport.team2}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sport.title}</p>
                    </div>

                    {/* Middle Section - Scrollable Content */}
                    <div className="flex-1 py-1 space-y-2 overflow-y-auto no-scrollbar">
                        <div className="text-[9px] text-gray-500 italic">
                            Click on seats to select
                        </div>

                        {/* Ticket Count Selector */}
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/50">
                            <div className="flex items-center gap-2 mb-1.5 text-purple-900 dark:text-purple-300 font-bold text-xs">
                                <Users className="w-3 h-3" />
                                <span>Select Tickets</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {[1, 2, 4, 6, 8, 10].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => {
                                            setTicketCount(num);
                                            setSelectedSeats([]);
                                        }}
                                        className={cn(
                                            "w-7 h-7 rounded-lg text-[10px] font-bold transition-all",
                                            ticketCount === num
                                                ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-purple-300"
                                        )}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Legend */}
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 px-1">Price Legend</p>
                            {SEAT_CATEGORIES.map((cat) => (
                                <div key={cat.id} className="flex items-center justify-between p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer rounded-lg border border-transparent transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-sm ${cat.color} opacity-80 group-hover:opacity-100 transition-opacity shadow-sm`}></div>
                                        <span className={`text-xs font-bold ${cat.color.replace('bg-', 'text-')}`}>{cat.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Section - Fixed Booking */}
                    <div className="mt-auto border-t border-slate-100 dark:border-slate-800 mb-28 pt-1.5 bg-white dark:bg-slate-900">
                        <div className="mb-1.5">
                            <div className="flex items-center justify-between mb-1.5">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Selected Seats</p>
                                <span className="text-[10px] font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
                                    {selectedSeats.length}/{ticketCount}
                                </span>
                            </div>
                            <div className="p-3 border rounded-xl bg-slate-50/50 dark:bg-slate-800/30 shadow-sm border-slate-100 dark:border-slate-800">
                                {selectedSeats.length > 0 ? (
                                    <>
                                        <div className="flex flex-wrap gap-1 mb-1.5 max-h-12 overflow-y-auto no-scrollbar">
                                            {selectedSeats.map(seat => (
                                                <span key={seat} className="px-1.5 py-0.5 bg-purple-600 text-white text-[9px] font-bold rounded">
                                                    {seat}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 dark:border-slate-700 gap-2">
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-base font-black text-slate-900 dark:text-slate-100 leading-none truncate">
                                                    ₹{(() => {
                                                        const firstSeat = selectedSeats[0];
                                                        const block = STADIUM_BLOCKS.find(b =>
                                                            firstSeat.startsWith(b.name.replace('Block ', ''))
                                                        );
                                                        return (block?.price || 0) * selectedSeats.length;
                                                    })().toLocaleString()}
                                                </span>
                                                <span className="text-[8px] text-slate-500 dark:text-slate-400 mt-0 uppercase font-bold tracking-tighter">Total Payable</span>
                                            </div>
                                            <Button
                                                size="sm"
                                                className={cn(
                                                    "bg-red-500 hover:bg-red-600 text-white font-bold h-8 px-3 text-xs rounded-lg transition-all shadow-md active:scale-[0.98] whitespace-nowrap",
                                                    (selectedSeats.length === 0 || isBooking) && "opacity-50 cursor-not-allowed shadow-none"
                                                )}
                                                disabled={selectedSeats.length === 0 || isBooking}
                                                onClick={handleBook}
                                            >
                                                {isBooking ? '...' : 'Book Now'}
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-1.5 text-center">
                                        <span className="text-gray-400 text-[11px] font-medium italic">Select seats to proceed</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </aside>

                {/* Main Content - Stadium Map */}
                <section className="flex-1 relative overflow-hidden flex items-center justify-center p-0 select-none no-scrollbar">
                    <div className="relative w-full h-full flex items-center justify-center overflow-auto no-scrollbar">
                        {/* Stadium SVG Container */}
                        <motion.div
                            drag
                            dragConstraints={{ left: -500 * zoom, right: 500 * zoom, top: -500 * zoom, bottom: 500 * zoom }}
                            dragElastic={0.1}
                            dragMomentum={true}
                            style={{
                                scale: zoom,
                                cursor: zoom > 1 ? 'grab' : 'default'
                            }}
                            whileDrag={{ cursor: 'grabbing' }}
                            className="flex items-center justify-center min-w-full min-h-full"
                        >
                            <svg viewBox="0 0 1000 1000" className="w-[95%] h-[95%] drop-shadow-2xl max-w-4xl overflow-visible">
                                <defs>
                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="2" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>

                                {/* Ground */}
                                <circle cx="500" cy="500" r="180" fill="#15803d" stroke="#166534" strokeWidth="5" />
                                {/* Pitch */}
                                <rect x="485" y="430" width="30" height="140" fill="#e5e7eb" rx="2" />
                                <rect x="498" y="435" width="4" height="130" fill="#d1d5db" />

                                {/* Block Paths Layer */}
                                {STADIUM_BLOCKS.map((block) => {
                                    const path = describeSector(500, 500, block.rInner, block.rOuter, block.startAngle + 1, block.endAngle - 1);
                                    return (
                                        <path
                                            key={`path-${block.id}`}
                                            d={path}
                                            fill="currentColor"
                                            className="text-slate-200 dark:text-slate-800 hover:text-slate-300 dark:hover:text-slate-700 transition-all duration-300 ease-out"
                                            stroke="white"
                                            strokeOpacity={0.1}
                                            strokeWidth="1"
                                        />
                                    );
                                })}

                                {/* Block Content Layer (Labels & Seats) */}
                                {STADIUM_BLOCKS.map((block) => {
                                    return (
                                        <g key={`content-${block.id}`}>
                                            {/* Block Label */}
                                            {(() => {
                                                const angle = (block.startAngle + block.endAngle) / 2;
                                                // Position label just outside or "below" the block
                                                const labelRadius = block.rOuter + 12;
                                                const labelPos = polarToCartesian(500, 500, labelRadius, angle);
                                                return (
                                                    <text
                                                        x={labelPos.x}
                                                        y={labelPos.y}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                        fill="#4b5563"
                                                        fontSize="10"
                                                        fontWeight="900"
                                                        className="pointer-events-none select-none"
                                                        style={{
                                                            transformOrigin: `${labelPos.x}px ${labelPos.y}px`,
                                                            transform: `rotate(${angle > 90 && angle < 270 ? angle + 180 : angle}deg)`,
                                                            opacity: zoom > 1.1 ? 1 : 0.6
                                                        }}
                                                    >
                                                        {block.name.replace('Block ', '')}
                                                    </text>
                                                );
                                            })()}
                                            {/* Render seats within block */}
                                            {renderSeatsInBlock(block)}
                                        </g>
                                    );
                                })}

                                {/* Stand Labels */}
                                {Array.from(new Set(STADIUM_BLOCKS.filter(b => b.layer === 'lower').map(b => b.stand))).map((standName) => {
                                    const standBlocks = STADIUM_BLOCKS.filter(b => b.stand === standName && b.layer === 'lower');
                                    const startAngle = Math.min(...standBlocks.map(b => b.startAngle));
                                    const endAngle = Math.max(...standBlocks.map(b => b.endAngle));
                                    const angle = (startAngle + endAngle) / 2;
                                    // Position labels outside the top tier (which ends at rOuter 440)
                                    const labelPos = polarToCartesian(500, 500, 475, angle);

                                    return (
                                        <text
                                            key={`stand-label-${standName}`}
                                            x={labelPos.x}
                                            y={labelPos.y}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill="currentColor"
                                            fontSize="14"
                                            fontWeight="800"
                                            className="pointer-events-none select-none uppercase tracking-widest text-slate-400 dark:text-slate-600"
                                            style={{
                                                transformOrigin: `${labelPos.x}px ${labelPos.y}px`,
                                                transform: `rotate(${angle > 90 && angle < 270 ? angle + 180 : angle}deg)`,
                                                opacity: zoom < 3 ? 1 : 0.6
                                            }}
                                        >
                                            {standName.toUpperCase()}
                                        </text>
                                    );
                                })}

                            </svg>
                        </motion.div>
                    </div>

                    {/* Zoom Controls - Top Right */}
                    <div className="absolute top-4 right-4 flex flex-col gap-3 z-30">
                        <Button
                            variant="outline"
                            size="icon"
                            className="bg-white dark:bg-slate-800 rounded-full shadow-lg h-10 w-10 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 transition-all active:scale-95"
                            onClick={handleZoomIn}
                            disabled={zoom >= 6}
                        >
                            <ZoomIn className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="bg-white dark:bg-slate-800 rounded-full shadow-lg h-10 w-10 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 transition-all active:scale-95"
                            onClick={handleZoomOut}
                            disabled={zoom <= 0.5}
                        >
                            <ZoomOut className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                        </Button>
                    </div>
                </section>
            </main>
        </div>
    );
}
