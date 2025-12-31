import { Link } from 'react-router';

export function Header() {
    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4">
                <Link
                    to="/"
                    className="text-2xl font-bold hover:text-muted-foreground transition-colors"
                >
                    TV Shows
                </Link>
            </div>
        </header>
    );
}
