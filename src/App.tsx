import { Outlet } from 'react-router';

function App() {
    return (
        <div className="min-h-screen bg-gray-900">
            {/* Page Content */}
            <Outlet />
        </div>
    );
}

export default App;
