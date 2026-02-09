'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Sport {
    id: number;
    title: string;
    description: string;
    category: string;
    city: string;
    venue: string;
    dateTime: string; // Adjusted to match backend response usually (date_time or dateTime, need to verify)
    date_time?: string; // Fallback
    price: number;
    image_url: string;
    event_type: string;
}

const CATEGORIES = ['Cricket', 'Running', 'Cycling', 'Sailing', 'Walking', 'Mixed Martial Arts', 'Motorsports', 'Shooting'];

function FilterSection({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-100 dark:border-gray-800 py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left mb-2 group"
            >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-red-500 transition-colors flex items-center gap-2">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {title}
                </span>
                <span className="text-xs text-gray-400 font-normal cursor-pointer hover:underline">Clear</span>
            </button>
            {isOpen && (
                <div className="pt-2 animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}

function SportCard({ sport }: { sport: Sport }) {
    // Handle both date keys just in case
    const dateStr = sport.dateTime || sport.date_time || new Date().toISOString();
    const date = new Date(dateStr);

    // Format: "Wed, 11 Feb onwards"
    const dateFormatted = date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });

    return (
        <Link href={`/sports/${sport.id}`} className="group block h-full">
            <div className="flex flex-col h-full rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-900">
                {/* Image Container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-100">
                    <Image
                        src={sport.image_url}
                        alt={sport.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay Date */}
                    <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm text-white px-3 py-2 text-xs font-medium">
                        {dateFormatted} onwards
                    </div>

                    {/* Promoted Tag (Random for demo) */}
                    {Math.random() > 0.7 && (
                        <div className="absolute top-2 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                            Promoted
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-grow space-y-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-2 leading-tight group-hover:text-red-500 transition-colors">
                        {sport.title}
                    </h3>

                    <div className="flex items-start text-xs text-gray-500 dark:text-gray-400">
                        <span className="line-clamp-1">{sport.venue}: {sport.city}</span>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {sport.category}
                    </div>

                    <div className="pt-1 mt-auto font-medium text-sm text-gray-900 dark:text-gray-100">
                        ₹ {sport.price} onwards
                    </div>
                </div>
            </div>
        </Link>
    );
}

function SportsPageContent() {
    const [sports, setSports] = useState<Sport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSports = async () => {
            setLoading(true);
            try {
                const res = await api.get('/sports');
                setSports(res.data || []);
            } catch (error) {
                console.error('Failed to fetch sports', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSports();
    }, []);

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0 bg-white dark:bg-black lg:sticky lg:top-24 hidden lg:block">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                </div>

                <div className="bg-white dark:bg-black rounded-lg">
                    <FilterSection title="Date" defaultOpen={true}>
                        <div className="space-y-3 px-1">
                            {['Today', 'Tomorrow', 'This Weekend'].map((label) => (
                                <Button
                                    key={label}
                                    variant="outline"
                                    className="w-full justify-start text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 text-sm h-8 font-normal"
                                >
                                    {label}
                                </Button>
                            ))}
                            <div className="flex items-center gap-2 pt-2">
                                <Checkbox id="date-range" />
                                <label htmlFor="date-range" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">Date Range</label>
                            </div>
                        </div>
                    </FilterSection>

                    <FilterSection title="Categories">
                        <div className="space-y-2 px-1">
                            {CATEGORIES.slice(0, 5).map((cat) => (
                                <div key={cat} className="flex items-center gap-2">
                                    <Checkbox id={`cat-${cat}`} />
                                    <label htmlFor={`cat-${cat}`} className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer w-full hover:text-red-500">{cat}</label>
                                </div>
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection title="More Filters">
                        <div className="px-1 text-sm text-gray-400">Additional filters...</div>
                    </FilterSection>

                    <FilterSection title="Price">
                        <div className="px-1 text-sm text-gray-400">Price range...</div>
                    </FilterSection>

                    <Button variant="outline" className="w-full mt-6 text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600">
                        Browse by Venues
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 w-full">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sports In Mumbai</h1>

                    {/* Category Chips */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {CATEGORIES.map((cat) => (
                            <Badge
                                key={cat}
                                variant="outline"
                                className="rounded-full px-4 py-1.5 text-xs font-normal cursor-pointer hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors bg-white dark:bg-gray-900"
                            >
                                {cat}
                            </Badge>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sports.map((sport) => (
                            <SportCard key={sport.id} sport={sport} />
                        ))}
                        {sports.length === 0 && (
                            <div className="col-span-full py-20 text-center text-gray-500">
                                No sports events found.
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Mobile Filter Button (visible only on small screens) */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <Button className="rounded-full shadow-xl px-6 bg-red-600 hover:bg-red-700 text-white">
                    <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                </Button>
            </div>
        </div>
    );
}

export default function SportsPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black/50 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <Suspense fallback={<div>Loading...</div>}>
                    <SportsPageContent />
                </Suspense>
            </div>
        </main>
    )
}
