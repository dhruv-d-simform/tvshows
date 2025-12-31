import { useNavigate } from 'react-router';
import { ShowCard } from '@/components/ShowCard';
import { Header } from '@/components/Header';
import { useRecentlyVisitedShows } from '@/utils/recentlyVisited';
import type { TVShow } from '@/types';

export function HomePage() {
    const navigate = useNavigate();
    const { shows, removeShow } = useRecentlyVisitedShows();

    const handleShowClick = (show: TVShow) => {
        navigate(`/show/${show.id}`);
    };

    const handleRemove = (showId: number) => {
        removeShow(showId);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Search Bar - Link to Search */}
            <div className="border-b bg-muted/50">
                <div className="container mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate('/search')}
                        className="flex gap-2 max-w-md mx-auto w-full justify-center items-center px-4 py-2 border rounded-md hover:bg-muted transition-colors"
                    >
                        <span>🔍</span>
                        Search for TV shows...
                    </button>
                </div>
            </div>

            {/* Recently Visited */}
            <main className="container mx-auto px-4 py-6">
                <h2 className="text-xl font-semibold mb-4">Recently Visited</h2>
                {shows.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {shows.map((item) => (
                            <ShowCard
                                key={item.show.id}
                                show={item.show}
                                onClick={() => handleShowClick(item.show)}
                                onRemove={() => handleRemove(item.show.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            No recently visited shows yet.
                        </p>
                        <p className="text-muted-foreground">
                            Search for shows to get started!
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
