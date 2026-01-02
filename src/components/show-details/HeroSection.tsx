/**
 * HeroSection - Show header with background, poster carousel, and main info
 */

import { useEffect, useState } from 'react';
import { ArrowLeft, Star, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TVShow } from '@/types';
import { stripHtml, collectPosterImages } from './utils';

interface HeroSectionProps {
    show: TVShow;
    onBack: () => void;
}

export function HeroSection({ show, onBack }: HeroSectionProps) {
    const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);

    const allPosters = collectPosterImages(show);
    const summary = stripHtml(show.summary);
    const backgroundImage = show._embedded?.images?.find(
        (img) => img.type === 'background'
    )?.resolutions?.original?.url;

    // Cycle through poster images every 3 seconds
    useEffect(() => {
        if (allPosters.length <= 1) return;

        const interval = setInterval(() => {
            setIsTransitioning(true);
            setCurrentPosterIndex((prev) => prev + 1);
        }, 3000);

        return () => clearInterval(interval);
    }, [allPosters.length]);

    // Handle infinite loop reset
    useEffect(() => {
        if (allPosters.length <= 1) return;

        // When we reach the duplicate (last + 1), reset to index 0 without transition
        if (currentPosterIndex === allPosters.length) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentPosterIndex(0);
            }, 300); // Wait for transition to complete
        }
    }, [currentPosterIndex, allPosters.length]);

    return (
        <div
            className="relative bg-cover bg-center"
            style={{
                backgroundImage: backgroundImage
                    ? `linear-gradient(to bottom, rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.95)), url(${backgroundImage})`
                    : undefined,
                backgroundColor: !backgroundImage ? '#111827' : undefined,
            }}
        >
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Button
                    onClick={onBack}
                    variant="ghost"
                    className="mb-6 text-white hover:bg-white/10 hover:text-blue-400"
                >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                </Button>

                {/* Main Info */}
                <div className="grid gap-8 md:grid-cols-[300px_1fr]">
                    {/* Poster Carousel */}
                    <div className="flex justify-center md:justify-start">
                        {allPosters.length > 0 ? (
                            <div className="relative h-112.5 w-full max-w-sm overflow-hidden rounded-lg shadow-2xl">
                                <div
                                    className="flex h-full"
                                    style={{
                                        transform: `translateX(-${currentPosterIndex * 100}%)`,
                                        transition: isTransitioning
                                            ? 'transform 300ms ease-in-out'
                                            : 'none',
                                    }}
                                >
                                    {allPosters.map((posterUrl, index) => (
                                        <div
                                            key={index}
                                            className="h-full w-full shrink-0"
                                        >
                                            <img
                                                src={posterUrl}
                                                alt={`${show.name} - Poster ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                    {/* Duplicate first image for seamless loop */}
                                    <div className="h-full w-full shrink-0">
                                        <img
                                            src={allPosters[0]}
                                            alt={`${show.name} - Poster 1`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-96 w-full max-w-sm items-center justify-center rounded-lg bg-gray-800 text-gray-400">
                                No image available
                            </div>
                        )}
                    </div>

                    {/* Show Info */}
                    <div className="text-white">
                        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                            {show.name}
                        </h1>

                        {/* Metadata */}
                        <div className="mb-6 flex flex-wrap items-center gap-4 text-gray-300">
                            {show.rating?.average && (
                                <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">
                                        {show.rating.average}
                                    </span>
                                </div>
                            )}
                            {show.premiered && (
                                <span>
                                    {new Date(show.premiered).getFullYear()}
                                    {show.ended &&
                                        ` - ${new Date(show.ended).getFullYear()}`}
                                </span>
                            )}
                            {show.language && <span>{show.language}</span>}
                        </div>

                        {/* Genres */}
                        {show.genres && show.genres.length > 0 && (
                            <div className="mb-6 flex flex-wrap gap-2">
                                {show.genres.map((genre) => (
                                    <Badge key={genre} variant="default">
                                        {genre}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Summary */}
                        {summary && (
                            <div className="mb-6">
                                <h2 className="mb-2 text-2xl font-semibold">
                                    Synopsis
                                </h2>
                                <p className="leading-relaxed text-gray-300">
                                    {summary}
                                </p>
                            </div>
                        )}

                        {/* External Links */}
                        {show.externals?.imdb && (
                            <Button asChild variant="default">
                                <a
                                    href={`https://www.imdb.com/title/${show.externals.imdb}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex"
                                >
                                    View on IMDb
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
