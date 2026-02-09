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
}

// Define Stands with angles
const STANDS = [
    { id: 'sunil-gavaskar', name: 'SUNIL GAVASKAR PAVILION', price: 1000, category: 'gold', startAngle: 0, endAngle: 45 },
    { id: 'north-stand', name: 'NORTH STAND', price: 400, category: 'pink', startAngle: 45, endAngle: 90 },
    { id: 'vijay-merchant', name: 'VIJAY MERCHANT PAVILION', price: 750, category: 'blue', startAngle: 90, endAngle: 135 },
    { id: 'sachin-tendulkar', name: 'SACHIN TENDULKAR PAVILION', price: 1000, category: 'gold', startAngle: 135, endAngle: 180 },
    { id: 'mca-pavilion', name: 'MCA PAVILION', price: 750, category: 'blue', startAngle: 180, endAngle: 225 },
    { id: 'divecha-pavilion', name: 'DIVECHA PAVILION', price: 750, category: 'blue', startAngle: 225, endAngle: 270 },
    { id: 'grand-stand', name: 'GRAND STAND', price: 1000, category: 'gold', startAngle: 270, endAngle: 315 },
    { id: 'garware-pavilion', name: 'GARWARE PAVILION', price: 1000, category: 'gold', startAngle: 315, endAngle: 360 },
];

export default function SportsSeatsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [sport, setSport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedStand, setSelectedStand] = useState<string | null>(null);
    const [ticketCount, setTicketCount] = useState(1);
    const [timeLeft, setTimeLeft] = useState(240); // 4 minutes
    const [isBooking, setIsBooking] = useState(false);

    const handleBook = () => {
        if (!selectedStand || !sport) return;

        setIsBooking(true);
        try {
            const seats = Array(ticketCount).fill(selectedStand).join(',');
            const price = selectedStandData?.price || 0;

            // Redirect to checkout with query params
            const queryParams = new URLSearchParams({
                eventId: sport.id,
                type: 'SPORT',
                seats: seats,
                price: price.toString()
            });

            router.push(`/bookings/checkout?${queryParams.toString()}`);
        } catch (error: any) {
            console.error('Navigation failed', error);
            setIsBooking(false); // Only reset if navigation fails immediately
        }
    };

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

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins} minutes ${secs} seconds`;
    };

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
    if (!sport) return <div className="min-h-screen bg-white flex items-center justify-center">Sport not found</div>;

    const selectedStandData = STANDS.find(s => s.id === selectedStand);

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
                    <div className="flex items-center gap-4">
                        <div className="text-sm font-semibold border rounded px-3 py-1 cursor-pointer hover:bg-gray-50 transition-colors">
                            {ticketCount} Tickets <span className="text-xs text-gray-400">▼</span>
                        </div>
                        <Button variant="ghost" size="icon">
                            <Search className="w-5 h-5" />
                        </Button>
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
                        <p className="text-sm text-gray-500">
                            {(() => {
                                try {
                                    const d = new Date(sport.date_time);
                                    if (isNaN(d.getTime())) return 'Date TBA';
                                    return `${d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })} | ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
                                } catch { return 'Date TBA'; }
                            })()}
                        </p>
                    </div>

                    <div className="text-xs text-gray-500 italic">
                        Please select the category of your choice. It will get highlighted on the layout.
                    </div>

                    {/* Price Legend */}
                    <div className="space-y-2">
                        {SEAT_CATEGORIES.map((cat) => (
                            <div key={cat.id} className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded-lg border border-transparent hover:border-gray-200 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-sm ${cat.color} opacity-80 group-hover:opacity-100 transition-opacity shadow-sm`}></div>
                                    <span className={`font-bold ${cat.color.replace('bg-', 'text-')}`}>{cat.label}</span>
                                </div>
                                <span className="text-gray-400 text-xs transform group-hover:rotate-180 transition-transform">▼</span>
                            </div>
                        ))}
                    </div>

                    {/* Selected Seat Info */}
                    <div className="mt-auto border-t pt-4">
                        <p className="text-sm font-bold mb-2 text-gray-800">Please select seat(s) of your choice</p>
                        {selectedStand ? (
                            <div className="p-4 border rounded-lg bg-gray-50 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Chosen Stand</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={`w-3 h-3 rounded-full ${SEAT_CATEGORIES.find(c => c.id === selectedStandData?.category)?.color || 'bg-purple-600'}`}></div>
                                            <p className="text-sm font-bold text-gray-900 line-clamp-1">{selectedStandData?.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">9-44</p>
                                        <p className="text-xs text-gray-400">Seats</p>
                                    </div>
                                </div>
                                <div className="mt-3 text-red-600 text-xs font-bold cursor-pointer hover:underline flex items-center gap-1">
                                    3 Details <span className="text-[10px]">▼</span>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 border border-dashed rounded-lg text-center">
                                <span className="text-gray-400 text-sm">Select a stand on the map to see details</span>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content - Stadium Map */}
                <section className="flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center p-8 select-none">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Stadium SVG */}
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

                            {/* Stands */}
                            {STANDS.map((stand) => {
                                const isSelected = selectedStand === stand.id;
                                const categoryColor = SEAT_CATEGORIES.find(c => c.id === stand.category)?.color.replace('bg-', '') || 'gray-400';
                                const path = describeSector(450, 450, 200, 420, stand.startAngle + 2, stand.endAngle - 2); // Added gap between sectors

                                return (
                                    <g
                                        key={stand.id}
                                        onClick={() => setSelectedStand(stand.id)}
                                        className="cursor-pointer group"
                                    >
                                        <path
                                            d={path}
                                            fill={isSelected ? `#${categoryColor === 'pink-500' ? 'ec4899' : categoryColor === 'blue-500' ? '3b82f6' : 'eab308'}` : '#e5e7eb'}
                                            stroke="white"
                                            strokeWidth="2"
                                            className={cn(
                                                "transition-all duration-300 ease-out",
                                                isSelected ? "filter drop-shadow-lg" : "hover:fill-gray-300"
                                            )}
                                        />
                                    </g>
                                );
                            })}

                            {/* Stand Labels */}
                            {STANDS.map((stand) => {
                                const angle = (stand.startAngle + stand.endAngle) / 2;
                                const labelPos = polarToCartesian(450, 450, 310, angle);
                                const isSelected = selectedStand === stand.id;

                                return (
                                    <text
                                        key={`label-${stand.id}`}
                                        x={labelPos.x}
                                        y={labelPos.y}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill={isSelected ? '#ffffff' : '#374151'}
                                        fontSize="11"
                                        fontWeight="bold"
                                        className="pointer-events-none select-none uppercase tracking-tighter"
                                        style={{
                                            transformOrigin: `${labelPos.x}px ${labelPos.y}px`,
                                            transform: `rotate(${angle > 90 && angle < 270 ? angle + 180 : angle}deg)`
                                        }}
                                    >
                                        {stand.name}
                                    </text>
                                );
                            })}
                        </svg>

                        {/* Zoom Controls */}
                        <div className="absolute bottom-8 right-8 flex flex-col gap-3">
                            <Button variant="outline" size="icon" className="bg-white rounded-full shadow-lg h-10 w-10 hover:bg-gray-50 border-gray-200">
                                <ZoomIn className="w-5 h-5 text-gray-700" />
                            </Button>
                            <Button variant="outline" size="icon" className="bg-white rounded-full shadow-lg h-10 w-10 hover:bg-gray-50 border-gray-200">
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
                        {selectedStand ? (
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-gray-900">
                                    ₹{(selectedStandData?.price || 0) * ticketCount}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {ticketCount} Seats • {selectedStandData?.name}
                                </span>
                            </div>
                        ) : (
                            <span className="text-gray-400 text-sm">Select a stand to proceed</span>
                        )}
                    </div>
                    <Button
                        size="lg"
                        className={cn(
                            "bg-red-500 hover:bg-red-600 text-white font-bold px-12 py-6 text-lg rounded-lg transition-all",
                            (!selectedStand || isBooking) && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={!selectedStand || isBooking}
                        onClick={handleBook}
                    >
                        {isBooking ? 'Booking...' : 'Book'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

