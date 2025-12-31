import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from '@/router';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import '@/index.css';

const queryClient = new QueryClient();

// Enable dark mode
document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </ErrorBoundary>
    </StrictMode>
);
