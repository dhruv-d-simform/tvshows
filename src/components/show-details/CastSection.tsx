/**
 * CastSection - Display cast members with responsive pagination
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { TVShow } from '@/types';
import { CastMemberCard } from './CastMemberCard';

interface CastSectionProps {
    show: TVShow;
}

export function CastSection({ show }: CastSectionProps) {
    const [castPage, setCastPage] = useState(0);
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 1024
    );

    const cast = show._embedded?.cast || [];

    // Track window width for responsive pagination
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setCastPage(0); // Reset to first page on resize
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate items per page based on screen size
    const getItemsPerPage = () => {
        if (windowWidth < 640) return 8; // 4 cols × 2 rows
        if (windowWidth < 768) return 12; // 6 cols × 2 rows
        if (windowWidth < 1024) return 16; // 8 cols × 2 rows
        return 20; // 10 cols × 2 rows
    };

    const CAST_PER_PAGE = getItemsPerPage();
    const totalPages = Math.ceil(cast.length / CAST_PER_PAGE);
    const paginatedCast = cast.slice(
        castPage * CAST_PER_PAGE,
        (castPage + 1) * CAST_PER_PAGE
    );

    if (cast.length === 0) return null;

    return (
        <section className="border-t border-gray-800 bg-gray-900 py-12">
            <div className="container mx-auto px-4">
                <h2 className="mb-6 text-3xl font-bold text-white">Cast</h2>
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                    {paginatedCast.map((member) => (
                        <CastMemberCard
                            key={member.person.id}
                            member={member}
                        />
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Button
                            onClick={() =>
                                setCastPage((p) => Math.max(0, p - 1))
                            }
                            disabled={castPage === 0}
                            variant="secondary"
                        >
                            Previous
                        </Button>
                        <span className="text-white">
                            Page {castPage + 1} of {totalPages}
                        </span>
                        <Button
                            onClick={() =>
                                setCastPage((p) =>
                                    Math.min(totalPages - 1, p + 1)
                                )
                            }
                            disabled={castPage === totalPages - 1}
                            variant="secondary"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
