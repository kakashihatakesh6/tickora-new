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
import Link from 'next/link';
import api, { ApiResponse } from '@/lib/api';

import { Button } from './ui/button';

interface HeroItem {
    id: number;
    image_url: string;
    title: string;
    description: string;
}

export default function HeroCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );
    const [heroItems, setHeroItems] = React.useState<HeroItem[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchHeroItems = async () => {
            try {
                // Fetch movies for hero carousel
                const res = await api.get('/movies') as ApiResponse<HeroItem[]>;
                // Take top 5
                setHeroItems(res.data.slice(0, 5));

            } catch (error) {
                console.error('Failed to fetch hero items', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHeroItems();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-[300px] md:h-[400px] bg-gray-200 dark:bg-gray-800 animate-pulse" />
        );
    }

    if (heroItems.length === 0) return null;

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
                                <Card className="border-0 rounded-none md:rounded-lg overflow-hidden shadow-none group relative">
                                    <CardContent className="flex aspect-[16/9] md:aspect-[21/9] items-center justify-center p-0 relative">
                                        <Link href={`/movies/${item.id}`} className="w-full h-full relative">
                                            <Image
                                                src={item.image_url}
                                                alt={item.title}
                                                fill
                                                className="object-cover object-center"
                                                priority
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                                            <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white max-w-2xl">
                                                <h2 className="text-3xl md:text-5xl font-bold mb-2">{item.title}</h2>
                                                <p className="text-lg md:text-xl text-gray-200 mb-4 line-clamp-2">{item.description}</p>
                                                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-6 rounded-xl">
                                                    Book Now
                                                </Button>
                                            </div>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 h-12 w-12 hidden md:flex bg-black/30 hover:bg-black/50 border-none text-white z-10" />
                <CarouselNext className="right-4 h-12 w-12 hidden md:flex bg-black/30 hover:bg-black/50 border-none text-white z-10" />
            </Carousel>
        </div>
    );
}
