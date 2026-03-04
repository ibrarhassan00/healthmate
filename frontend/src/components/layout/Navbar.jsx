import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';

// Har page ka title
const pageTitles = {
    '/dashboard': 'Dashboard',
    '/reports': 'My Reports',
    '/vitals': 'My Vitals',
    '/timeline': 'Timeline',
};

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    // Current page ka title
    const pageTitle = pageTitles[location.pathname] || 'HealthMate';

    return (
        <header className="h-16 bg-white border-b border-gray-100 
                          flex items-center justify-between px-6">

            {/* Page Title — Mobile mein thoda right shift */}
            <h1 className="text-lg font-semibold text-gray-800 ml-10 lg:ml-0">
                {pageTitle}
            </h1>

            {/* Right Side */}
            <div className="flex items-center gap-3">

                {/* Greeting */}
                <span className="text-sm text-gray-500 hidden sm:block">
                    Welcome, {user?.name?.split(' ')[0]}
                </span>

                {/* Profile Image ya Initials */}
                {user?.profileImage?.url ? (
                    <img
                        src={user.profileImage.url}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 
                                  flex items-center justify-center text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                )}

            </div>
        </header>
    );
};

export default Navbar;