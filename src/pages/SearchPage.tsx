/**
 * SearchPage - Main search interface for TV shows
 * Allows users to search for shows and view results
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Header } from '@/components/Header';
import { ShowCard } from '@/components/ShowCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSearchShows } from '@/api/search';

export function SearchPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('q') || '';
    const [searchQuery, setSearchQuery] = useState(queryParam);

    const {
        data: results,
        isLoading,
        isError,
        error,
    } = useSearchShows(searchQuery);

    // Update search query when URL param changes
    useEffect(() => {
        setSearchQuery(queryParam);
    }, [queryParam]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setSearchParams({ q: query });
    };

    const handleNavigateToShow = (showId: number) => {
        navigate(`/show/${showId}`);
    };

    return (
        <div className="min-h-screen">
            {/* Header with Search */}
            <Header initialQuery={searchQuery} onSearch={handleSearch} />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Page Title */}
                <header className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-white">
                        Search Results
                        {searchQuery && ` for "${searchQuery}"`}
                    </h1>
                </header>

                {/* Search Results */}
                <main>
                    {isLoading && searchQuery && (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <Skeleton className="aspect-2/3 w-full rounded-lg" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            ))}
                        </div>
                    )}

                    {isError && (
                        <Alert
                            variant="destructive"
                            className="max-w-lg mx-auto"
                        >
                            <AlertDescription>
                                {error instanceof Error
                                    ? error.message
                                    : 'Failed to search. Please try again.'}
                            </AlertDescription>
                        </Alert>
                    )}

                    {!isLoading &&
                        !isError &&
                        results &&
                        results.length === 0 &&
                        searchQuery && (
                            <Alert className="max-w-lg mx-auto border-gray-700 bg-gray-800">
                                <AlertDescription className="text-gray-300">
                                    No results found for "{searchQuery}". Try a
                                    different search term.
                                </AlertDescription>
                            </Alert>
                        )}

                    {!isLoading &&
                        !isError &&
                        results &&
                        results.length > 0 && (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {results.map((result) => (
                                    <ShowCard
                                        key={result.show.id}
                                        show={result.show}
                                        onNavigate={handleNavigateToShow}
                                    />
                                ))}
                            </div>
                        )}

                    {!searchQuery && (
                        <Alert className="max-w-lg mx-auto border-gray-700 bg-gray-800">
                            <AlertDescription className="text-gray-300">
                                Start searching for your favorite TV shows
                            </AlertDescription>
                        </Alert>
                    )}
                </main>
            </div>
        </div>
    );
}
