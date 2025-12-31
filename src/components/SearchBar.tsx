import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    initialValue?: string;
}

export function SearchBar({ onSearch, initialValue = '' }: SearchBarProps) {
    const [query, setQuery] = useState(initialValue);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <Input
                type="text"
                placeholder="Search for TV shows..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
            />
            <Button type="submit" disabled={!query.trim()}>
                <Search className="w-4 h-4" />
                Search
            </Button>
        </form>
    );
}
