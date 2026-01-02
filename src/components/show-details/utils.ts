/**
 * Utility functions for show details components
 */

import type { Episode } from '@/types';

/**
 * Strip HTML tags from text
 */
export function stripHtml(html: string | null | undefined): string {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
}

/**
 * Group episodes by season number
 */
export function groupEpisodesBySeason(
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

/**
 * Collect all poster images from a show
 */
export function collectPosterImages(show: {
    image?: { original?: string; medium?: string } | null;
    _embedded?: {
        images?: Array<{
            type: string;
            resolutions?: {
                original?: { url: string };
                medium?: { url: string };
            };
        }>;
    };
}): string[] {
    const allPosters: string[] = [];

    // Add main poster first if available
    if (show.image?.original) {
        allPosters.push(show.image.original);
    } else if (show.image?.medium) {
        allPosters.push(show.image.medium);
    }

    // Add additional posters from images
    if (show._embedded?.images) {
        const posterImages = show._embedded.images
            .filter((img) => img.type === 'poster')
            .map(
                (img) =>
                    img.resolutions?.original?.url ||
                    img.resolutions?.medium?.url
            )
            .filter((url): url is string => !!url && !allPosters.includes(url));

        allPosters.push(...posterImages);
    }

    return allPosters;
}
