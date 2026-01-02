/**
 * Zod validation schemas for TV Show Search Web App
 * Validates API responses from TVMaze with optional field handling
 */

import { z } from 'zod';

/**
 * Image schema - both fields optional
 */
export const ImageSchema = z
    .object({
        medium: z.string().optional(),
        original: z.string().optional(),
    })
    .passthrough()
    .optional();

/**
 * Rating schema
 */
export const RatingSchema = z
    .object({
        average: z.number().nullable().optional(),
    })
    .passthrough()
    .optional();

/**
 * Externals schema
 */
export const ExternalsSchema = z
    .object({
        tvrage: z.number().nullable().optional(),
        thetvdb: z.number().nullable().optional(),
        imdb: z.string().nullable().optional(),
    })
    .passthrough()
    .optional();

/**
 * Image with resolutions schema
 */
export const ImageWithResolutionsSchema = z
    .object({
        id: z.number(),
        type: z.string(),
        main: z.boolean().optional(),
        resolutions: z
            .object({
                original: z
                    .object({
                        url: z.string(),
                        width: z.number(),
                        height: z.number(),
                    })
                    .passthrough()
                    .optional(),
                medium: z
                    .object({
                        url: z.string(),
                        width: z.number(),
                        height: z.number(),
                    })
                    .passthrough()
                    .optional(),
            })
            .passthrough(),
    })
    .passthrough();

/**
 * Person schema
 */
export const PersonSchema = z
    .object({
        id: z.number(),
        name: z.string(),
        image: ImageSchema,
    })
    .passthrough();

/**
 * Character schema
 */
export const CharacterSchema = z
    .object({
        id: z.number(),
        name: z.string(),
        image: ImageSchema,
    })
    .passthrough();

/**
 * Cast member schema
 */
export const CastMemberSchema = z
    .object({
        person: PersonSchema,
        character: CharacterSchema,
    })
    .passthrough();

/**
 * Episode schema
 */
export const EpisodeSchema = z
    .object({
        id: z.number(),
        name: z.string(),
        season: z.number(),
        number: z.number(),
        runtime: z.number().nullable().optional(),
        rating: RatingSchema,
        image: ImageSchema,
        summary: z.string().nullable().optional(),
    })
    .passthrough();

/**
 * Season schema
 */
export const SeasonSchema = z
    .object({
        id: z.number(),
        number: z.number(),
        episodeOrder: z.number().nullable().optional(),
        premiereDate: z.string().optional(),
        endDate: z.string().optional(),
        image: ImageSchema,
        summary: z.string().nullable().optional(),
    })
    .passthrough();

/**
 * TV Show schema with embedded data
 */
export const TVShowSchema = z
    .object({
        id: z.number(),
        name: z.string(),
        genres: z.array(z.string()),
        language: z.string().nullable().optional(),
        premiered: z.string().nullable().optional(),
        ended: z.string().nullable().optional(),
        rating: RatingSchema,
        image: ImageSchema.nullable(),
        summary: z.string().nullable().optional(),
        externals: ExternalsSchema,
        _embedded: z
            .object({
                seasons: z.array(SeasonSchema).optional(),
                cast: z.array(CastMemberSchema).optional(),
                episodes: z.array(EpisodeSchema).optional(),
                images: z.array(ImageWithResolutionsSchema).optional(),
            })
            .passthrough()
            .optional(),
    })
    .passthrough();

/**
 * Search result schema
 */
export const SearchResultSchema = z
    .object({
        score: z.number(),
        show: TVShowSchema,
    })
    .passthrough();

/**
 * Recently visited show schema
 */
export const RecentlyVisitedShowSchema = z
    .object({
        show: TVShowSchema.omit({ _embedded: true }),
        visitedAt: z.string(),
    })
    .passthrough();
