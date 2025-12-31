import { useState } from 'react';
import { useNavigate } from 'react-router';
import { SearchBar } from '@/components/SearchBar';
import { ShowCard } from '@/components/ShowCard';
import { Header } from '@/components/Header';
import { useSearchShows } from '@/api/search';
import type { TVShow } from '@/types';

export function SearchPage() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { data: results = [], isLoading, error } = useSearchShows(query);

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
    };

    const handleShowClick = (show: TVShow) => {
        navigate(`/show/${show.id}`);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Search Bar */}
            <div className="border-b bg-muted/50">
                <div className="container mx-auto px-4 py-6">
                    <SearchBar onSearch={handleSearch} initialValue={query} />
                </div>
            </div>

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
