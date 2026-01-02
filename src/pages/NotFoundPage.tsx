/**
 * NotFoundPage - 404 error page
 * Displayed when user navigates to a non-existent route
 */

import { useNavigate } from 'react-router';
import { Home } from 'lucide-react';

export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="text-center">
                <h1 className="mb-4 text-9xl font-bold text-blue-500">404</h1>
                <h2 className="mb-4 text-3xl font-semibold text-white">
                    Page Not Found
                </h2>
                <p className="mb-8 text-gray-400">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                    <Home className="h-5 w-5" />
                    Go to Homepage
                </button>
            </div>
        </div>
    );
}
