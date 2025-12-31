export interface TVShow {
    id: number;
    name: string;
    genres: string[];
    language?: string | null;
    premiered?: string | null;
    rating?: {
        average?: number | null;
    } | null;
    image?: {
        medium?: string | null;
        original?: string | null;
    } | null;
    summary?: string | null;
    externals?: {
        imdb?: string | null;
    } | null;
}
export interface Season {
    id: number;
    number: number;
    episodeOrder?: number | null;
    premiereDate?: string | null;
    endDate?: string | null;
    image?: {
        medium?: string | null;
        original?: string | null;
    } | null;
    summary?: string | null;
}

export interface Episode {
    id: number;
    name: string;
    season: number;
    number: number;
    runtime?: number | null;
    rating?: {
        average?: number | null;
    } | null;
    image?: {
        medium?: string | null;
        original?: string | null;
    } | null;
    summary?: string | null;
}

export interface CastMember {
    person: {
        id: number;
        name: string;
        image?: {
            medium?: string | null;
            original?: string | null;
        } | null;
    };
    character: {
        id: number;
        name: string;
        image?: {
            medium?: string | null;
            original?: string | null;
        } | null;
    };
}

export interface RecentlyVisitedShow {
    show: TVShow;
    visitedAt: string;
}

export interface Image {
    id: number;
    type: string | null;
    main: boolean;
    resolutions: {
        original: {
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

import { z } from 'zod';

export const TVShowSchema = z.object({
    id: z.number(),
    name: z.string(),
    genres: z.array(z.string()),
    language: z.string().nullish(),
    premiered: z.string().nullish(),
    rating: z
        .object({
            average: z.number().nullish(),
        })
        .nullish(),
    image: z
        .object({
            medium: z.string().nullish(),
            original: z.string().nullish(),
        })
        .nullish(),
    summary: z.string().nullish(),
    externals: z
        .object({
            imdb: z.string().nullish(),
        })
        .nullish(),
});

export const SeasonSchema = z.object({
    id: z.number(),
    number: z.number(),
    episodeOrder: z.number().nullish(),
    premiereDate: z.string().nullish(),
    endDate: z.string().nullish(),
    image: z
        .object({
            medium: z.string().nullish(),
            original: z.string().nullish(),
        })
        .nullish(),
    summary: z.string().nullish(),
});

export const EpisodeSchema = z.object({
    id: z.number(),
    name: z.string(),
    season: z.number(),
    number: z.number(),
    runtime: z.number().nullish(),
    rating: z
        .object({
            average: z.number().nullish(),
        })
        .nullish(),
    image: z
        .object({
            medium: z.string().nullish(),
            original: z.string().nullish(),
        })
        .nullish(),
    summary: z.string().nullish(),
});

export const CastMemberSchema = z.object({
    person: z.object({
        id: z.number(),
        name: z.string(),
        image: z
            .object({
                medium: z.string().nullish(),
                original: z.string().nullish(),
            })
            .nullish(),
    }),
    character: z.object({
        id: z.number(),
        name: z.string(),
        image: z
            .object({
                medium: z.string().nullish(),
                original: z.string().nullish(),
            })
            .nullish(),
    }),
});

export const RecentlyVisitedShowSchema = z.object({
    show: TVShowSchema,
    visitedAt: z.string(),
});

export const ImageSchema = z.object({
    id: z.number(),
    type: z.string().nullable(),
    main: z.boolean(),
    resolutions: z.object({
        original: z.object({
            url: z.string(),
            width: z.number(),
            height: z.number(),
        }),
        medium: z
            .object({
                url: z.string(),
                width: z.number(),
                height: z.number(),
            })
            .optional(),
    }),
});
