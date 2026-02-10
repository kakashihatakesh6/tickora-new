'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Search, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    // North Stand (Top/North) - centered around 0
    { id: 'NS-A', name: 'Block A', price: 400, category: 'pink', startAngle: 330, endAngle: 345, rInner: 220, rOuter: 380, stand: 'North Stand' },
    { id: 'NS-B', name: 'Block B', price: 400, category: 'pink', startAngle: 345, endAngle: 360, rInner: 220, rOuter: 380, stand: 'North Stand' },
    { id: 'NS-C', name: 'Block C', price: 400, category: 'pink', startAngle: 0, endAngle: 15, rInner: 220, rOuter: 380, stand: 'North Stand' },
    { id: 'NS-D', name: 'Block D', price: 400, category: 'pink', startAngle: 15, endAngle: 30, rInner: 220, rOuter: 380, stand: 'North Stand' },

    // Sunil Gavaskar Pavilion (East)
    { id: 'SG-E', name: 'Block E', price: 1000, category: 'gold', startAngle: 35, endAngle: 55, rInner: 220, rOuter: 350, stand: 'Sunil Gavaskar Pavilion' },
    { id: 'SG-F', name: 'Block F', price: 1000, category: 'gold', startAngle: 55, endAngle: 75, rInner: 220, rOuter: 350, stand: 'Sunil Gavaskar Pavilion' },
    { id: 'SG-G', name: 'Block G', price: 1000, category: 'gold', startAngle: 75, endAngle: 95, rInner: 220, rOuter: 350, stand: 'Sunil Gavaskar Pavilion' },

    // Vijay Merchant Pavilion (South East)
    { id: 'VM-H', name: 'Block H', price: 750, category: 'blue', startAngle: 100, endAngle: 115, rInner: 220, rOuter: 320, stand: 'Vijay Merchant Pavilion' },
    { id: 'VM-I', name: 'Block I', price: 750, category: 'blue', startAngle: 115, endAngle: 130, rInner: 220, rOuter: 320, stand: 'Vijay Merchant Pavilion' },

    // MCA Pavilion (South)
    { id: 'MCA-J', name: 'Block J', price: 750, category: 'blue', startAngle: 135, endAngle: 165, rInner: 220, rOuter: 320, stand: 'MCA Pavilion' },
    { id: 'MCA-K', name: 'Block K', price: 750, category: 'blue', startAngle: 165, endAngle: 195, rInner: 220, rOuter: 320, stand: 'MCA Pavilion' },

    // Divecha Pavilion (South West)
    { id: 'DP-L', name: 'Block L', price: 500, category: 'blue', startAngle: 200, endAngle: 220, rInner: 220, rOuter: 320, stand: 'Divecha Pavilion' },

    // Sachin Tendulkar Pavilion (West)
    { id: 'ST-M', name: 'Block M', price: 2000, category: 'platinum', startAngle: 225, endAngle: 245, rInner: 220, rOuter: 350, stand: 'Sachin Tendulkar Pavilion' },
    { id: 'ST-N', name: 'Block N', price: 2000, category: 'platinum', startAngle: 245, endAngle: 265, rInner: 220, rOuter: 350, stand: 'Sachin Tendulkar Pavilion' },
    { id: 'ST-O', name: 'Block O', price: 2000, category: 'platinum', startAngle: 265, endAngle: 285, rInner: 220, rOuter: 350, stand: 'Sachin Tendulkar Pavilion' },

    // Garware Pavilion (North West)
    { id: 'GP-P', name: 'Block P', price: 1000, category: 'gold', startAngle: 290, endAngle: 305, rInner: 220, rOuter: 350, stand: 'Garware Pavilion' },
    { id: 'GP-Q', name: 'Block Q', price: 1000, category: 'gold', startAngle: 305, endAngle: 320, rInner: 220, rOuter: 350, stand: 'Garware Pavilion' },
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
    const [ticketCount, setTicketCount] = useState(1);
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

    const handleSeatClick = (seatId: string) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatId));
        } else if (selectedSeats.length < ticketCount) {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.5, 4));
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

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
    if (!sport) return <div className="min-h-screen bg-white flex items-center justify-center">Sport not found</div>;

    // Generate seats within each block
    const renderSeatsInBlock = (block: typeof STADIUM_BLOCKS[0]) => {
        const blockLetter = block.name.replace('Block ', '');
        const seats = [];
        const rowCount = 50; // 50 seats per block
        const seatsPerRow = 5; // 5 seats per radial row
        const radialRows = 10; // 10 radial rows

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

            const pos = polarToCartesian(450, 450, radius, angle);

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
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <div>
                            <h1 className="text-sm font-bold text-gray-900 leading-tight">
                                {sport.team1} vs {sport.team2} - {sport.title}
                            </h1>
                            <p className="text-xs text-gray-500">
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
            </header>

            <main className="pt-28 pb-24 flex h-screen overflow-hidden">
                {/* Sidebar - Left */}
                <aside className="w-80 border-r border-gray-200 bg-white p-4 hidden lg:flex flex-col gap-6 overflow-y-auto">
                    {/* Match Info Card */}
                    <div className="flex items-center gap-3">
                        {sport.team1_flag && <Image src={sport.team1_flag} alt={sport.team1} width={48} height={48} className="object-contain" />}
                        <span className="text-sm font-bold text-gray-400">vs</span>
                        {sport.team2_flag && <Image src={sport.team2_flag} alt={sport.team2} width={48} height={48} className="object-contain" />}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold leading-tight mb-2">
                            {sport.team1} vs {sport.team2} - {sport.title}
                        </h2>
                    </div>

                    <div className="text-xs text-gray-500 italic">
                        Click on individual seats within blocks to select them.
                    </div>

                    {/* Price Legend */}
                    <div className="space-y-2">
                        {SEAT_CATEGORIES.map((cat) => (
                            <div key={cat.id} className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded-lg border border-transparent hover:border-gray-200 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-sm ${cat.color} opacity-80 group-hover:opacity-100 transition-opacity shadow-sm`}></div>
                                    <span className={`font-bold ${cat.color.replace('bg-', 'text-')}`}>{cat.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selected Seats Info */}
                    <div className="mt-auto border-t pt-4">
                        <p className="text-sm font-bold mb-2 text-gray-800">Selected Seats ({selectedSeats.length}/{ticketCount})</p>
                        {selectedSeats.length > 0 ? (
                            <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {selectedSeats.map(seat => (
                                        <span key={seat} className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">
                                            {seat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 border border-dashed rounded-lg text-center">
                                <span className="text-gray-400 text-sm">Click seats on the map</span>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content - Stadium Map */}
                <section className="flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center p-8 select-none">
                    <div className="relative w-full h-full flex items-center justify-center overflow-auto">
                        {/* Stadium SVG */}
                        <div style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease' }}>
                            <svg viewBox="0 0 900 900" className="w-[90%] h-[90%] drop-shadow-2xl max-w-3xl">
                                <defs>
                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="2" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>

                                {/* Ground */}
                                <circle cx="450" cy="450" r="180" fill="#15803d" stroke="#166534" strokeWidth="5" />
                                {/* Pitch */}
                                <rect x="435" y="380" width="30" height="140" fill="#e5e7eb" rx="2" />
                                <rect x="448" y="385" width="4" height="130" fill="#d1d5db" />

                                {/* Blocks */}
                                {STADIUM_BLOCKS.map((block) => {
                                    const categoryColor = SEAT_CATEGORIES.find(c => c.id === block.category)?.color.replace('bg-', '') || 'gray-400';
                                    const path = describeSector(450, 450, block.rInner, block.rOuter, block.startAngle + 1, block.endAngle - 1);

                                    return (
                                        <g key={block.id}>
                                            <path
                                                d={path}
                                                fill="#e5e7eb"
                                                stroke="white"
                                                strokeWidth="1"
                                                className="transition-all duration-300 ease-out"
                                            />
                                            {/* Block Label */}
                                            {(() => {
                                                const angle = (block.startAngle + block.endAngle) / 2;
                                                const labelPos = polarToCartesian(450, 450, block.rInner + 10, angle);
                                                return (
                                                    <text
                                                        x={labelPos.x}
                                                        y={labelPos.y}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                        fill="#6b7280"
                                                        fontSize="9"
                                                        fontWeight="bold"
                                                        className="pointer-events-none"
                                                        style={{
                                                            transformOrigin: `${labelPos.x}px ${labelPos.y}px`,
                                                            transform: `rotate(${angle > 90 && angle < 270 ? angle + 180 : angle}deg)`
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
                                {Array.from(new Set(STADIUM_BLOCKS.map(b => b.stand))).map((standName) => {
                                    const standBlocks = STADIUM_BLOCKS.filter(b => b.stand === standName);
                                    const startAngle = Math.min(...standBlocks.map(b => b.startAngle));
                                    const endAngle = Math.max(...standBlocks.map(b => b.endAngle));
                                    const angle = (startAngle + endAngle) / 2;
                                    const labelPos = polarToCartesian(450, 450, 410, angle);

                                    return (
                                        <text
                                            key={`stand-label-${standName}`}
                                            x={labelPos.x}
                                            y={labelPos.y}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill="#9ca3af"
                                            fontSize="12"
                                            fontWeight="bold"
                                            className="pointer-events-none select-none uppercase tracking-widest"
                                            style={{
                                                transformOrigin: `${labelPos.x}px ${labelPos.y}px`,
                                                transform: `rotate(${angle > 90 && angle < 270 ? angle + 180 : angle}deg)`
                                            }}
                                        >
                                            {standName}
                                        </text>
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Zoom Controls */}
                        <div className="absolute bottom-8 right-8 flex flex-col gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                className="bg-white rounded-full shadow-lg h-10 w-10 hover:bg-gray-50 border-gray-200"
                                onClick={handleZoomIn}
                                disabled={zoom >= 4}
                            >
                                <ZoomIn className="w-5 h-5 text-gray-700" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="bg-white rounded-full shadow-lg h-10 w-10 hover:bg-gray-50 border-gray-200"
                                onClick={handleZoomOut}
                                disabled={zoom <= 0.5}
                            >
                                <ZoomOut className="w-5 h-5 text-gray-700" />
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Bottom Booking Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        {selectedSeats.length > 0 ? (
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-gray-900">
                                    ₹{(() => {
                                        const firstSeat = selectedSeats[0];
                                        const block = STADIUM_BLOCKS.find(b =>
                                            firstSeat.startsWith(b.name.replace('Block ', ''))
                                        );
                                        return (block?.price || 0) * selectedSeats.length;
                                    })()}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {selectedSeats.join(', ')}
                                </span>
                            </div>
                        ) : (
                            <span className="text-gray-400 text-sm">Select seats to proceed</span>
                        )}
                    </div>
                    <Button
                        size="lg"
                        className={cn(
                            "bg-red-500 hover:bg-red-600 text-white font-bold px-12 py-6 text-lg rounded-lg transition-all",
                            (selectedSeats.length === 0 || isBooking) && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={selectedSeats.length === 0 || isBooking}
                        onClick={handleBook}
                    >
                        {isBooking ? 'Booking...' : 'Book'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
