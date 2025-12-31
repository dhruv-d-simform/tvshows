import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ShowCard } from '@/components/ShowCard';
import { Header } from '@/components/Header';
import { useSearchShows } from '@/api/search';
import type { TVShow } from '@/types';

export function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    const navigate = useNavigate();
    const { data: results = [], isLoading, error } = useSearchShows(query);

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
        // Update URL without navigating
        const newParams = new URLSearchParams(searchParams);
        newParams.set('q', searchQuery);
        setSearchParams(newParams);
    };

    const handleShowClick = (show: TVShow) => {
        navigate(`/show/${show.id}`);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header onSearch={handleSearch} initialValue={query} />

            {/* Results */}
            <main className="container mx-auto px-4 py-6">
                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Searching...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-500">Error: {error.message}</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-2 gap-y-6">
                        {results.map((show) => (
                            <ShowCard
                                key={show.id}
                                show={show}
                                onClick={() => handleShowClick(show)}
                            />
                        ))}
                    </div>
                ) : query ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            No results found for "{query}"
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            Search for TV shows above
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
