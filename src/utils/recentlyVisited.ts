import { useState, useEffect } from 'react';
import type { RecentlyVisitedShow, TVShow } from '@/types';

const STORAGE_KEY = 'recentlyVisitedShows';
const MAX_ITEMS = 20;

/**
 * Get recently visited shows from local storage
 * @returns Array of recently visited shows
 */
export function getRecentlyVisitedShows(): RecentlyVisitedShow[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * Add or update a show in recently visited list
 * @param show The TV show to add
 * @returns Updated list of recently visited shows
 */
export function addRecentlyVisitedShow(show: TVShow): RecentlyVisitedShow[] {
    const current = getRecentlyVisitedShows();
    const existingIndex = current.findIndex((item) => item.show.id === show.id);

    const newItem: RecentlyVisitedShow = {
        show,
        visitedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
        // Move to front
        current.splice(existingIndex, 1);
    }

    current.unshift(newItem);

    // Cap at MAX_ITEMS
    const capped = current.slice(0, MAX_ITEMS);

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
    } catch {
        // Ignore errors
    }

    return capped;
}

/**
 * Remove a show from recently visited list
 * @param showId The ID of the show to remove
 * @returns Updated list of recently visited shows
 */
export function removeRecentlyVisitedShow(
    showId: number
): RecentlyVisitedShow[] {
    const current = getRecentlyVisitedShows();
    const filtered = current.filter((item) => item.show.id !== showId);

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch {
        // Ignore errors
    }

    return filtered;
}

/**
 * React hook for managing recently visited shows
 * @returns Object with shows array, addShow and removeShow functions
 */
export function useRecentlyVisitedShows() {
    const [shows, setShows] = useState<RecentlyVisitedShow[]>([]);

    useEffect(() => {
        setShows(getRecentlyVisitedShows());
    }, []);

    const addShow = (show: TVShow) => {
        const updated = addRecentlyVisitedShow(show);
        setShows(updated);
    };

    const removeShow = (showId: number) => {
        const updated = removeRecentlyVisitedShow(showId);
        setShows(updated);
    };

    return { shows, addShow, removeShow };
}
