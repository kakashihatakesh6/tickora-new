'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Play, Trophy, Mic2, Search, Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      name: 'Movies',
      icon: Play,
      href: '/events?category=MOVIE',
      color: 'bg-red-500',
      gradient: 'from-red-500 to-orange-500',
      description: 'Latest blockbusters & indie films'
    },
    {
      name: 'Sports',
      icon: Trophy,
      href: '/events?category=SPORT',
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Live matches & championships'
    },
    {
      name: 'Concerts',
      icon: Mic2,
      href: '/events?category=CONCERT',
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-pink-500',
      description: 'Live music performances'
    },
  ];

  const trendingEvents = [
    { id: 1, title: 'Neon City Festival', date: 'Mar 15, 2024', location: 'Downtown Arena', image: 'https://images.unsplash.com/photo-1459749411177-8c4750bb0e5f?q=80&w=2669&auto=format&fit=crop' },
    { id: 2, title: 'Tech Summit 2024', date: 'Apr 02, 2024', location: 'Convention Center', image: 'https://images.unsplash.com/photo-1540575467063-178a509371f7?q=80&w=2670&auto=format&fit=crop' },
    { id: 3, title: 'Basketball Finals', date: 'May 20, 2024', location: 'City Stadium', image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2669&auto=format&fit=crop' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-indigo-950 px-4 py-20 text-center text-white sm:px-6 lg:px-8 lg:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/90"></div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight sm:text-6xl"
          >
            Find Your Next <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Unforgettable Experience</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100"
          >
            Discover and book tickets for the hottest concerts, movies, and sports events happening around you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-10 max-w-xl"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for events, artists, or venues..."
                className="h-14 w-full rounded-full border-0 bg-white pl-12 pr-4 text-gray-900 shadow-xl placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-full bg-indigo-600 px-6 hover:bg-indigo-700">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Categories */}
        <div className="-mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {categories.map((cat, index) => (
            <Link key={cat.name} href={cat.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="relative overflow-hidden border-0 shadow-xl transition-shadow hover:shadow-2xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-5`}></div>
                  <CardContent className="flex flex-col items-center p-8 text-center">
                    <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${cat.color} text-white shadow-lg`}>
                      <cat.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{cat.name}</h3>
                    <p className="mt-2 text-sm text-gray-500">{cat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Trending Section */}
        <div className="mt-20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Trending Now</h2>
            <Link href="/events" className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
              View all events <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trendingEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="group h-full overflow-hidden border-0 bg-white shadow-md transition-all hover:shadow-xl">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4 rounded-lg bg-white/90 px-3 py-1 text-xs font-bold text-indigo-900 backdrop-blur-sm">
                      Selling Fast
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-2 h-4 w-4 text-indigo-500" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="mr-2 h-4 w-4 text-indigo-500" />
                        {event.location}
                      </div>
                    </div>
                    <Button className="mt-4 w-full bg-gray-50 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      Book Tickets
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/events" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              View all events <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
