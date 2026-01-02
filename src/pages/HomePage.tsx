/**
 * HomePage - Display recently visited TV shows
 * Shows list of shows the user has viewed recently from local storage
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '@/components/Header';
import { ShowCard } from '@/components/ShowCard';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
        <div className="min-h-screen">
            {/* Header with Search */}
            <Header />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Page Title */}
                <header className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-white">
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
                            <Alert className="mx-auto max-w-lg border-gray-700 bg-gray-800">
                                <AlertTitle className="text-white">
                                    No recently visited shows yet
                                </AlertTitle>
                                <AlertDescription className="text-gray-400 justify-items-center">
                                    Start exploring TV shows using the search
                                </AlertDescription>
                            </Alert>
                            <Button
                                onClick={() => navigate('/search')}
                                className="mt-6"
                                size="lg"
                            >
                                Go to Search
                            </Button>
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
