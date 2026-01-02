/**
 * DetailsPage - Display full details for a TV show
 * Shows information, cast, seasons, episodes, and images
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useShowDetails } from '@/api/search';
import { addRecentlyVisitedShow } from '@/utils/localStorage';
import {
    HeroSection,
    SeasonsSection,
    CastSection,
    ImagesSection,
} from '@/components/show-details';

export function DetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const showId = parseInt(id || '0', 10);

    const { data: show, isLoading, isError, error } = useShowDetails(showId);

    // Add to recently visited when show data loads
    useEffect(() => {
        if (show) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _embedded, ...showWithoutEmbedded } = show;
            addRecentlyVisitedShow(showWithoutEmbedded);
        }
    }, [show]);

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900">
                <p className="text-lg text-gray-400">Loading show details...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900">
                <div className="text-center">
                    <p className="mb-4 text-lg text-red-400">
                        {error instanceof Error &&
                        error.message === 'Show not found'
                            ? 'Show not found'
                            : 'Error loading show details'}
                    </p>
                    <button
                        onClick={handleBack}
                        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!show) return null;

    return (
        <div className="min-h-screen bg-gray-900">
            <HeroSection show={show} onBack={handleBack} />
            <SeasonsSection show={show} />
            <CastSection show={show} />
            <ImagesSection show={show} />
        </div>
    );
}
