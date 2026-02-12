'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User, Ticket, Menu, X, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import SubNavbar from './SubNavbar';
import { Input } from './ui/input';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('Mumbai');
    const [locationMenuOpen, setLocationMenuOpen] = useState(false);

    const cities = [
        'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad',
        'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Chandigarh'
    ];

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }

        const savedLocation = localStorage.getItem('selectedLocation');
        if (savedLocation) {
            setSelectedLocation(savedLocation);
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLocationSelect = (city: string) => {
        setSelectedLocation(city);
        localStorage.setItem('selectedLocation', city);
        setLocationMenuOpen(false);
        // Refresh the page or trigger a data fetch update
        window.location.reload();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
        router.refresh();
    };

    if (!mounted) return null;

    const navLinks = [
        { name: 'Movies', href: '/events?category=MOVIE' },
        { name: 'Sports', href: '/events?category=SPORT' },
        { name: 'Events', href: '/events?category=CONCERT' },
    ];

    return (
        <>
            <div className="flex flex-col fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black">
                <nav
                    className={cn(
                        "transition-all duration-300 ease-in-out border-b border-gray-200 dark:border-slate-800",
                        isScrolled
                            ? "bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-sm"
                            : "bg-white dark:bg-black"
                    )}
                >
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
                        {/* Logo and Search */}
                        <div className="flex items-center gap-6 flex-1">
                            <Link href="/" className="flex items-center gap-2 group shrink-0">
                                <div className="bg-red-500 rounded-sm p-1 text-white">
                                    <span className="font-bold text-lg leading-none italic">tk</span>
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-600 italic">
                                    tickora
                                </span>
                            </Link>

                            {/* Search Bar */}
                            <div className="hidden md:flex flex-1 max-w-xl relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search for Movies, Events, Plays, Sports and Activities"
                                    className="pl-10 h-10 w-full rounded-md border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-red-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-4 shrink-0">
                            {/* Location Selector */}
                            <div className="hidden md:flex items-center relative gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-red-500 transition-colors">
                                <div
                                    className="flex items-center gap-1"
                                    onClick={() => setLocationMenuOpen(!locationMenuOpen)}
                                >
                                    {selectedLocation} <ChevronDown size={14} className={cn("transition-transform", locationMenuOpen && "rotate-180")} />
                                </div>

                                <AnimatePresence>
                                    {locationMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute left-0 mt-2 top-full w-56 bg-white dark:bg-black border border-gray-100 dark:border-slate-800 rounded-xl shadow-lg z-[60] py-2 max-h-80 overflow-y-auto"
                                        >
                                            <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-800 mb-2">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Popular Cities</p>
                                            </div>
                                            {cities.map((city) => (
                                                <button
                                                    key={city}
                                                    onClick={() => handleLocationSelect(city)}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2 text-sm transition-colors hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600",
                                                        selectedLocation === city ? "text-red-600 font-bold bg-red-50/50 dark:bg-red-900/5" : "text-gray-700 dark:text-gray-300"
                                                    )}
                                                >
                                                    {city}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <ThemeToggle />

                            {user ? (
                                <div className="hidden md:flex items-center gap-4">
                                    <div className="relative">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2 pl-2 pr-1 rounded-full border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        >
                                            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                                                {user.name}
                                            </span>
                                            <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", userMenuOpen && "rotate-180")} />
                                        </Button>

                                        <AnimatePresence>
                                            {userMenuOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-black border border-gray-100 dark:border-slate-800 rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-black/50 p-1 overflow-hidden pointer-events-auto"
                                                >
                                                    <div className="px-3 py-2 border-b border-gray-50 dark:border-gray-800">
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user.email || user.name}</p>
                                                    </div>
                                                    <Link href="/bookings">
                                                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left">
                                                            <Ticket className="h-4 w-4" />
                                                            My Bookings
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Sign out
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/login" className="hidden md:block">
                                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white rounded-md px-6 h-8 text-xs font-medium">
                                        Sign in
                                    </Button>
                                </Link>
                            )}

                            {/* Hamburger Menu */}
                            <div className="flex items-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="text-gray-700 dark:text-gray-200"
                                >
                                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Sub Navbar (Categories) - Desktop Only */}
                    <SubNavbar />
                </nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-black/95 backdrop-blur-lg overflow-hidden shadow-xl"
                        >
                            <div className="px-4 pt-2 pb-6 space-y-2">
                                <div className="mb-4 md:hidden">
                                    <Input
                                        type="text"
                                        placeholder="Search..."
                                        className="h-10 w-full"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                                                setMobileMenuOpen(false);
                                            }
                                        }}
                                    />
                                </div>

                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-3 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                {/* Mobile SubNavbar links if needed, or kept simple */}
                                <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2">
                                    {user ? (
                                        <>
                                            <div className="flex items-center gap-3 px-3 py-3">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                            <Link
                                                href="/bookings"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            >
                                                <Ticket className="h-4 w-4" />
                                                My Bookings
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setMobileMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sign out
                                            </button>
                                        </>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                                <Button variant="outline" className="w-full justify-center rounded-xl">
                                                    Log in
                                                </Button>
                                            </Link>
                                            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                                <Button className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                                                    Sign up
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Spacer for fixed navbar: 64px on mobile, 104px (64+40) on desktop */}
            <div className="h-16 md:h-[104px] w-full" aria-hidden="true" />
        </>
    );
}
