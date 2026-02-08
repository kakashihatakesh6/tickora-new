'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import MovieCard from './MovieCard';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

export default function RecommendedMovies() {
    // Mock Data mimicking BookMyShow
    const movies = [
        {
            id: 101,
            title: 'Couture',
            image: 'https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
            genre: 'Drama/Thriller',
            rating: 8.7,
            votes: '1.5K',
            isPromoted: true,
        },
        {
            id: 102,
            title: 'Mardaani 3',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OC40LzEwICAzLjJLIFZvdGVz,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00384234-sqxlpkdrls-portrait.jpg',
            genre: 'Action/Crime',
            rating: 8.4,
            votes: '3.2K',
            isPromoted: false,
        },
        {
            id: 103,
            title: 'Article 370',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OS4xLzEwICAxMEsgVm90ZXM%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00384444-qlnqjpkfpj-portrait.jpg',
            genre: 'Drama/Political',
            rating: 9.1,
            votes: '10K',
            isPromoted: false,
        },
        {
            id: 104,
            title: 'Dune: Part Two',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OS8xMCBMIEsgVm90ZXM%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00331565-zeqwcshjzd-portrait.jpg',
            genre: 'Action/Adventure/Sci-Fi',
            rating: 9.0,
            votes: '100K+',
            isPromoted: true,
        },
        {
            id: 105,
            title: 'Kung Fu Panda 4',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OC4yLzEwICA1IEsgVm90ZXM%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00386708-cczldbnsmy-portrait.jpg',
            genre: 'Comedy/Adventure',
            rating: 8.2,
            votes: '5K',
            isPromoted: false,
        },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recommended Movies</h2>
                <Link href="/events?category=MOVIE" className="flex items-center text-sm font-medium text-red-500 hover:underline">
                    See All <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            <Carousel
                opts={{
                    align: "start",
                    loop: false,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-6">
                    {movies.map((movie) => (
                        <CarouselItem key={movie.id} className="pl-6 basis-auto">
                            <MovieCard {...movie} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 -translate-x-1/2 h-10 w-10 border-none bg-gray-200/80 hover:bg-gray-300 dark:bg-gray-800/80 dark:hover:bg-gray-700" />
                <CarouselNext className="right-0 translate-x-1/2 h-10 w-10 border-none bg-gray-200/80 hover:bg-gray-300 dark:bg-gray-800/80 dark:hover:bg-gray-700" />
            </Carousel>
        </div>
    );
}
