'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import api, { ApiResponse } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

interface Event {
    id: number;
    title: string;
    description: string;
    event_type: string;
    city: string;
    venue: string;
    date_time: string;
    dateTime?: string; // Fallback
    price: number;
    image_url: string;
    category?: string;
}

const CATEGORIES = ['Concert', 'Comedy', 'Theater', 'Festival', 'Workshop', 'Exhibition', 'Conference', 'Meetup'];

function FilterSection({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-100 dark:border-slate-800/60 py-4">
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

function EventCard({ event }: { event: Event }) {
    // Handle both date keys just in case
    const dateStr = event.dateTime || event.date_time || new Date().toISOString();
    const date = new Date(dateStr);

    // Format: "Wed, 11 Feb onwards"
    const dateFormatted = date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });

    return (
        <Link href={`/events/${event.id}`} className="group block h-full">
            <div className="flex flex-col h-full rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800/50">
                {/* Image Container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay Date */}
                    <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm text-white px-3 py-2 text-xs font-medium">
                        {dateFormatted} onwards
                    </div>

                    {/* Event Type Tag */}
                    {event.event_type && (
                        <div className="absolute top-3 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-l-sm shadow-lg">
                            {event.event_type}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-grow space-y-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-2 leading-tight group-hover:text-red-500 transition-colors">
                        {event.title}
                    </h3>

                    <div className="flex items-start text-xs text-slate-500 dark:text-slate-400">
                        <span className="line-clamp-1">{event.venue}: {event.city}</span>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        {event.category || event.event_type}
                    </div>

                    <div className="pt-1 mt-auto font-medium text-sm text-gray-900 dark:text-gray-100">
                        ₹ {event.price} onwards
                    </div>
                </div>
            </div>
        </Link>
    );
}

function EventsPageContent() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [selectedCity, setSelectedCity] = useState('Mumbai');

    useEffect(() => {
        const city = localStorage.getItem('selectedLocation') || 'Mumbai';
        setSelectedCity(city);

        const fetchEvents = async () => {
            setLoading(true);
            try {
                const res = await api.get('/events', {
                    q: query || undefined,
                    city: city
                }) as ApiResponse<Event[]>;
                setEvents(res.data || []);

            } catch (error) {
                console.error('Failed to fetch events', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [query]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0 bg-white dark:bg-black lg:sticky lg:top-24 hidden lg:block rounded-2xl border border-gray-100 dark:border-slate-800 p-4 shadow-sm">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                </div>

                <div className="bg-white dark:bg-black">
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
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                        {query ? `Search results for "${query}"` : `Events In ${selectedCity}`}
                    </h1>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                        {events.length === 0 && (
                            <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-slate-900 dark:text-slate-100 font-medium mb-1">No events found in {selectedCity}.</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Try changing your location or category filters.</p>
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

export default function EventsPage() {
    return (
        <main className="min-h-screen bg-background pt-8 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <Suspense fallback={<div>Loading...</div>}>
                    <EventsPageContent />
                </Suspense>
            </div>
        </main>
    )
}
