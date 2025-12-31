import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { TVShowSchema } from '@/types';

const SearchResultSchema = z.object({
    score: z.number(),
    show: TVShowSchema,
});

/**
 * React hook for searching TV shows using TVMaze API
 * @param query The search query string
 * @returns Query object with search results
 */
export function useSearchShows(query: string) {
    return useQuery({
        queryKey: ['search', query],
        queryFn: async () => {
            if (!query.trim()) return [];

            const response = await fetch(
                `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`
            );

            if (!response.ok) {
                throw new Error('Failed to search shows');
            }

            const data = await response.json();
            const parsed = z.array(SearchResultSchema).parse(data);

            return parsed.map((result) => result.show);
        },
        enabled: !!query.trim(),
    });
}
