/**
 * SeasonsSection - Display all seasons with expand/collapse functionality
 */

import { useState, useEffect } from 'react';
import type { TVShow } from '@/types';
import { groupEpisodesBySeason } from './utils';
import { SeasonCard } from './SeasonCard';

interface SeasonsSectionProps {
    show: TVShow;
}

export function SeasonsSection({ show }: SeasonsSectionProps) {
    const [expandedSeasons, setExpandedSeasons] = useState<Set<number>>(
        new Set()
    );

    const seasons = show._embedded?.seasons;
    const episodesBySeason = groupEpisodesBySeason(show._embedded?.episodes);

    const toggleSeason = (seasonNumber: number) => {
        setExpandedSeasons((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(seasonNumber)) {
                newSet.delete(seasonNumber);
            } else {
                newSet.add(seasonNumber);
            }
            return newSet;
        });
    };

    // Scroll to season after expansion
    useEffect(() => {
        const expandedArray = Array.from(expandedSeasons);
        if (expandedArray.length === 0) return;

        const lastExpanded = expandedArray[expandedArray.length - 1];
        setTimeout(() => {
            const element = document.getElementById(`season-${lastExpanded}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }, [expandedSeasons]);

    if (!seasons || seasons.length === 0) return null;

    return (
        <section className="border-t border-border bg-background py-12">
            <div className="container mx-auto px-4">
                <h2 className="mb-6 text-3xl font-bold text-foreground">
                    Seasons
                </h2>
                <div className="flex flex-wrap gap-4">
                    {seasons.map((season) => {
                        const seasonEpisodes =
                            episodesBySeason.get(season.number) || [];
                        const isExpanded = expandedSeasons.has(season.number);

                        return (
                            <div
                                key={season.id}
                                id={`season-${season.number}`}
                                className={isExpanded ? 'w-full' : ''}
                            >
                                <SeasonCard
                                    season={season}
                                    episodes={seasonEpisodes}
                                    show={show}
                                    isExpanded={isExpanded}
                                    onToggle={() => toggleSeason(season.number)}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
