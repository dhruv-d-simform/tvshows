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

/**
 * Strip HTML tags from summary text
 */
function stripHtml(html: string | null | undefined): string {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
}

/**
 * Truncate text to specified length
 */
function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
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

    const imageUrl = show.image?.medium || show.image?.original;
    const summary = stripHtml(show.summary);
    const rating = show.rating?.average;

    return (
        <div
            className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
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
            <div className="aspect-2/3 overflow-hidden bg-gray-100 dark:bg-gray-700">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={show.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        <span className="text-sm">No image</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {show.name}
                </h3>

                {/* Metadata */}
                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    {rating && (
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            ★ {rating}
                        </span>
                    )}
                    {show.premiered && (
                        <span>{new Date(show.premiered).getFullYear()}</span>
                    )}
                    {show.language && <span>{show.language}</span>}
                </div>

                {/* Genres */}
                {show.genres && show.genres.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                        {show.genres.slice(0, 3).map((genre) => (
                            <span
                                key={genre}
                                className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                )}

                {/* Summary */}
                {summary && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {truncate(summary, 120)}
                    </p>
                )}
            </div>
        </div>
    );
}
