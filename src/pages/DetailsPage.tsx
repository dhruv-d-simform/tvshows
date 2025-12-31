import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useMemo, useRef } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { ArrowLeft, ChevronUp } from 'lucide-react';
import { useRecentlyVisitedShows } from '@/utils/recentlyVisited';
import Masonry from 'react-masonry-css';
import {
    TVShowSchema,
    SeasonSchema,
    EpisodeSchema,
    CastMemberSchema,
    ImageSchema,
    Season,
} from '@/types';

export function DetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addShow } = useRecentlyVisitedShows();
    const showId = parseInt(id || '0');

    const {
        data: show,
        isLoading: showLoading,
        error: showError,
    } = useQuery({
        queryKey: ['show', showId],
        queryFn: async () => {
            const response = await fetch(
                `https://api.tvmaze.com/shows/${showId}`
            );
            if (!response.ok) throw new Error('Failed to fetch show');
            const data = await response.json();
            return TVShowSchema.parse(data);
        },
        enabled: !!showId,
    });

    // Add to recently visited when show loads
    useEffect(() => {
        if (show) {
            addShow(show);
        }
    }, [show, addShow]);

    useEffect(() => {
        setCurrentCastPage(1);
    }, [showId]);

    const { data: seasons = [] } = useQuery({
        queryKey: ['seasons', showId],
        queryFn: async () => {
            const response = await fetch(
                `https://api.tvmaze.com/shows/${showId}/seasons`
            );
            if (!response.ok) throw new Error('Failed to fetch seasons');
            const data = await response.json();
            return z.array(SeasonSchema).parse(data);
        },
        enabled: !!showId,
    });

    const { data: episodes = [] } = useQuery({
        queryKey: ['episodes', showId],
        queryFn: async () => {
            const response = await fetch(
                `https://api.tvmaze.com/shows/${showId}/episodes`
            );
            if (!response.ok) throw new Error('Failed to fetch episodes');
            const data = await response.json();
            return z.array(EpisodeSchema).parse(data);
        },
        enabled: !!showId,
    });

    const { data: cast = [] } = useQuery({
        queryKey: ['cast', showId],
        queryFn: async () => {
            const response = await fetch(
                `https://api.tvmaze.com/shows/${showId}/cast`
            );
            if (!response.ok) throw new Error('Failed to fetch cast');
            const data = await response.json();
            return z.array(CastMemberSchema).parse(data);
        },
        enabled: !!showId,
    });

    const { data: images = [] } = useQuery({
        queryKey: ['images', showId],
        queryFn: async () => {
            const response = await fetch(
                `https://api.tvmaze.com/shows/${showId}/images`
            );
            if (!response.ok) throw new Error('Failed to fetch images');
            const data = await response.json();
            return z.array(ImageSchema).parse(data);
        },
        enabled: !!showId,
    });

    const posterImages = useMemo(() => {
        const posters = images.filter((img) => img.type === 'poster');
        const arr = [];
        if (show?.image?.original || show?.image?.medium) {
            arr.push({
                id: 'main',
                url:
                    show.image.original ||
                    show.image.medium ||
                    '/placeholder.png',
            });
        }
        posters.forEach((p) => {
            arr.push({
                id: p.id,
                url:
                    p.resolutions.original?.url ||
                    p.resolutions.medium?.url ||
                    '/placeholder.png',
            });
        });
        return arr;
    }, [images, show]);

    const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
    const [selectedSeasons, setSelectedSeasons] = useState<Season[]>([]);
    const [currentCastPage, setCurrentCastPage] = useState(1);

    const expandedSeasonRef = useRef<HTMLDivElement>(null);

    const toggleSeason = (season: Season) => {
        setSelectedSeasons((prev) =>
            prev.some((s) => s.id === season.id)
                ? prev.filter((s) => s.id !== season.id)
                : [...prev, season]
        );
    };

    useEffect(() => {
        if (selectedSeasons.length > 0 && expandedSeasonRef.current) {
            expandedSeasonRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [selectedSeasons]);

    useEffect(() => {
        if (posterImages.length > 1) {
            const interval = setInterval(() => {
                setCurrentPosterIndex(
                    (prev) => (prev + 1) % posterImages.length
                );
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [posterImages.length]);

    if (showLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (showError || !show) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">
                        Error loading show details
                    </p>
                    <Button onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const year = show.premiered ? new Date(show.premiered).getFullYear() : null;

    const itemsPerPage = 12;
    const totalCastPages = Math.ceil(cast.length / itemsPerPage);
    const currentCast = cast.slice(
        (currentCastPage - 1) * itemsPerPage,
        currentCastPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Back Button */}
            <div className="container mx-auto px-4 py-4">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>

            {/* Show Details */}
            <div className="container mx-auto px-4 pb-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Poster */}
                    <div className="shrink-0">
                        {posterImages.length > 0 ? (
                            <div className="relative overflow-hidden rounded-lg aspect-2/3 w-full max-w-sm">
                                <div
                                    className="flex transition-transform duration-500 h-full"
                                    style={{
                                        transform: `translateX(-${currentPosterIndex * 100}%)`,
                                    }}
                                >
                                    {posterImages.map((poster, index) => (
                                        <img
                                            key={poster.id}
                                            src={poster.url}
                                            alt={`${show.name} poster ${index + 1}`}
                                            className="w-full h-full object-cover shrink-0"
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <img
                                src={
                                    show.image?.original ||
                                    show.image?.medium ||
                                    '/placeholder.png'
                                }
                                alt={show.name}
                                className="w-full max-w-sm rounded-lg shadow-lg"
                            />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-4">{show.name}</h1>
                        <div className="space-y-2 text-sm">
                            {year && (
                                <p>
                                    <strong>Year:</strong> {year}
                                </p>
                            )}
                            {show.genres.length > 0 && (
                                <p>
                                    <strong>Genres:</strong>{' '}
                                    {show.genres.join(', ')}
                                </p>
                            )}
                            {show.language && (
                                <p>
                                    <strong>Language:</strong> {show.language}
                                </p>
                            )}
                            {show.rating?.average && (
                                <p>
                                    <strong>Rating:</strong> ⭐{' '}
                                    {show.rating.average}
                                </p>
                            )}
                            {show.externals?.imdb && (
                                <p>
                                    <strong>IMDb:</strong>{' '}
                                    <a
                                        href={`https://www.imdb.com/title/${show.externals.imdb}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        {show.externals.imdb}
                                    </a>
                                </p>
                            )}
                        </div>
                        {show.summary && (
                            <div className="mt-4">
                                <h2 className="text-xl font-semibold mb-2">
                                    Summary
                                </h2>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: show.summary,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Seasons */}
                {seasons.length > 0 && (
                    <section className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Seasons</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {seasons.map((season) => {
                                if (
                                    selectedSeasons.some(
                                        (s) => s.id === season.id
                                    )
                                ) {
                                    return (
                                        <div
                                            key={season.id}
                                            className="col-span-full"
                                            ref={expandedSeasonRef}
                                        >
                                            <div className="border rounded-lg p-4 bg-muted">
                                                <div className="flex justify-between items-center mb-4 bg-secondary text-secondary-foreground p-2 rounded">
                                                    <h3 className="text-xl font-semibold">
                                                        Season {season.number}{' '}
                                                        Details
                                                    </h3>
                                                    <button
                                                        onClick={() =>
                                                            toggleSeason(season)
                                                        }
                                                        className="text-secondary-foreground hover:text-secondary-foreground/80"
                                                    >
                                                        <ChevronUp className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="flex gap-4 mb-4">
                                                    <img
                                                        src={
                                                            season.image
                                                                ?.medium ||
                                                            show.image
                                                                ?.original ||
                                                            show.image
                                                                ?.medium ||
                                                            '/placeholder.png'
                                                        }
                                                        alt={`Season ${season.number}`}
                                                        className="w-20 h-28 object-cover rounded"
                                                    />
                                                    <div className="flex-1">
                                                        {season.episodeOrder && (
                                                            <p className="text-sm text-muted-foreground mb-2">
                                                                {
                                                                    season.episodeOrder
                                                                }{' '}
                                                                episodes
                                                            </p>
                                                        )}
                                                        {season.summary && (
                                                            <div
                                                                className="text-sm"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: season.summary,
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Episodes for this season */}
                                                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                                    {episodes
                                                        .filter(
                                                            (e) =>
                                                                e.season ===
                                                                season.number
                                                        )
                                                        .map((episode) => {
                                                            const card = (
                                                                <div
                                                                    className="shrink-0 w-64 border rounded h-full cursor-pointer"
                                                                    data-tooltip-id="episode-tooltip"
                                                                    data-tooltip-html={
                                                                        episode.summary ||
                                                                        ''
                                                                    }
                                                                >
                                                                    {episode.image &&
                                                                        (episode
                                                                            .image
                                                                            .original ||
                                                                            episode
                                                                                .image
                                                                                .medium) && (
                                                                            <img
                                                                                src={
                                                                                    episode
                                                                                        .image
                                                                                        .original ||
                                                                                    episode
                                                                                        .image
                                                                                        .medium ||
                                                                                    '/placeholder.png'
                                                                                }
                                                                                alt={
                                                                                    episode.name
                                                                                }
                                                                                className="w-full aspect-video object-cover rounded-t"
                                                                            />
                                                                        )}
                                                                    <div className="p-3">
                                                                        <div className="mb-2">
                                                                            <h4 className="font-semibold text-base mb-1">
                                                                                {
                                                                                    episode.name
                                                                                }
                                                                            </h4>
                                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                                <span>
                                                                                    Ep{' '}
                                                                                    {
                                                                                        episode.number
                                                                                    }
                                                                                </span>
                                                                                {episode.runtime && (
                                                                                    <span>
                                                                                        •{' '}
                                                                                        {
                                                                                            episode.runtime
                                                                                        }{' '}
                                                                                        min
                                                                                    </span>
                                                                                )}
                                                                                {episode
                                                                                    .rating
                                                                                    ?.average && (
                                                                                    <span>
                                                                                        •
                                                                                        ⭐{' '}
                                                                                        {
                                                                                            episode
                                                                                                .rating
                                                                                                .average
                                                                                        }
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                            return (
                                                                <div
                                                                    key={
                                                                        episode.id
                                                                    }
                                                                >
                                                                    {card}
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return (
                                    <div
                                        key={season.id}
                                        className="cursor-pointer border rounded-lg hover:shadow-lg transition-shadow"
                                        onClick={() => toggleSeason(season)}
                                    >
                                        <img
                                            src={
                                                season.image?.medium ||
                                                show.image?.original ||
                                                show.image?.medium ||
                                                '/placeholder.png'
                                            }
                                            alt={`Season ${season.number}`}
                                            className="w-full aspect-2/3 object-cover rounded-t-lg"
                                        />
                                        <div className="p-4 pt-2">
                                            <h3 className="font-semibold text-center text-xl">
                                                Season {season.number}
                                            </h3>
                                            {season.episodeOrder && (
                                                <p className="text-sm text-muted-foreground text-center">
                                                    {season.episodeOrder}{' '}
                                                    episodes
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Cast */}
                {cast.length > 0 && (
                    <section className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Cast</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {currentCast.map((member, index) => (
                                <div
                                    key={index}
                                    className="text-center group cursor-pointer"
                                >
                                    <div className="relative w-20 h-20 mx-auto mb-2">
                                        <img
                                            src={
                                                member.person.image?.medium ||
                                                '/placeholder.png'
                                            }
                                            alt={member.person.name}
                                            className="w-20 h-20 rounded-full object-cover absolute inset-0 group-hover:opacity-0 transition-opacity duration-200"
                                        />
                                        <img
                                            src={
                                                member.character.image
                                                    ?.medium ||
                                                '/placeholder.png'
                                            }
                                            alt={member.character.name}
                                            className="w-20 h-20 rounded-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        />
                                    </div>
                                    <p className="font-semibold text-sm group-hover:font-normal">
                                        {member.person.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground group-hover:font-bold group-hover:text-foreground">
                                        {member.character.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                        {totalCastPages > 1 && (
                            <Pagination className="mt-4">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() =>
                                                setCurrentCastPage((prev) =>
                                                    Math.max(1, prev - 1)
                                                )
                                            }
                                            className={
                                                currentCastPage === 1
                                                    ? 'pointer-events-none opacity-50'
                                                    : 'cursor-pointer'
                                            }
                                        />
                                    </PaginationItem>
                                    {Array.from(
                                        { length: totalCastPages },
                                        (_, i) => i + 1
                                    ).map((page) => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                onClick={() =>
                                                    setCurrentCastPage(page)
                                                }
                                                isActive={
                                                    currentCastPage === page
                                                }
                                                className="cursor-pointer"
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                setCurrentCastPage((prev) =>
                                                    Math.min(
                                                        totalCastPages,
                                                        prev + 1
                                                    )
                                                )
                                            }
                                            className={
                                                currentCastPage ===
                                                totalCastPages
                                                    ? 'pointer-events-none opacity-50'
                                                    : 'cursor-pointer'
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </section>
                )}

                {/* Images Gallery */}
                {images.length > 0 && (
                    <section className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Images</h2>
                        <Masonry
                            breakpointCols={{
                                default: 4,
                                1100: 3,
                                700: 2,
                                500: 1,
                            }}
                            className="flex -ml-4"
                            columnClassName="pl-4"
                        >
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className="mb-4 overflow-hidden rounded-lg"
                                >
                                    <img
                                        src={
                                            image.resolutions.original?.url ||
                                            image.resolutions.medium?.url
                                        }
                                        alt={`${show.name} ${image.type || 'image'}`}
                                        className="w-full h-auto hover:scale-105 transition-transform"
                                    />
                                </div>
                            ))}
                        </Masonry>
                    </section>
                )}
            </div>
            <Tooltip
                id="episode-tooltip"
                className="max-w-sm border rounded-md p-3 shadow-md"
                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                place="top"
            />
        </div>
    );
}
