/**
 * Local storage utility for managing recently visited TV shows
 * Stores up to 20 most recent shows with visit timestamps
 */

import type { RecentlyVisitedShow, TVShow } from '@/types';

const STORAGE_KEY = 'tvshows_recently_visited';
const MAX_RECENT_SHOWS = 20;

/**
 * Get all recently visited shows from local storage
 * Returns empty array if no shows or parsing fails
 */
export function getRecentlyVisitedShows(): RecentlyVisitedShow[] {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];

        const shows = JSON.parse(data) as RecentlyVisitedShow[];
        // Sort by most recent first
        return shows.sort(
            (a, b) =>
                new Date(b.visitedAt).getTime() -
                new Date(a.visitedAt).getTime()
        );
    } catch (error) {
        console.error('Error reading recently visited shows:', error);
        return [];
    }
}

/**
 * Add or update a show in recently visited list
 * If show already exists, updates the visitedAt timestamp
 * Maintains max limit of MAX_RECENT_SHOWS
 *
 * @param show - TV show to add (without _embedded data)
 */
export function addRecentlyVisitedShow(show: Omit<TVShow, '_embedded'>): void {
    try {
        const shows = getRecentlyVisitedShows();

        // Remove existing entry if present
        const filteredShows = shows.filter((item) => item.show.id !== show.id);

        // Add new entry at the beginning
        const updatedShows: RecentlyVisitedShow[] = [
            {
                show,
                visitedAt: new Date().toISOString(),
            },
            ...filteredShows,
        ];

        // Keep only MAX_RECENT_SHOWS
        const limitedShows = updatedShows.slice(0, MAX_RECENT_SHOWS);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedShows));
    } catch (error) {
        console.error('Error adding recently visited show:', error);
    }
}

/**
 * Remove a show from recently visited list
 *
 * @param showId - ID of the show to remove
 */
export function removeRecentlyVisitedShow(showId: number): void {
    try {
        const shows = getRecentlyVisitedShows();
        const filteredShows = shows.filter((item) => item.show.id !== showId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredShows));
    } catch (error) {
        console.error('Error removing recently visited show:', error);
    }
}

/**
 * Clear all recently visited shows
 */
export function clearRecentlyVisitedShows(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing recently visited shows:', error);
    }
}
