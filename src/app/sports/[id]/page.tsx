'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api, { ApiResponse } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, ChevronLeft, Share2, ThumbsUp, AlertCircle, Lightbulb, Ticket, ChevronRight, Clock, MapPinned } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EventDetailsSkeleton } from '@/components/skeletons';

interface Sport {
    id: number;
    title: string;
    description: string;
    category: string;
    city: string;
    venue: string;
    date_time: string;
    price: number;
    available_seats: number;
    image_url: string;
    duration?: string;
    rating?: number;
    team1?: string;
    team2?: string;
    team1_flag?: string;
    team2_flag?: string;
    event_logo?: string;
    important_info?: string;
    you_should_know?: string[];
    terms_conditions?: string;
    interested_count?: number;
}

export default function SportDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [sport, setSport] = useState<Sport | null>(null);
    const [loading, setLoading] = useState(true);
    const [isInterested, setIsInterested] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showAllKnowItems, setShowAllKnowItems] = useState(false);

    useEffect(() => {
        const fetchSport = async () => {
            try {
                const res = await api.get(`/sports/${id}`) as ApiResponse<Sport>;
                setSport(res.data);

            } catch (error) {
                console.error('Failed to fetch sport', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSport();
    }, [id]);

    // const handleBook = () => {
    //     router.push(`/sports/${id}/shows`);
    // };


    const handleInterested = () => {
        setIsInterested(!isInterested);
        // TODO: Call API to update interested count
    };

    const formatInterestedCount = (count?: number) => {
        if (!count) return '0';
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
        }
        return count.toString();
    };

    if (loading) {
        return <EventDetailsSkeleton />;
    }

    if (!sport) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-black px-4 pt-20">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sport Event Not Found</h1>
                <Button onClick={() => router.push('/sports')}>Browse Sports</Button>
            </div>
        );
    }

    const hasTeams = sport.team1 && sport.team2;

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 sticky top-0 z-20 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Button
                        variant="ghost"
                        className="text-gray-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back
                    </Button>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Vibrant Event Banner */}
                        {hasTeams ? (
                            <Card className="overflow-hidden border-0 shadow-xl">
                                <div className="relative bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 p-8 text-white">
                                    {/* Event Logo/Branding */}
                                    {sport.event_logo && (
                                        <div className="absolute top-4 left-4 opacity-20">
                                            <Image src={sport.event_logo} alt="Event Logo" width={100} height={100} className="object-contain" />
                                        </div>
                                    )}

                                    {/* Title */}
                                    <div className="text-center mb-6">
                                        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">{sport.title}</h1>
                                    </div>

                                    {/* Teams Section */}
                                    <div className="flex items-center justify-center gap-8 mb-6">
                                        {/* Team 1 */}
                                        <div className="flex flex-col items-center">
                                            {sport.team1_flag && (
                                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-white p-2 shadow-lg mb-3">
                                                    <Image src={sport.team1_flag || ''} alt={sport.team1 || 'Team 1'} width={96} height={96} className="object-contain w-full h-full" />
                                                </div>
                                            )}
                                            <div className="bg-white text-gray-900 px-6 py-2 rounded-lg font-bold text-lg shadow-md">
                                                {sport.team1}
                                            </div>
                                        </div>

                                        {/* VS */}
                                        <div className="text-3xl md:text-4xl font-black text-yellow-300">VS</div>

                                        {/* Team 2 */}
                                        <div className="flex flex-col items-center">
                                            {sport.team2_flag && (
                                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-white p-2 shadow-lg mb-3">
                                                    <Image src={sport.team2_flag || ''} alt={sport.team2 || 'Team 2'} width={96} height={96} className="object-contain w-full h-full" />
                                                </div>
                                            )}
                                            <div className="bg-white text-gray-900 px-6 py-2 rounded-lg font-bold text-lg shadow-md">
                                                {sport.team2}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Match Details */}
                                    <div className="text-center space-y-2">
                                        <p className="text-yellow-300 font-bold text-lg">
                                            {(() => {
                                                try {
                                                    const d = new Date(sport.date_time);
                                                    if (isNaN(d.getTime())) return 'Date TBA';
                                                    return `${d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })} | ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
                                                } catch {

                                                    return 'Date TBA';
                                                }
                                            })()}
                                        </p>
                                        <p className="text-white/90 font-semibold text-base">
                                            {sport.venue}, {sport.city}
                                        </p>
                                    </div>

                                    {/* Decorative Elements */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-30"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500 rounded-full blur-3xl opacity-30"></div>
                                </div>
                            </Card>
                        ) : (
                            <Card className="overflow-hidden border-0 shadow-xl">
                                <div className="relative h-64 md:h-80">
                                    <Image
                                        src={sport.image_url}
                                        alt={sport.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h1 className="text-3xl md:text-4xl font-black mb-2">{sport.title}</h1>
                                        <p className="text-lg font-semibold">{sport.venue}, {sport.city}</p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Interest Tracker */}
                        <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <ThumbsUp className="w-4 h-4 text-green-600" />
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {formatInterestedCount(sport.interested_count)} are interested
                                    </span>
                                </div>
                                <Button
                                    variant={isInterested ? "secondary" : "outline"}
                                    size="sm"
                                    onClick={handleInterested}
                                    className={cn(
                                        "gap-2",
                                        isInterested && "bg-green-600 hover:bg-green-700 text-white"
                                    )}
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    {isInterested ? "Interested" : "I'm interested"}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* About The Event */}
                        <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About The Event</h2>
                                <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    <p className={cn(!showFullDescription && sport.description.length > 200 && "line-clamp-3")}>
                                        {sport.description}
                                    </p>
                                    {sport.description.length > 200 && (
                                        <button
                                            onClick={() => setShowFullDescription(!showFullDescription)}
                                            className="text-red-600 dark:text-red-500 font-semibold mt-2 hover:underline"
                                        >
                                            {showFullDescription ? 'Read Less' : 'Read More'}
                                        </button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Important Info */}
                        {sport.important_info && (
                            <Card className="border-0 bg-yellow-50 dark:bg-yellow-900/20">
                                <CardContent className="p-6">
                                    <div className="flex gap-3">
                                        <AlertCircle className="w-5 h-5 text-yellow-700 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-bold text-yellow-900 dark:text-yellow-200 mb-2">Important</h3>
                                            <p className="text-sm text-yellow-800 dark:text-yellow-300 leading-relaxed">
                                                {sport.important_info}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* You Should Know */}
                        {sport.you_should_know && sport.you_should_know.length > 0 && (
                            <Card className="border border-gray-200 dark:border-gray-800">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5 text-blue-600" />
                                        You Should Know
                                    </h2>
                                    <ul className="space-y-3">
                                        {sport.you_should_know.slice(0, showAllKnowItems ? undefined : 2).map((item, index) => (
                                            <li key={index} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                                                <span className="text-blue-600 dark:text-blue-500 mt-1">•</span>
                                                <span className="flex-1">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {sport.you_should_know.length > 2 && (
                                        <button
                                            onClick={() => setShowAllKnowItems(!showAllKnowItems)}
                                            className="text-red-600 dark:text-red-500 font-semibold mt-3 hover:underline text-sm"
                                        >
                                            {showAllKnowItems ? 'See Less' : 'See More'}
                                        </button>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* M-Ticket */}
                        <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Ticket className="w-5 h-5 text-purple-600" />
                                    M-Ticket
                                </h2>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                        <Ticket className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                                            Contactless Ticketing & Paperless Entry with M-ticket
                                        </p>
                                        <a href="#" className="text-red-600 dark:text-red-500 font-bold text-sm hover:underline transition-all">
                                            Learn More
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Terms & Conditions */}
                        {sport.terms_conditions && (
                            <Card className="border border-gray-200 dark:border-gray-800">
                                <CardContent className="p-4">
                                    <button className="w-full flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-2 transition-colors">
                                        <span className="font-semibold text-gray-900 dark:text-white">Terms & Conditions</span>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-24 shadow-xl">
                            <CardContent className="p-6 space-y-4">
                                {/* Event Details */}
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {(() => {
                                                    try {
                                                        const d = new Date(sport.date_time);
                                                        if (isNaN(d.getTime())) return 'TBA';
                                                        return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
                                                    } catch { return 'TBA'; }
                                                })()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {(() => {
                                                    try {
                                                        const d = new Date(sport.date_time);
                                                        if (isNaN(d.getTime())) return 'TBA';
                                                        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                                                    } catch { return 'TBA'; }
                                                })()}
                                            </p>
                                        </div>
                                    </div>

                                    {sport.duration && (
                                        <div className="flex items-start gap-3">
                                            <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{sport.duration}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3">
                                        <MapPinned className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Venue</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{sport.venue}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">City</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{sport.city}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            ₹{sport.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">onwards</span>
                                        </p>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-6 rounded-lg shadow-lg"
                                        onClick={() => router.push(`/sports/${id}/seats`)}
                                    >
                                        Book Now
                                    </Button>
                                </div>

                                {/* Additional Info */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Bookings are filling up fast for this match
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full gap-2"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Share
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
