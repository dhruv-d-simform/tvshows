/**
 * SearchBar component for TV show search
 * Provides a text input with search icon and handles search queries
 */

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
    onSearch: (query: string) => void;
    initialQuery?: string;
    placeholder?: string;
}

export function SearchBar({
    onSearch,
    initialQuery = '',
    placeholder = 'Search for TV shows...',
}: SearchBarProps) {
    const [query, setQuery] = useState(initialQuery);

    // Update query when initialQuery changes
    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                <Input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="pl-11"
                    aria-label="Search for TV shows"
                />
            </div>
        </form>
    );
}
