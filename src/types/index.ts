/**
 * TypeScript type definitions for TV Show Search Web App
 * Based on TVMaze API data structure
 */

/**
 * Image data from TVMaze API
 */
export interface Image {
    medium?: string;
    original?: string;
}

/**
 * Rating data from TVMaze API
 */
export interface Rating {
    average?: number | null;
}

/**
 * External links for a TV show
 */
export interface Externals {
    tvrage?: number | null;
    thetvdb?: number | null;
    imdb?: string | null;
}

/**
 * Image with resolutions (from images endpoint)
 */
export interface ImageWithResolutions {
    id: number;
    type: string;
    main?: boolean;
    resolutions: {
        original?: {
            url: string;
            width: number;
            height: number;
        };
        medium?: {
            url: string;
            width: number;
            height: number;
        };
    };
}

/**
 * Main TV Show entity
 */
export interface TVShow {
    id: number;
    name: string;
    genres: string[];
    language?: string | null;
    premiered?: string | null;
    ended?: string | null;
    rating?: Rating;
    image?: Image | null;
    summary?: string | null;
    externals?: Externals;
    _embedded?: {
        seasons?: Season[];
        cast?: CastMember[];
        episodes?: Episode[];
        images?: ImageWithResolutions[];
    };
}

/**
 * Season entity
 */
export interface Season {
    id: number;
    number: number;
    episodeOrder?: number | null;
    premiereDate?: string;
    endDate?: string;
    image?: Image;
    summary?: string | null;
}

/**
 * Episode entity
 */
export interface Episode {
    id: number;
    name: string;
    season: number;
    number: number;
    runtime?: number | null;
    rating?: Rating;
    image?: Image;
    summary?: string | null;
}

/**
 * Person entity (actor/actress)
 */
export interface Person {
    id: number;
    name: string;
    image?: Image;
}

/**
 * Character entity
 */
export interface Character {
    id: number;
    name: string;
    image?: Image;
}

/**
 * Cast member (person playing a character)
 */
export interface CastMember {
    person: Person;
    character: Character;
}

/**
 * Recently visited show (stored in local storage)
 */
export interface RecentlyVisitedShow {
    show: Omit<TVShow, '_embedded'>;
    visitedAt: string;
}

/**
 * Search result from TVMaze API
 */
export interface SearchResult {
    score: number;
    show: TVShow;
}
