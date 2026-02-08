'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

interface MovieCardProps {
    id: string | number;
    title: string;
    image: string;
    genre: string;
    rating?: number;
    votes?: string;
    isPromoted?: boolean;
    loading?: boolean;
}

export default function MovieCard({ id, title, image, genre, rating, votes, isPromoted, loading }: MovieCardProps) {
    if (loading) {
        return (
            <div className="flex flex-col gap-2 w-[220px]">
                <Skeleton className="h-[360px] w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        )
    }

    return (
        <Link href={`/events/${id}`} className="block group w-[220px] shrink-0">
            <div className="relative rounded-lg overflow-hidden mb-3">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-[360px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {isPromoted && (
                    <div className="absolute top-2 right-0 bg-red-600 text-white text-[10px] items-center font-bold px-2 py-0.5 rounded-l-sm z-10 uppercase tracking-wider">
                        Promoted
                    </div>
                )}
                {rating && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-[2px] p-2 flex items-center justify-between text-white">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-red-500 text-red-500" />
                            <span className="text-sm font-medium">{rating}/10</span>
                        </div>
                        <span className="text-xs text-gray-300">{votes} Votes</span>
                    </div>
                )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-red-500 transition-colors">
                {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {genre}
            </p>
        </Link>
    );
}
