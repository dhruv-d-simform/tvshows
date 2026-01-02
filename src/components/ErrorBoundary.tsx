/**
 * ErrorBoundary component for catching React errors
 * Displays a friendly error message when something goes wrong
 */

import { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
                    <div className="max-w-md text-center">
                        <h1 className="mb-4 text-4xl font-bold text-red-400">
                            Oops! Something went wrong
                        </h1>
                        <p className="mb-6 text-gray-400">
                            {this.state.error?.message ||
                                'An unexpected error occurred'}
                        </p>
                        <button
                            onClick={() => (window.location.href = '/')}
                            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Go to Homepage
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
