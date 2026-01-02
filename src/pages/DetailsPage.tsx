/**
 * DetailsPage - Display full details for a TV show
 * Shows information, cast, seasons, episodes, and images
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Star, ExternalLink } from 'lucide-react';
import { useShowDetails } from '@/api/search';
import { addRecentlyVisitedShow } from '@/utils/localStorage';
import type { Episode } from '@/types';

/**
 * Strip HTML tags from text
 */
function stripHtml(html: string | null | undefined): string {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
}

/**
 * Group episodes by season number
 */
function groupEpisodesBySeason(
    episodes: Episode[] | undefined
): Map<number, Episode[]> {
    const grouped = new Map<number, Episode[]>();

    if (!episodes) return grouped;

    episodes.forEach((episode) => {
        const seasonNum = episode.season;
        if (!grouped.has(seasonNum)) {
            grouped.set(seasonNum, []);
        }
        grouped.get(seasonNum)!.push(episode);
    });

    // Sort episodes within each season by episode number
    grouped.forEach((eps) => {
        eps.sort((a, b) => a.number - b.number);
    });

    return grouped;
}

export function DetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const showId = parseInt(id || '0', 10);

    const { data: show, isLoading, isError, error } = useShowDetails(showId);

    // Add to recently visited when show data loads
    useEffect(() => {
        if (show) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _embedded, ...showWithoutEmbedded } = show;
            addRecentlyVisitedShow(showWithoutEmbedded);
        }
    }, [show]);

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900">
                <p className="text-lg text-gray-400">Loading show details...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900">
                <div className="text-center">
                    <p className="mb-4 text-lg text-red-400">
                        {error instanceof Error &&
                        error.message === 'Show not found'
                            ? 'Show not found'
                            : 'Error loading show details'}
                    </p>
                    <button
                        onClick={handleBack}
                        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!show) return null;

    const imageUrl = show.image?.original || show.image?.medium;
    const summary = stripHtml(show.summary);
    const episodesBySeason = groupEpisodesBySeason(show._embedded?.episodes);
    const backgroundImage = show._embedded?.images?.find(
        (img) => img.type === 'background'
    )?.resolutions?.original?.url;

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Hero Section with Background */}
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
                    <button
                        onClick={handleBack}
                        className="mb-6 flex items-center gap-2 text-white transition-colors hover:text-blue-400"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back</span>
                    </button>

                    {/* Main Info */}
                    <div className="grid gap-8 md:grid-cols-[300px_1fr]">
                        {/* Poster */}
                        <div className="flex justify-center md:justify-start">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={show.name}
                                    className="h-auto w-full max-w-sm rounded-lg shadow-2xl"
                                />
                            ) : (
                                <div className="flex h-96 w-full max-w-sm items-center justify-center rounded-lg bg-gray-800 text-gray-400">
                                    No image available
                                </div>
                            )}
                        </div>

                        {/* Info */}
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
                                        <span
                                            key={genre}
                                            className="rounded-full bg-blue-600 px-4 py-1 text-sm font-medium"
                                        >
                                            {genre}
                                        </span>
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
                                <a
                                    href={`https://www.imdb.com/title/${show.externals.imdb}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-yellow-700"
                                >
                                    View on IMDb
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cast Section */}
            {show._embedded?.cast && show._embedded.cast.length > 0 && (
                <section className="border-t border-gray-800 bg-gray-900 py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-6 text-3xl font-bold text-white">
                            Cast
                        </h2>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {show._embedded.cast.slice(0, 12).map((member) => (
                                <div
                                    key={member.person.id}
                                    className="text-center"
                                >
                                    <div className="mb-2 aspect-square overflow-hidden rounded-full bg-gray-800">
                                        {member.person.image?.medium ? (
                                            <img
                                                src={member.person.image.medium}
                                                alt={member.person.name}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-gray-500">
                                                No image
                                            </div>
                                        )}
                                    </div>
                                    <p className="mb-1 font-semibold text-white">
                                        {member.person.name}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {member.character.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Seasons & Episodes Section */}
            {episodesBySeason.size > 0 && (
                <section className="border-t border-gray-800 bg-gray-900 py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-6 text-3xl font-bold text-white">
                            Episodes
                        </h2>
                        <div className="space-y-8">
                            {Array.from(episodesBySeason.entries())
                                .sort(([a], [b]) => a - b)
                                .map(([seasonNum, episodes]) => (
                                    <div key={seasonNum}>
                                        <h3 className="mb-4 text-xl font-semibold text-white">
                                            Season {seasonNum} (
                                            {episodes.length} episodes)
                                        </h3>
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {episodes.map((episode) => (
                                                <div
                                                    key={episode.id}
                                                    className="rounded-lg border border-gray-700 bg-gray-800 p-4"
                                                >
                                                    <div className="mb-2 flex items-start justify-between">
                                                        <h4 className="font-semibold text-white">
                                                            {episode.number}.{' '}
                                                            {episode.name}
                                                        </h4>
                                                        {episode.rating
                                                            ?.average && (
                                                            <span className="ml-2 flex items-center gap-1 text-sm text-yellow-400">
                                                                <Star className="h-3 w-3 fill-current" />
                                                                {
                                                                    episode
                                                                        .rating
                                                                        .average
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                    {episode.runtime && (
                                                        <p className="mb-2 text-sm text-gray-400">
                                                            {episode.runtime}{' '}
                                                            min
                                                        </p>
                                                    )}
                                                    {episode.summary && (
                                                        <p className="text-sm text-gray-300">
                                                            {stripHtml(
                                                                episode.summary
                                                            ).substring(0, 150)}
                                                            {stripHtml(
                                                                episode.summary
                                                            ).length > 150
                                                                ? '...'
                                                                : ''}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
