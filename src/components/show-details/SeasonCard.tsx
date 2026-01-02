/**
 * SeasonCard - Display season information in collapsed or expanded state
 */

import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Season, Episode, TVShow } from '@/types';
import { stripHtml } from './utils';
import { EpisodeCard } from './EpisodeCard';

interface SeasonCardProps {
    season: Season;
    episodes: Episode[];
    show: TVShow;
    isExpanded: boolean;
    onToggle: () => void;
}

export function SeasonCard({
    season,
    episodes,
    show,
    isExpanded,
    onToggle,
}: SeasonCardProps) {
    const seasonImageUrl =
        season.image?.original ||
        season.image?.medium ||
        show.image?.original ||
        show.image?.medium;

    if (!isExpanded) {
        // Collapsed State - Season Thumbnail
        return (
            <div className="w-64">
                <div
                    className="w-full cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-transform hover:scale-105"
                    onClick={onToggle}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onToggle();
                        }
                    }}
                >
                    <div className="aspect-2/3 overflow-hidden bg-muted">
                        {seasonImageUrl ? (
                            <img
                                src={seasonImageUrl}
                                alt={`Season ${season.number}`}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                No image
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <h3 className="mb-1 font-semibold text-card-foreground">
                            Season {season.number}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {episodes.length} Episodes
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Expanded State - Full Season Details
    return (
        <div className="w-full">
            <div className="w-full rounded-lg border border-border bg-card p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-card-foreground">
                        Season {season.number} Details
                    </h3>
                    <Button
                        onClick={onToggle}
                        variant="ghost"
                        className="text-primary hover:bg-primary/10 hover:text-primary"
                    >
                        Collapse
                        <ChevronUp className="ml-2 h-5 w-5" />
                    </Button>
                </div>

                {/* Season Info */}
                <div className="mb-6 grid gap-6 md:grid-cols-[200px_1fr]">
                    {/* Season Image */}
                    <div className="overflow-hidden rounded-lg bg-muted">
                        {seasonImageUrl ? (
                            <img
                                src={seasonImageUrl}
                                alt={`Season ${season.number}`}
                                className="h-auto w-full"
                            />
                        ) : (
                            <div className="flex h-48 items-center justify-center text-muted-foreground">
                                No image
                            </div>
                        )}
                    </div>

                    {/* Season Details */}
                    <div className="text-card-foreground">
                        <p className="mb-2 text-lg">
                            {episodes.length} Episodes
                        </p>
                        {season.summary && (
                            <p className="text-muted-foreground">
                                {stripHtml(season.summary)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Episodes List */}
                {episodes.length > 0 && (
                    <div>
                        <h4 className="mb-4 text-xl font-semibold text-card-foreground">
                            Episodes
                        </h4>
                        <div className="overflow-x-auto scrollbar-minimal">
                            <div className="flex gap-4 pb-4">
                                {episodes.map((episode) => (
                                    <EpisodeCard
                                        key={episode.id}
                                        episode={episode}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
