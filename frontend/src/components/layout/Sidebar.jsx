import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/auth/authAPI';

// Lucide icons
import {
    LayoutDashboard,
    FileText,
    Activity,
    Clock,
    LogOut,
    Menu,
    X,
    Heart,
} from 'lucide-react';

// Nav links ka data
const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/reports', label: 'My Reports', icon: FileText },
    { path: '/vitals', label: 'My Vitals', icon: Activity },
    { path: '/timeline', label: 'Timeline', icon: Clock },
];

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Mobile mein sidebar open/close
    const [isOpen, setIsOpen] = useState(false);

    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    return (
        <>
            {/* ============================================ */}
            {/* Mobile — Menu Button */}
            {/* ============================================ */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* ============================================ */}
            {/* Overlay — Mobile mein sidebar ke peeche */}
            {/* ============================================ */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/20 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* ============================================ */}
            {/* Sidebar */}
            {/* ============================================ */}
            <aside className={`
                fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 
                flex flex-col z-40 transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>

                {/* Logo */}
                <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
                    <Heart size={22} className="text-blue-600" />
                    <span className="text-lg font-semibold text-gray-800">
                        HealthMate
                    </span>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                                transition-colors duration-150
                                ${isActive
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }
                            `}
                        >
                            <link.icon size={18} />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* User Info + Logout */}
                <div className="px-3 py-4 border-t border-gray-100">

                    {/* User Info */}
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
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
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                                {user?.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                                 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>

                </div>
            </aside>
        </>
    );
};

export default Sidebar;