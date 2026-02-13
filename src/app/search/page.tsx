'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import api, { ApiResponse } from '@/lib/api';

import { Loader2 } from 'lucide-react';

interface SearchResult {
    id: number;
    title: string;
    description: string;
    image_url: string;
    event_type: string;
    city: string;
    venue: string;
    price: number;
    dateTime?: string;
    date_time?: string;
}

function ResultCard({ item }: { item: SearchResult }) {
    // const dateStr = item.dateTime || item.date_time || new Date().toISOString();
    // const date = new Date(dateStr);


    // const dateFormatted = date.toLocaleDateString('en-GB', {
    //     weekday: 'short',
    //     day: 'numeric',
    //     month: 'short'
    // });


    // Map event types to their respective routes
    const routeMap: Record<string, string> = {
        'MOVIE': `/movies/${item.id}`,
        'SPORT': `/sports/${item.id}`,
        'EVENT': `/events/${item.id}`,
        'CONCERT': `/events/${item.id}`
    };
    const href = routeMap[item.event_type] || `/events/${item.id}`;

    return (
        <Link href={href} className="group block h-full">
            <div className="flex flex-col h-full rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-l-sm shadow-lg">
                        {item.event_type}
                    </div>
                </div>
                <div className="p-3 flex flex-col flex-grow space-y-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-2 leading-tight group-hover:text-red-500 transition-colors">
                        {item.title}
                    </h3>
                    <div className="flex items-start text-xs text-gray-500 dark:text-gray-400">
                        <span className="line-clamp-1">{item.venue}: {item.city}</span>
                    </div>
                    <div className="pt-1 mt-auto font-medium text-sm text-gray-900 dark:text-gray-100">
                        ₹ {item.price} onwards
                    </div>
                </div>
            </div>
        </Link>
    );
}

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(true);
    // const [selectedCity, setSelectedCity] = useState('Mumbai');


    useEffect(() => {
        const city = localStorage.getItem('selectedLocation') || 'Mumbai';
        // setSelectedCity(city);


        const fetchResults = async () => {
            if (!query) {
                setResults([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await api.get('/search', {
                    q: query,
                    city: city
                }) as ApiResponse<SearchResult[]>;
                setResults(res.data || []);

            } catch (error) {
                console.error('Failed to fetch search results', error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [query]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-red-500 mb-4" />
                <p className="text-gray-500">Searching for matches...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                {query ? `Search results for "${query}"` : 'Search'}
            </h1>

            {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {results.map((item, idx) => (
                        <ResultCard key={`${item.event_type}-${item.id}-${idx}`} item={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-900 dark:text-slate-100 font-medium mb-2">No results found for &quot;{query}&quot;</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Try searching for something else like &quot;Inception&quot;, &quot;Coldplay&quot;, or &quot;Cricket&quot;</p>
                </div>

            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <main className="min-h-screen bg-background pt-8 pb-16">
            <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-500" /></div>}>
                <SearchResults />
            </Suspense>
        </main>
    );
}
