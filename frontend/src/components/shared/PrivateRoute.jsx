import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
    const { user, loading } = useSelector((state) => state.auth);

    // getMe() chal raha hai — wait karo
    if (loading) return <div>Loading...</div>;

    // User hai to andar jane do, nahi to login
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;