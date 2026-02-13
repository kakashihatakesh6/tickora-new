'use client';

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
    basePath?: string;
}

export default function MovieCard({ id, title, image, genre, rating, votes, isPromoted, loading, basePath = '/movies' }: MovieCardProps) {
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
        <Link href={`${basePath}/${id}`} className="block group w-[210px] sm:w-[220px] shrink-0">
            <div className="relative rounded-xl overflow-hidden mb-4 shadow-sm group-hover:shadow-2xl group-hover:shadow-red-500/10 transition-all duration-300">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                />

                {isPromoted && (
                    <div className="absolute top-3 right-0 bg-red-600 text-white text-[10px] items-center font-bold px-2 py-0.5 rounded-l-sm z-10 uppercase tracking-widest shadow-lg">
                        Promoted
                    </div>
                )}
                {rating && (
                    <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md p-3 flex items-center justify-between text-white border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                            <Star className="h-4 w-4 fill-red-500 text-red-500" />
                            <span className="text-sm font-bold">{rating}/10</span>
                        </div>
                        <span className="text-[10px] text-slate-300 uppercase font-medium tracking-tight">{votes ? votes : 'N/A'} votes</span>
                    </div>
                )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-red-500 transition-colors leading-tight mb-1">
                {title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate font-medium">
                {genre}
            </p>
        </Link>
    );
}
