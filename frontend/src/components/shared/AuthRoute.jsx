import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthRoute = () => {
    const { user } = useSelector((state) => state.auth);

    // User pehle se login hai to dashboard pe bhejo
    return user ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default AuthRoute;