'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function SubNavbar() {
    const pathname = usePathname();

    const links = [
        { name: 'Movies', href: '/events?category=MOVIE' },
        { name: 'Stream', href: '/events?category=STREAM' },
        { name: 'Events', href: '/events?category=CONCERT' },
        { name: 'Plays', href: '/events?category=PLAY' },
        { name: 'Sports', href: '/events?category=SPORT' },
        { name: 'Activities', href: '/events?category=ACTIVITY' },
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 hidden md:block">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-10 items-center justify-between text-xs sm:text-sm">
                    <div className="flex space-x-6">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors",
                                    pathname === link.href ? "text-indigo-600 font-medium" : "text-gray-700 dark:text-gray-300"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="flex space-x-4 text-gray-600 dark:text-gray-400">
                        <Link href="#" className="hover:text-indigo-600">ListYourShow</Link>
                        <Link href="#" className="hover:text-indigo-600">Corporates</Link>
                        <Link href="#" className="hover:text-indigo-600">Offers</Link>
                        <Link href="#" className="hover:text-indigo-600">Gift Cards</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
