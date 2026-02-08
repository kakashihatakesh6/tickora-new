'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Tv, CircleDot } from 'lucide-react';

interface SeatMapProps {
    totalSeats: number;
    occupiedSeats: string[];
    selectedSeats: string[];
    maxSelectable: number;
    onSeatSelect: (seatId: string) => void;
    price: number;
    eventType: string; // 'MOVIE', 'SPORT', 'CONCERT'
}

export default function SeatMap({
    totalSeats,
    occupiedSeats,
    selectedSeats,
    maxSelectable,
    onSeatSelect,
    price,
    eventType
}: SeatMapProps) {
    // Generate seat layout based on total seats
    // This is a deterministic generator for visual purposes since we don't have a real map in DB
    const layout = useMemo(() => {
        const rows: { name: string; seats: string[] }[] = [];

        // Config based on event type
        let seatsPerRow = 10;
        if (eventType === 'SPORT' || eventType === 'CONCERT') {
            seatsPerRow = 20; // Wide stadium style
        }

        const numRows = Math.ceil(totalSeats / seatsPerRow);

        // Generate alphanumeric seats: A1, A2... B1, B2...
        let currentSeatIndex = 0;

        for (let i = 0; i < numRows; i++) {
            const rowName = String.fromCharCode(65 + i); // A, B, C...
            const rowSeats: string[] = [];

            for (let j = 1; j <= seatsPerRow; j++) {
                if (currentSeatIndex >= totalSeats) break;
                rowSeats.push(`${rowName}${j}`);
                currentSeatIndex++;
            }
            rows.push({ name: rowName, seats: rowSeats });
        }

        return rows;
    }, [totalSeats, eventType]);

    const isStadium = eventType === 'SPORT' || eventType === 'CONCERT';

    return (
        <div className="flex flex-col items-center w-full">
            {/* Screen / Stage Indicator */}
            <div className="w-full mb-10 flex flex-col items-center">
                {isStadium ? (
                    <div className="w-3/4 h-24 border-2 border-green-500/30 bg-green-500/10 rounded-[4rem] flex items-center justify-center mb-4 perspective-1000 group">
                        <div className="text-green-600 font-bold uppercase tracking-[0.3em] text-sm opacity-50">Field / Stage</div>
                    </div>
                ) : (
                    <div className="w-3/4 flex flex-col items-center">
                        <Tv className="w-12 h-12 text-indigo-200 mb-2 opacity-50" />
                        <div className="w-full h-2 bg-gradient-to-r from-transparent via-indigo-300 to-transparent shadow-[0_4px_10px_rgba(99,102,241,0.5)] rounded-full mb-2" />
                        <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Screen</span>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex gap-6 mb-8 text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600"></div>
                    Available
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-gray-300 dark:bg-gray-700 cursor-not-allowed"></div>
                    Occupied
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-indigo-600 shadow-md"></div>
                    Selected
                </div>
            </div>

            {/* Seats Container */}
            <div className="w-full overflow-x-auto pb-12 custom-scrollbar">
                <div className="min-w-max px-8 flex flex-col gap-3 mx-auto">
                    {layout.map((row) => (
                        <div key={row.name} className="flex items-center gap-4 justify-center">
                            <span className="w-6 text-sm font-bold text-gray-400">{row.name}</span>
                            <div className={cn(
                                "flex gap-2",
                                isStadium ? "gap-1" : "gap-3" // Tighter packing for stadium
                            )}>
                                {row.seats.map((seatId) => {
                                    const isOccupied = occupiedSeats.includes(seatId);
                                    const isSelected = selectedSeats.includes(seatId);

                                    return (
                                        <button
                                            key={seatId}
                                            onClick={() => !isOccupied && onSeatSelect(seatId)}
                                            disabled={isOccupied}
                                            className={cn(
                                                "relative group transition-all duration-200 ease-out flex items-center justify-center",
                                                isStadium ? "w-6 h-6 rounded-sm text-[0.5rem]" : "w-8 h-8 rounded-lg text-xs",
                                                isOccupied
                                                    ? "bg-gray-200 dark:bg-gray-700 text-transparent cursor-not-allowed"
                                                    : isSelected
                                                        ? "bg-indigo-600 text-white shadow-lg scale-110 z-10"
                                                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:shadow-md text-gray-500 dark:text-gray-400"
                                            )}
                                            title={`Seat ${seatId} - ₹${price}`}
                                        >
                                            {/* Tooltip style number for stadium, visible number for cinema */}
                                            {(!isStadium || isSelected) && seatId.replace(row.name, '')}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
