'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function SubNavbar() {
    const pathname = usePathname();

    const links = [
        { name: 'Movies', href: '/movies' },
        { name: 'Stream', href: '/events' },
        { name: 'Events', href: '/events' },
        { name: 'Plays', href: '/events' },
        { name: 'Sports', href: '/sports' },
        { name: 'Activities', href: '/events' },
    ];

    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-gray-100 dark:border-slate-800 hidden md:block">
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
