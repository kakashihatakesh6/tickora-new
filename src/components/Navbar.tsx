'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User, Ticket, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
                isScrolled
                    ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm border-gray-200 dark:border-gray-800"
                    : "bg-white/50 dark:bg-black/50 backdrop-blur-sm"
            )}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-indigo-600 rounded-lg p-1.5 text-white group-hover:bg-indigo-700 transition-colors">
                            <Ticket size={24} />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            TicketMaster
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="ml-10 hidden md:flex space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 relative",
                                    isActive(link.href)
                                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20"
                                        : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                )}
                            >
                                {link.name}
                                {isActive(link.href) && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mx-4"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {/* Desktop User Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link href="/bookings">
                                    <Button variant="ghost" size="sm" className="gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                                        <Ticket className="h-4 w-4" />
                                        My Bookings
                                    </Button>
                                </Link>

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
                                                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-black/50 p-1 overflow-hidden pointer-events-auto"
                                            >
                                                <div className="px-3 py-2 border-b border-gray-50 dark:border-gray-800">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user.email || user.name}</p>
                                                </div>
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
                            <div className="flex items-center gap-3">
                                <Link href="/login">
                                    <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 rounded-full px-6">
                                        Sign up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex md:hidden">
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

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-black/95 backdrop-blur-lg overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
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
        </nav>
    );
}
