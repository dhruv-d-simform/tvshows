import { Link } from 'react-router';
import { SearchBar } from '@/components/SearchBar';

interface HeaderProps {
    onSearch: (query: string) => void;
    initialValue?: string;
}

export function Header({ onSearch, initialValue }: HeaderProps) {
    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link
                    to="/"
                    className="text-2xl font-bold hover:text-muted-foreground transition-colors"
                >
                    TV Shows
                </Link>
                <SearchBar onSearch={onSearch} initialValue={initialValue} />
            </div>
        </header>
    );
}
