/**
 * EpisodeCard - Display episode information with hover tooltip
 */

import { useState } from 'react';
import { Star } from 'lucide-react';
import type { Episode } from '@/types';
import { stripHtml } from './utils';

interface EpisodeCardProps {
    episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const episodeImageUrl = episode.image?.original || episode.image?.medium;

    return (
        <div
            className="relative w-64 shrink-0 overflow-hidden rounded-lg border border-gray-700 bg-gray-700"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Episode Image */}
            <div className="aspect-video overflow-hidden bg-gray-600">
                {episodeImageUrl ? (
                    <img
                        src={episodeImageUrl}
                        alt={episode.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                        No image
                    </div>
                )}
            </div>

            {/* Episode Info */}
            <div className="p-3">
                <h5 className="mb-2 truncate font-semibold text-white">
                    {episode.name}
                </h5>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Ep {episode.number}</span>
                    {episode.runtime && (
                        <>
                            <span>•</span>
                            <span>{episode.runtime} mins</span>
                        </>
                    )}
                    {episode.rating?.average && (
                        <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {episode.rating.average}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Tooltip */}
            {isHovered && episode.summary && (
                <div className="absolute left-0 top-full z-10 mt-2 w-full rounded-lg border border-gray-600 bg-gray-800 p-3 shadow-xl">
                    <p className="text-xs text-gray-300">
                        {stripHtml(episode.summary)}
                    </p>
                </div>
            )}
        </div>
    );
}
