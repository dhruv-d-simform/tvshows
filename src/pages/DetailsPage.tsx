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
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

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
            <div className="min-h-screen bg-gray-900 p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Hero skeleton */}
                    <Skeleton className="h-[500px] w-full rounded-lg bg-gray-800" />

                    {/* Seasons skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-48 bg-gray-800" />
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="h-32 bg-gray-800"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6">
                <div className="w-full max-w-md space-y-4 text-center">
                    <Alert variant="destructive">
                        <AlertDescription>
                            {error instanceof Error &&
                            error.message === 'Show not found'
                                ? 'Show not found'
                                : 'Error loading show details'}
                        </AlertDescription>
                    </Alert>
                    <Button onClick={handleBack} size="lg">
                        Go Back
                    </Button>
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
