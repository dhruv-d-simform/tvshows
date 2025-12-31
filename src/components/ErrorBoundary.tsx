import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

/**
 * Error boundary component to catch and display React errors
 */
export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="text-center p-8 max-w-md">
                        <h1 className="text-2xl font-bold text-red-500 mb-4">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-muted-foreground mb-4">
                            We encountered an unexpected error. Please try
                            refreshing the page.
                        </p>
                        <div className="space-x-2">
                            <Button onClick={() => window.location.reload()}>
                                Refresh Page
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Go Back
                            </Button>
                        </div>
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mt-4 text-left">
                                <summary className="cursor-pointer text-sm">
                                    Error Details
                                </summary>
                                <pre className="text-xs mt-2 p-2 bg-muted rounded overflow-auto">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
