/**
 * TVMaze API search functions
 * Handles searching for TV shows and validating responses with Zod
 */

import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { SearchResultSchema, TVShowSchema } from '@/types/schemas';
import type { SearchResult, TVShow } from '@/types';

const TVMAZE_API_BASE = 'https://api.tvmaze.com';

/**
 * Search for TV shows by query string
 *
 * @param query - Search query string
 * @returns Promise with array of search results
 */
async function searchShows(query: string): Promise<SearchResult[]> {
    try {
        const response = await fetch(
            `${TVMAZE_API_BASE}/search/shows?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error(`Search failed: ${response.statusText}`);
        }

        const data = await response.json();

        // Validate with Zod
        const resultsSchema = z.array(SearchResultSchema);
        const validatedData = resultsSchema.safeParse(data);

        if (!validatedData.success) {
            console.error(
                'Search validation error:',
                validatedData.error.issues
            );
            throw new Error(
                `Search data validation failed: ${validatedData.error.issues
                    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                    .join(', ')}`
            );
        }

        return validatedData.data as SearchResult[];
    } catch (error) {
        console.error('Search shows error:', error);
        throw error;
    }
}

/**
 * React Query hook for searching TV shows
 *
 * @param query - Search query string
 * @returns Query result with search results
 */
export function useSearchShows(query: string) {
    return useQuery({
        queryKey: ['shows', 'search', query],
        queryFn: () => searchShows(query),
        enabled: query.length > 0,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Get full show details including embedded data
 *
 * @param showId - TV show ID
 * @returns Promise with full show data
 */
async function getShowDetails(showId: number): Promise<TVShow> {
    try {
        const response = await fetch(
            `${TVMAZE_API_BASE}/shows/${showId}?embed[]=seasons&embed[]=cast&embed[]=episodes&embed[]=images`
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Show not found');
            }
            throw new Error(
                `Failed to fetch show details: ${response.statusText}`
            );
        }

        const data = await response.json();

        // Validate with Zod
        const validatedData = TVShowSchema.safeParse(data);

        if (!validatedData.success) {
            console.error(
                'Show details validation error for show',
                showId,
                ':',
                validatedData.error.issues
            );
            throw new Error(
                `Show data validation failed: ${validatedData.error.issues
                    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                    .join(', ')}`
            );
        }

        return validatedData.data as TVShow;
    } catch (error) {
        console.error('Get show details error:', error);
        throw error;
    }
}

/**
 * React Query hook for fetching TV show details
 *
 * @param showId - TV show ID
 * @returns Query result with show details
 */
export function useShowDetails(showId: number) {
    return useQuery({
        queryKey: ['shows', 'details', showId],
        queryFn: () => getShowDetails(showId),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
