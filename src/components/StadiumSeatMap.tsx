'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StadiumSeatMapProps {
    occupiedSeats: string[];
    selectedSeats: string[];
    onSeatSelect: (seatId: string, price: number, tier: string) => void;
    basePrice: number;
}



export default function StadiumSeatMap({
    occupiedSeats,
    selectedSeats,
    onSeatSelect,
    basePrice
}: StadiumSeatMapProps) {


    // Define blocks for the circular stadium
    // We'll use SVG to draw arc segments.
    // Inner ring: Blocks A-J
    // Outer ring: Blocks K-R (Just an example distribution)
    const blocks = useMemo(() => {
        // Helper to create arc path
        // This is a simplified representation. In a real app, we'd calculate precise paths.
        // For now, we will use a CSS-based approach with rotation for cleaner code if possible,
        // OR a simple mapping of pre-calculated positions.

        // Let's try a CSS rotation approach for a perfect circle of blocks.
        const blocksList = [
            { id: 'BLOCK A', tier: 'PREMIUM', color: 'bg-orange-300', priceMult: 2 },
            { id: 'BLOCK B', tier: 'PREMIUM', color: 'bg-orange-300', priceMult: 2 },
            { id: 'BLOCK C', tier: 'PREMIUM', color: 'bg-orange-300', priceMult: 2 },
            { id: 'BLOCK D', tier: 'PREMIUM', color: 'bg-orange-300', priceMult: 2 },
            { id: 'BLOCK E', tier: 'PREMIUM', color: 'bg-orange-300', priceMult: 2 },
            { id: 'BLOCK F', tier: 'PREMIUM', color: 'bg-orange-300', priceMult: 2 },
            { id: 'BLOCK G', tier: 'PREMIUM', color: 'bg-orange-300', priceMult: 2 },
            { id: 'BLOCK H', tier: 'PREMIUM', color: 'bg-orange-300', priceMult: 2 },
            { id: 'BLOCK I', tier: 'STANDARD', color: 'bg-blue-300', priceMult: 1 },
            { id: 'BLOCK J', tier: 'STANDARD', color: 'bg-blue-300', priceMult: 1 },
            { id: 'BLOCK K', tier: 'STANDARD', color: 'bg-blue-300', priceMult: 1 },
            { id: 'BLOCK L', tier: 'STANDARD', color: 'bg-blue-300', priceMult: 1 },
            { id: 'BLOCK M', tier: 'STANDARD', color: 'bg-blue-300', priceMult: 1 },
            { id: 'BLOCK N', tier: 'STANDARD', color: 'bg-blue-300', priceMult: 1 },
            { id: 'BLOCK O', tier: 'STANDARD', color: 'bg-blue-300', priceMult: 1 },
            { id: 'BLOCK P', tier: 'STANDARD', color: 'bg-blue-300', priceMult: 1 },
            { id: 'BLOCK Q', tier: 'STANDARD', color: 'bg-blue-300', priceMult: 1 },
            { id: 'BLOCK R', tier: 'STANDARD', color: 'bg-blue-300', priceMult: 1 },
        ];

        return blocksList.map(b => ({
            ...b,
            price: basePrice * b.priceMult
        }));
    }, [basePrice]);

    return (
        <div className="flex flex-col items-center w-full select-none justify-center py-10">

            {/* Stadium Container */}
            <div className="relative w-[600px] h-[600px] rounded-full border-4 border-gray-100 flex items-center justify-center bg-gray-50 shadow-2xl overflow-hidden">

                {/* Field (Center) */}
                <div className="absolute w-[250px] h-[250px] bg-green-100 rounded-full border-2 border-green-200 z-10 flex flex-col items-center justify-center shadow-inner">
                    <div className="w-[80px] h-[120px] bg-yellow-50 border border-yellow-200 rounded-sm mb-2 opacity-60"></div>
                    <span className="text-green-700 font-bold tracking-widest text-sm opacity-50">CRICKET</span>
                </div>

                {/* Blocks Ring */}
                {/* We can use absolute positioning with rotation transform */}
                <div className="absolute w-full h-full">
                    {blocks.map((block, index) => {
                        const totalBlocks = blocks.length;
                        const rotationStep = 360 / totalBlocks;
                        const rotation = index * rotationStep;

                        const isOccupied = occupiedSeats.includes(block.id);
                        const isSelected = selectedSeats.includes(block.id);

                        return (
                            <div
                                key={block.id}
                                className="absolute top-0 left-1/2 w-[80px] h-[180px] origin-bottom-center -ml-[40px]"
                                style={{
                                    transform: `rotate(${rotation}deg) translateY(0px)`,
                                    transformOrigin: '50% 300px' // Center of the 600px circle
                                }}
                            >
                                <button
                                    onClick={() => !isOccupied && onSeatSelect(block.id, block.price, block.tier)}
                                    disabled={isOccupied}
                                    className={cn(
                                        "w-full h-full flex flex-col items-center justify-start pt-4 transition-all duration-300",
                                        "hover:brightness-110",
                                        isOccupied ? "bg-gray-200 cursor-not-allowed" :
                                            isSelected ? "bg-purple-600 z-20 scale-110 shadow-lg" : `${block.color} opacity-80 hover:opacity-100`,
                                        // Shape: Wedge-like using clip-path or simple border-radius trickery?
                                        // For simplicity, let's use a trapezoid or just a rectangle that is rotated.
                                        // Making it wedge-shaped with CSS clip-path is better.
                                    )}
                                    style={{
                                        // Simple wedge clip path
                                        clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
                                        borderRadius: '5px'
                                    }}
                                    title={`${block.id} - ₹${block.price}`}
                                >
                                    <span
                                        className={cn(
                                            "font-bold text-xs tracking-tighter transform rotate-180 writing-mode-vertical",
                                            isSelected ? "text-white" : "text-gray-700"
                                        )}
                                        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                                    >
                                        {block.id.replace('BLOCK ', '')}
                                    </span>
                                    {isSelected && <Check className="w-4 h-4 text-white mt-2" />}
                                </button>
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-200"></div>
                    Occupied
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-300"></div>
                    Premium (₹{basePrice * 2})
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-300"></div>
                    Standard (₹{basePrice})
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-purple-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                    </div>
                    Selected
                </div>
            </div>
        </div>
    );
}
