'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';

const heroItems = [
    {
        id: 1,
        image: 'https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', // Example valid looking URL
        title: 'Wicked',
        description: 'The Musical',
    },
    {
        id: 2,
        image: 'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
        title: 'Laapataa Ladies',
        description: 'In Cinemas Now',
    },
    {
        id: 3,
        image: 'https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        title: 'Dune: Part Two',
        description: 'Experience it in IMAX',
    },
];

export default function HeroCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );

    return (
        <div className="w-full bg-gray-100 dark:bg-gray-900 py-2">
            <Carousel
                plugins={[plugin.current]}
                className="w-full max-w-[1440px] mx-auto px-0 md:px-4"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                opts={{
                    loop: true,
                    align: "start"
                }}
            >
                <CarouselContent className="">
                    {heroItems.map((item) => (
                        <CarouselItem key={item.id} className="">
                            <div className="">
                                <Card className="border-0 rounded-none md:rounded-lg overflow-hidden shadow-none">
                                    <CardContent className="flex aspect-[1240/300] items-center justify-center p-0 relative">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 h-12 w-12 hidden md:flex bg-black/30 hover:bg-black/50 border-none text-white" />
                <CarouselNext className="right-4 h-12 w-12 hidden md:flex bg-black/30 hover:bg-black/50 border-none text-white" />
            </Carousel>
        </div>
    );
}
