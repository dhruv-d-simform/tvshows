/**
 * HomePage - Display recently visited TV shows
 * Shows list of shows the user has viewed recently from local storage
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ShowCard } from '@/components/ShowCard';
import {
    getRecentlyVisitedShows,
    removeRecentlyVisitedShow,
} from '@/utils/localStorage';
import type { RecentlyVisitedShow } from '@/types';

export function HomePage() {
    const navigate = useNavigate();
    const [recentShows, setRecentShows] = useState<RecentlyVisitedShow[]>([]);

    // Load recently visited shows on mount and set up listener
    useEffect(() => {
        loadRecentShows();

        // Listen for storage changes from other tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'tvshows_recently_visited') {
                loadRecentShows();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const loadRecentShows = () => {
        const shows = getRecentlyVisitedShows();
        setRecentShows(shows);
    };

    const handleNavigateToShow = (showId: number) => {
        navigate(`/show/${showId}`);
    };

    const handleRemoveShow = (showId: number) => {
        removeRecentlyVisitedShow(showId);
        loadRecentShows();
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="mb-2 text-4xl font-bold text-white">
                        Recently Visited Shows
                    </h1>
                    <p className="text-gray-400">
                        Shows you've viewed recently
                    </p>
                </header>

                {/* Content */}
                <main>
                    {recentShows.length === 0 ? (
                        <div className="text-center">
                            <p className="mb-4 text-lg text-gray-400">
                                No recently visited shows yet
                            </p>
                            <p className="text-sm text-gray-500">
                                Start exploring TV shows using the search
                            </p>
                            <button
                                onClick={() => navigate('/search')}
                                className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                            >
                                Go to Search
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {recentShows.map((item) => (
                                <ShowCard
                                    key={item.show.id}
                                    show={item.show}
                                    onNavigate={handleNavigateToShow}
                                    onRemove={handleRemoveShow}
                                    showRemoveButton={true}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
