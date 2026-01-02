/**
 * NotFoundPage - 404 error page
 * Displayed when user navigates to a non-existent route
 */

import { useNavigate } from 'react-router';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="mb-4 text-9xl font-bold text-blue-500">404</h1>
                <h2 className="mb-4 text-3xl font-semibold text-white">
                    Page Not Found
                </h2>
                <p className="mb-8 text-gray-400">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Button
                    onClick={() => navigate('/')}
                    size="lg"
                    className="gap-2"
                >
                    <Home className="h-5 w-5" />
                    Go to Homepage
                </Button>
            </div>
        </div>
    );
}
