import { Outlet } from 'react-router';

function App() {
    return (
        <div className="min-h-screen">
            {/* Page Content */}
            <Outlet />
        </div>
    );
}

export default App;
