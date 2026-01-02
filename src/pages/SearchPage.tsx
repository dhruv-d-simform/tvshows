/**
 * SearchPage - Main search interface for TV shows
 * Allows users to search for shows and view results
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Header } from '@/components/Header';
import { ShowCard } from '@/components/ShowCard';
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
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
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
                        <div className="text-center text-gray-400">
                            <p className="text-lg">Searching...</p>
                        </div>
                    )}

                    {isError && (
                        <div className="text-center text-red-400">
                            <p className="text-lg">
                                Error:{' '}
                                {error instanceof Error
                                    ? error.message
                                    : 'Failed to search'}
                            </p>
                        </div>
                    )}

                    {!isLoading &&
                        !isError &&
                        results &&
                        results.length === 0 &&
                        searchQuery && (
                            <div className="text-center text-gray-400">
                                <p className="text-lg">
                                    No results found for "{searchQuery}"
                                </p>
                                <p className="mt-2 text-sm">
                                    Try a different search term
                                </p>
                            </div>
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
                        <div className="text-center text-gray-400">
                            <p className="text-lg">
                                Start searching for your favorite TV shows
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
