/**
 * Zod validation schemas for TV Show Search Web App
 * Validates API responses from TVMaze with optional field handling
 */

import { z } from 'zod';

/**
 * Image schema - both fields optional, entire object can be null
 */
export const ImageSchema = z
    .object({
        medium: z.string().optional(),
        original: z.string().optional(),
    })
    .passthrough()
    .nullable()
    .optional()
    .catch(null);

/**
 * Rating schema - can be null or have null average
 */
export const RatingSchema = z
    .object({
        average: z.number().nullable().optional(),
    })
    .passthrough()
    .nullable()
    .optional()
    .catch(null);

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
            .passthrough()
            .catch({}),
    })
    .passthrough();

/**
 * Person schema
 */
export const PersonSchema = z
    .object({
        id: z.number(),
        name: z.string(),
        image: ImageSchema.nullable().catch(null),
    })
    .passthrough();

/**
 * Character schema
 */
export const CharacterSchema = z
    .object({
        id: z.number(),
        name: z.string(),
        image: ImageSchema.nullable().catch(null),
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
        rating: RatingSchema.nullable().catch(null),
        image: ImageSchema.nullable().catch(null),
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
        image: ImageSchema.nullable().catch(null),
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
        genres: z.array(z.string()).catch([]),
        language: z.string().nullable().optional(),
        premiered: z.string().nullable().optional(),
        ended: z.string().nullable().optional(),
        rating: RatingSchema.nullable().catch(null),
        image: ImageSchema.nullable().catch(null),
        summary: z.string().nullable().optional(),
        externals: ExternalsSchema.catch({}),
        _embedded: z
            .object({
                seasons: z
                    .array(z.any())
                    .transform((arr) =>
                        arr
                            .map((item) => SeasonSchema.safeParse(item))
                            .filter((result) => result.success)
                            .map((result) => result.data)
                    )
                    .optional(),
                cast: z
                    .array(z.any())
                    .transform((arr) =>
                        arr
                            .map((item) => CastMemberSchema.safeParse(item))
                            .filter((result) => result.success)
                            .map((result) => result.data)
                    )
                    .optional(),
                episodes: z
                    .array(z.any())
                    .transform((arr) =>
                        arr
                            .map((item) => EpisodeSchema.safeParse(item))
                            .filter((result) => result.success)
                            .map((result) => result.data)
                    )
                    .optional(),
                images: z
                    .array(z.any())
                    .transform((arr) =>
                        arr
                            .map((item) =>
                                ImageWithResolutionsSchema.safeParse(item)
                            )
                            .filter((result) => result.success)
                            .map((result) => result.data)
                    )
                    .optional(),
            })
            .passthrough()
            .catch({})
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
