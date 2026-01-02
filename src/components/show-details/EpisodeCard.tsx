/**
 * EpisodeCard - Display episode information with hover tooltip
 */

import { Star } from 'lucide-react';
import type { Episode } from '@/types';
import { stripHtml } from './utils';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

interface EpisodeCardProps {
    episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
    const episodeImageUrl = episode.image?.original || episode.image?.medium;

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div className="relative w-64 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border bg-card">
                    {/* Episode Image */}
                    <div className="aspect-video overflow-hidden bg-muted">
                        {episodeImageUrl ? (
                            <img
                                src={episodeImageUrl}
                                alt={episode.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                No image
                            </div>
                        )}
                    </div>

                    {/* Episode Info */}
                    <div className="p-3">
                        <h5 className="mb-2 truncate font-semibold text-card-foreground">
                            {episode.name}
                        </h5>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                </div>
            </HoverCardTrigger>
            {episode.summary && (
                <HoverCardContent
                    side="top"
                    align="start"
                    className="w-80 bg-popover border-border"
                >
                    <div className="space-y-2">
                        <h4 className="font-semibold text-popover-foreground">
                            {episode.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            {stripHtml(episode.summary)}
                        </p>
                    </div>
                </HoverCardContent>
            )}
        </HoverCard>
    );
}
