import { Link, Outlet } from 'react-router';
import { Home, Search } from 'lucide-react';

function App() {
    return (
        <div className="min-h-screen bg-gray-900">
            {/* Navigation */}
            <nav className="border-b border-gray-700 bg-gray-800">
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                    <Link
                        to="/"
                        className="text-2xl font-bold text-white hover:text-blue-400"
                    >
                        TV Shows
                    </Link>
                    <div className="flex gap-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors hover:bg-gray-700"
                        >
                            <Home className="h-5 w-5" />
                            <span>Home</span>
                        </Link>
                        <Link
                            to="/search"
                            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors hover:bg-gray-700"
                        >
                            <Search className="h-5 w-5" />
                            <span>Search</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <Outlet />
        </div>
    );
}

export default App;
