'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import StadiumSeatMap from './StadiumSeatMap';

interface SeatMapProps {
    totalSeats: number;
    occupiedSeats: string[];
    selectedSeats: string[];
    maxSelectable: number;
    onSeatSelect: (seatId: string, price: number, tier: string) => void;
    basePrice: number;
    eventType: string; // 'MOVIE', 'SPORT', 'CONCERT'
    category?: string; // 'Cricket', etc.
}

export default function SeatMap({
    totalSeats,
    occupiedSeats,
    selectedSeats,
    maxSelectable,
    onSeatSelect,
    basePrice,
    eventType,
    category
}: SeatMapProps) {
    // Generate seat layout
    const layout = useMemo(() => {
        const rows: { name: string; seats: { id: string; tier: 'PREMIUM' | 'STANDARD'; price: number }[]; gap: number | null }[] = [];

        // Custom layout configuration to match the reference image
        // Rows A-D: Standard continuous
        // Rows E-O: Split with a gap
        const rowConfig = [
            { name: 'A', count: 14, gap: null, tier: 'PREMIUM' },
            { name: 'B', count: 14, gap: null, tier: 'PREMIUM' },
            { name: 'C', count: 14, gap: null, tier: 'PREMIUM' },
            { name: 'D', count: 14, gap: null, tier: 'PREMIUM' },
            { name: 'E', count: 12, gap: 6, tier: 'STANDARD' },
            { name: 'F', count: 12, gap: 6, tier: 'STANDARD' },
            { name: 'G', count: 12, gap: 6, tier: 'STANDARD' },
            { name: 'H', count: 12, gap: 6, tier: 'STANDARD' },
            { name: 'I', count: 12, gap: 6, tier: 'STANDARD' },
            { name: 'J', count: 12, gap: 6, tier: 'STANDARD' },
            { name: 'K', count: 12, gap: 6, tier: 'STANDARD' },
            { name: 'L', count: 12, gap: 6, tier: 'STANDARD' },
            { name: 'M', count: 12, gap: 6, tier: 'STANDARD' },
            { name: 'N', count: 12, gap: 6, tier: 'STANDARD' },
            { name: 'O', count: 14, gap: null, tier: 'STANDARD' }, // Last row continuous often
        ];

        rowConfig.forEach(config => {
            const rowSeats = [];
            for (let i = 1; i <= config.count; i++) {
                const tier = config.tier as 'PREMIUM' | 'STANDARD';
                const price = tier === 'PREMIUM' ? basePrice + 150 : basePrice;
                rowSeats.push({
                    id: `${config.name}${i}`,
                    tier,
                    price
                });
            }
            rows.push({ ...config, seats: rowSeats });
        });

        return rows;
    }, [basePrice]); // Removed eventType dependency for now to enforce this specific layout

    if (category === 'Cricket') {
        return (
            <StadiumSeatMap
                totalSeats={totalSeats}
                occupiedSeats={occupiedSeats}
                selectedSeats={selectedSeats}
                maxSelectable={maxSelectable}
                onSeatSelect={onSeatSelect}
                basePrice={basePrice}
            />
        );
    }

    return (
        <div className="flex flex-col items-center w-full select-none">
            {/* Screen Indicator */}
            <div className="w-full mb-12 flex flex-col items-center relative">
                <div className="absolute top-0 w-[80%] h-8 border-t-4 border-blue-200 rounded-[50%] shadow-[0_-10px_20px_-5px_rgba(59,130,246,0.3)]" />
                <span className="mt-4 text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">Screen</span>
            </div>

            {/* Seats Grid */}
            <div className="flex flex-col gap-3 items-center">
                {layout.map((row) => (
                    <div key={row.name} className="flex items-center gap-6">
                        {/* Row Label Left */}
                        <span className="w-4 text-xs font-medium text-gray-400 text-center">{row.name}</span>

                        <div className="flex items-center gap-2">
                            {row.seats.map((seat, index) => {
                                const isOccupied = occupiedSeats.includes(seat.id);
                                const isSelected = selectedSeats.includes(seat.id);

                                // Calculate if we need a gap before this seat
                                // Gap logic: if row has a defined gap index, and current index equals that gap
                                const showGap = row.gap && index === row.gap;

                                return (
                                    <div key={seat.id} className="flex">
                                        {showGap && <div className="w-8" />} {/* Visual Gap */}

                                        <button
                                            onClick={() => !isOccupied && onSeatSelect(seat.id, seat.price, seat.tier)}
                                            disabled={isOccupied}
                                            className={cn(
                                                "relative flex items-center justify-center transition-all duration-200",
                                                "w-7 h-7 rounded-lg text-[10px]",
                                                isOccupied
                                                    ? "bg-gray-200 text-transparent cursor-not-allowed"
                                                    : isSelected
                                                        ? "bg-purple-600 text-white shadow-md scale-110 z-10" // Selected: Purple
                                                        : "bg-blue-100 hover:bg-blue-200 text-transparent border border-blue-200", // Available: Light Blue
                                            )}
                                            title={`${seat.id} - ₹${seat.price} (${seat.tier})`}
                                        >
                                            {isSelected && <Check className="w-4 h-4" strokeWidth={3} />}
                                            {/* We don't show numbers inside unselected seats in the reference style, usually only on hover or selected. 
                                                Reference shows empty boxes for available. */}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Row Label Right (Optional, sometimes useful) */}
                        {/* <span className="w-4 text-xs font-medium text-gray-400 text-center">{row.name}</span> */}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-12 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                    Occupied
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-blue-100 border border-blue-200"></div>
                    Available
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-purple-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                    </div>
                    Selected
                </div>
            </div>
        </div>
    );
}
