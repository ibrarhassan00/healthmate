import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* Sidebar — Left side */}
            <Sidebar />

            {/* Main Content — Right side */}
            <div className="flex-1 flex flex-col lg:ml-64">

                {/* Navbar — Top */}
                <Navbar />

                {/* Page Content — Yahan har page render hoga */}
                <main className="flex-1 p-6">
                    <Outlet /> {/* ← Private routes yahan render honge */}
                </main>

            </div>
        </div>
    );
};

export default Layout;