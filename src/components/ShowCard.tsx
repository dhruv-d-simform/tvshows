/**
 * ShowCard component for displaying TV show information
 * Used in search results and recently visited shows
 */

import { X } from 'lucide-react';
import type { TVShow } from '@/types';

interface ShowCardProps {
    show: Omit<TVShow, '_embedded'>;
    onNavigate: (showId: number) => void;
    onRemove?: (showId: number) => void;
    showRemoveButton?: boolean;
}

export function ShowCard({
    show,
    onNavigate,
    onRemove,
    showRemoveButton = false,
}: ShowCardProps) {
    const handleClick = () => {
        onNavigate(show.id);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onRemove) {
            onRemove(show.id);
        }
    };

    const imageUrl = show.image?.original || show.image?.medium;
    const rating = show.rating?.average;

    return (
        <div
            className="group relative cursor-pointer overflow-hidden rounded-lg border border-border bg-card shadow-md transition-all hover:shadow-xl"
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
            aria-label={`View details for ${show.name}`}
        >
            {/* Remove button */}
            {showRemoveButton && onRemove && (
                <button
                    onClick={handleRemove}
                    className="absolute right-2 top-2 z-10 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label={`Remove ${show.name} from recently visited`}
                >
                    <X className="h-4 w-4" />
                </button>
            )}

            {/* Image */}
            <div className="aspect-2/3 overflow-hidden bg-muted">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={show.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <span className="text-sm">No image</span>
                    </div>
                )}
            </div>

            {/* Content - Each detail on new line */}
            <div className="p-4 space-y-1">
                {/* Title */}
                <h3 className="truncate text-lg font-semibold text-card-foreground">
                    {show.name}
                </h3>

                {/* Year */}
                {show.premiered && (
                    <p className="truncate text-sm text-muted-foreground">
                        {new Date(show.premiered).getFullYear()}
                    </p>
                )}

                {/* Genres */}
                {show.genres && show.genres.length > 0 && (
                    <p className="truncate text-sm text-muted-foreground">
                        {show.genres.join(', ')}
                    </p>
                )}

                {/* Rating and Language on same line */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {rating && (
                        <span className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            {rating}
                        </span>
                    )}
                    {show.language && <span>{show.language}</span>}
                </div>
            </div>
        </div>
    );
}
