/**
 * DetailsPage - Display full details for a TV show
 * Shows information, cast, seasons, episodes, and images
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Star, ExternalLink, ChevronUp } from 'lucide-react';
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

    const [expandedSeasons, setExpandedSeasons] = useState<Set<number>>(
        new Set()
    );
    const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
    const [castPage, setCastPage] = useState(0);
    const [hoveredCast, setHoveredCast] = useState<number | null>(null);
    const [hoveredEpisode, setHoveredEpisode] = useState<number | null>(null);

    const CAST_PER_PAGE = 12;

    // Add to recently visited when show data loads
    useEffect(() => {
        if (show) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _embedded, ...showWithoutEmbedded } = show;
            addRecentlyVisitedShow(showWithoutEmbedded);
        }
    }, [show]);

    // Cycle through poster images every 3 seconds
    useEffect(() => {
        if (!show?._embedded?.images) return;

        const posters = show._embedded.images.filter(
            (img) => img.type === 'poster'
        );
        if (posters.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentPosterIndex((prev) => (prev + 1) % posters.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [show]);

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

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

        // Scroll to season after a brief delay
        setTimeout(() => {
            const element = document.getElementById(`season-${seasonNumber}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
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

    const posters = show._embedded?.images?.filter(
        (img) => img.type === 'poster'
    );
    const currentPoster = posters?.[currentPosterIndex];
    const mainImageUrl =
        currentPoster?.resolutions?.original?.url ||
        show.image?.original ||
        show.image?.medium;

    const summary = stripHtml(show.summary);
    const episodesBySeason = groupEpisodesBySeason(show._embedded?.episodes);
    const backgroundImage = show._embedded?.images?.find(
        (img) => img.type === 'background'
    )?.resolutions?.original?.url;

    const allImages = show._embedded?.images || [];
    const cast = show._embedded?.cast || [];
    const totalCastPages = Math.ceil(cast.length / CAST_PER_PAGE);
    const paginatedCast = cast.slice(
        castPage * CAST_PER_PAGE,
        (castPage + 1) * CAST_PER_PAGE
    );

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Back Button */}
            <div className="container mx-auto px-4 py-6">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-white transition-colors hover:text-blue-400"
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back</span>
                </button>
            </div>

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
                    {/* Main Info - Side by side on large, stacked on small */}
                    <div className="grid gap-8 md:grid-cols-[300px_1fr]">
                        {/* Main Poster with cycling */}
                        <div className="flex justify-center md:justify-start">
                            {mainImageUrl ? (
                                <div className="relative overflow-hidden rounded-lg shadow-2xl">
                                    <img
                                        key={currentPosterIndex}
                                        src={mainImageUrl}
                                        alt={show.name}
                                        className="h-auto w-full max-w-sm transition-opacity duration-500"
                                    />
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

            {/* Seasons Section */}
            {show._embedded?.seasons && show._embedded.seasons.length > 0 && (
                <section className="border-t border-gray-800 bg-gray-900 py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-6 text-3xl font-bold text-white">
                            Seasons
                        </h2>
                        <div className="space-y-4">
                            {show._embedded.seasons.map((season) => {
                                const isExpanded = expandedSeasons.has(
                                    season.number
                                );
                                const seasonEpisodes =
                                    episodesBySeason.get(season.number) || [];
                                const seasonImageUrl =
                                    season.image?.original ||
                                    season.image?.medium ||
                                    show.image?.original ||
                                    show.image?.medium;

                                return (
                                    <div
                                        key={season.id}
                                        id={`season-${season.number}`}
                                        className={
                                            isExpanded
                                                ? 'w-full'
                                                : 'inline-block w-full md:w-auto'
                                        }
                                    >
                                        {!isExpanded ? (
                                            // Collapsed Season Card
                                            <div
                                                onClick={() =>
                                                    toggleSeason(season.number)
                                                }
                                                className="inline-block w-64 cursor-pointer overflow-hidden rounded-lg border border-gray-700 bg-gray-800 transition-transform hover:scale-105"
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === 'Enter' ||
                                                        e.key === ' '
                                                    ) {
                                                        e.preventDefault();
                                                        toggleSeason(
                                                            season.number
                                                        );
                                                    }
                                                }}
                                            >
                                                <div className="aspect-2/3 overflow-hidden bg-gray-700">
                                                    {seasonImageUrl ? (
                                                        <img
                                                            src={seasonImageUrl}
                                                            alt={`Season ${season.number}`}
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-gray-500">
                                                            No image
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="mb-1 font-semibold text-white">
                                                        Season {season.number}
                                                    </h3>
                                                    <p className="text-sm text-gray-400">
                                                        {seasonEpisodes.length}{' '}
                                                        Episodes
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            // Expanded Season Card
                                            <div className="w-full rounded-lg border border-gray-700 bg-gray-800 p-6">
                                                {/* Header */}
                                                <div className="mb-6 flex items-center justify-between">
                                                    <h3 className="text-2xl font-bold text-white">
                                                        Season {season.number}{' '}
                                                        Details
                                                    </h3>
                                                    <button
                                                        onClick={() =>
                                                            toggleSeason(
                                                                season.number
                                                            )
                                                        }
                                                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                                                    >
                                                        <span>Collapse</span>
                                                        <ChevronUp className="h-5 w-5" />
                                                    </button>
                                                </div>

                                                {/* Season Info */}
                                                <div className="mb-6 grid gap-6 md:grid-cols-[200px_1fr]">
                                                    {/* Season Image */}
                                                    <div className="overflow-hidden rounded-lg bg-gray-700">
                                                        {seasonImageUrl ? (
                                                            <img
                                                                src={
                                                                    seasonImageUrl
                                                                }
                                                                alt={`Season ${season.number}`}
                                                                className="h-auto w-full"
                                                            />
                                                        ) : (
                                                            <div className="flex h-48 items-center justify-center text-gray-500">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Season Details */}
                                                    <div className="text-white">
                                                        <p className="mb-2 text-lg">
                                                            {
                                                                seasonEpisodes.length
                                                            }{' '}
                                                            Episodes
                                                        </p>
                                                        {season.summary && (
                                                            <p className="text-gray-300">
                                                                {stripHtml(
                                                                    season.summary
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Episodes List - Horizontal Scroll */}
                                                {seasonEpisodes.length > 0 && (
                                                    <div>
                                                        <h4 className="mb-4 text-xl font-semibold text-white">
                                                            Episodes
                                                        </h4>
                                                        <div className="overflow-x-auto">
                                                            <div className="flex gap-4 pb-4">
                                                                {seasonEpisodes.map(
                                                                    (
                                                                        episode
                                                                    ) => {
                                                                        const episodeImageUrl =
                                                                            episode
                                                                                .image
                                                                                ?.original ||
                                                                            episode
                                                                                .image
                                                                                ?.medium;

                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    episode.id
                                                                                }
                                                                                className="relative w-64 flex-shrink-0 overflow-hidden rounded-lg border border-gray-700 bg-gray-700"
                                                                                onMouseEnter={() =>
                                                                                    setHoveredEpisode(
                                                                                        episode.id
                                                                                    )
                                                                                }
                                                                                onMouseLeave={() =>
                                                                                    setHoveredEpisode(
                                                                                        null
                                                                                    )
                                                                                }
                                                                            >
                                                                                {/* Episode Image */}
                                                                                <div className="aspect-video overflow-hidden bg-gray-600">
                                                                                    {episodeImageUrl ? (
                                                                                        <img
                                                                                            src={
                                                                                                episodeImageUrl
                                                                                            }
                                                                                            alt={
                                                                                                episode.name
                                                                                            }
                                                                                            className="h-full w-full object-cover"
                                                                                            loading="lazy"
                                                                                        />
                                                                                    ) : (
                                                                                        <div className="flex h-full items-center justify-center text-sm text-gray-500">
                                                                                            No
                                                                                            image
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                                {/* Episode Info */}
                                                                                <div className="p-3">
                                                                                    <h5 className="mb-2 truncate font-semibold text-white">
                                                                                        {
                                                                                            episode.name
                                                                                        }
                                                                                    </h5>
                                                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                                                        <span>
                                                                                            Ep{' '}
                                                                                            {
                                                                                                episode.number
                                                                                            }
                                                                                        </span>
                                                                                        {episode.runtime && (
                                                                                            <>
                                                                                                <span>
                                                                                                    •
                                                                                                </span>
                                                                                                <span>
                                                                                                    {
                                                                                                        episode.runtime
                                                                                                    }{' '}
                                                                                                    mins
                                                                                                </span>
                                                                                            </>
                                                                                        )}
                                                                                        {episode
                                                                                            .rating
                                                                                            ?.average && (
                                                                                            <>
                                                                                                <span>
                                                                                                    •
                                                                                                </span>
                                                                                                <span className="flex items-center gap-0.5">
                                                                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                                                                    {
                                                                                                        episode
                                                                                                            .rating
                                                                                                            .average
                                                                                                    }
                                                                                                </span>
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                </div>

                                                                                {/* Tooltip */}
                                                                                {hoveredEpisode ===
                                                                                    episode.id &&
                                                                                    episode.summary && (
                                                                                        <div className="absolute left-0 top-full z-10 mt-2 w-full rounded-lg border border-gray-600 bg-gray-800 p-3 shadow-xl">
                                                                                            <p className="text-xs text-gray-300">
                                                                                                {stripHtml(
                                                                                                    episode.summary
                                                                                                )}
                                                                                            </p>
                                                                                        </div>
                                                                                    )}
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Cast Section with Pagination */}
            {cast.length > 0 && (
                <section className="border-t border-gray-800 bg-gray-900 py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-6 text-3xl font-bold text-white">
                            Cast
                        </h2>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {paginatedCast.map((member) => {
                                const isHovered =
                                    hoveredCast === member.person.id;
                                const displayImage = isHovered
                                    ? member.character.image?.medium ||
                                      member.character.image?.original ||
                                      member.person.image?.medium ||
                                      member.person.image?.original
                                    : member.person.image?.medium ||
                                      member.person.image?.original;

                                return (
                                    <div
                                        key={member.person.id}
                                        className="text-center"
                                        onMouseEnter={() =>
                                            setHoveredCast(member.person.id)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredCast(null)
                                        }
                                    >
                                        <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-gray-800">
                                            {displayImage ? (
                                                <img
                                                    src={displayImage}
                                                    alt={
                                                        isHovered
                                                            ? member.character
                                                                  .name
                                                            : member.person.name
                                                    }
                                                    className="h-full w-full object-cover transition-opacity duration-300"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-gray-500">
                                                    No image
                                                </div>
                                            )}
                                        </div>
                                        <p
                                            className={`mb-1 text-sm text-white transition-all ${
                                                isHovered
                                                    ? 'font-normal'
                                                    : 'font-semibold'
                                            }`}
                                        >
                                            {member.person.name}
                                        </p>
                                        <p
                                            className={`text-sm text-gray-400 transition-all ${
                                                isHovered
                                                    ? 'font-bold'
                                                    : 'font-normal'
                                            }`}
                                        >
                                            {member.character.name}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Controls */}
                        {totalCastPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-4">
                                <button
                                    onClick={() =>
                                        setCastPage((p) => Math.max(0, p - 1))
                                    }
                                    disabled={castPage === 0}
                                    className="rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="text-white">
                                    Page {castPage + 1} of {totalCastPages}
                                </span>
                                <button
                                    onClick={() =>
                                        setCastPage((p) =>
                                            Math.min(totalCastPages - 1, p + 1)
                                        )
                                    }
                                    disabled={castPage === totalCastPages - 1}
                                    className="rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Images Section - Masonry Layout */}
            {allImages.length > 0 && (
                <section className="border-t border-gray-800 bg-gray-900 py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-6 text-3xl font-bold text-white">
                            Images
                        </h2>
                        <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
                            {allImages.map((image) => {
                                const imageUrl =
                                    image.resolutions?.original?.url ||
                                    image.resolutions?.medium?.url;

                                return imageUrl ? (
                                    <div
                                        key={image.id}
                                        className="mb-4 break-inside-avoid"
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={`${show.name} - ${image.type}`}
                                            className="w-full rounded-lg"
                                            loading="lazy"
                                        />
                                    </div>
                                ) : null;
                            })}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
