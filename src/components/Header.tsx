/**
 * Header component with site branding and search bar
 * Sticky header for home and search pages
 */

import { Link, useNavigate } from 'react-router';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
    showSearch?: boolean;
    initialQuery?: string;
    onSearch?: (query: string) => void;
}

export function Header({
    showSearch = true,
    initialQuery = '',
    onSearch,
}: HeaderProps) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    useEffect(() => {
        setSearchQuery(initialQuery);
    }, [initialQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            if (onSearch) {
                onSearch(searchQuery.trim());
            } else {
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            }
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-700 bg-gray-800 shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Site Branding */}
                    <Link
                        to="/"
                        className="text-2xl font-bold text-white hover:text-blue-400"
                    >
                        TV Shows
                    </Link>

                    {/* Search Bar */}
                    {showSearch && (
                        <form
                            onSubmit={handleSubmit}
                            className="flex-1 max-w-2xl"
                        >
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                                <Input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Search for TV shows..."
                                    className="pl-11 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                                    aria-label="Search for TV shows"
                                />
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </header>
    );
}
