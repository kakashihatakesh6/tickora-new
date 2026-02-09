'use client';

import HeroCarousel from '@/components/HeroCarousel';
import RecommendedMovies from '@/components/RecommendedMovies';
import RecommendedSports from '@/components/RecommendedSports';
import RecommendedEvents from '@/components/RecommendedEvents';
import SubNavbar from '@/components/SubNavbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Hero Section */}
      <HeroCarousel />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Recommended Movies */}
        <RecommendedMovies />

        {/* Recommended Sports */}
        <RecommendedSports />

        {/* Recommended Events */}
        <RecommendedEvents />

        {/* Add more sections here as needed, like "The Best of Live Events", etc. */}

        <div className="mt-12 mb-8">
          <img
            src="https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-1440,h-120/lead-in-v3-collection-202102040828.png"
            alt="Ad banner"
            className="w-full rounded-lg"
          />
        </div>
      </div>
    </main>
  );
}
