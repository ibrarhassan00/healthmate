import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../features/auth/authAPI';
import { clearError } from '../../features/auth/authSlice';

// ShadCN components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import toast from 'react-hot-toast';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux se loading aur error lo
    const { loading, error, user , successMessage } = useSelector((state) => state.auth);

    // React Hook Form setup
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Form submit hone pe yeh chale ga
    const onSubmit = async(data) => {
        try {
            await dispatch(loginUser(data)).unwrap();
        } catch (error) {
            console.error('Reset failed:', err);
        }
    };

    // Login kamyab hua to dashboard pe bhejo
    useEffect(() => {    
        if (user) {
            navigate('/dashboard')
        
        };
    }, [user]);

    // Error clear karo jab page chhodo
    useEffect(() => {
        return () => dispatch(clearError());
    }, []);

    return (
        // Full screen center
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

            <Card className="w-full max-w-md shadow-md">

                {/* Header */}
                <CardHeader className="text-center">
                    <div className="text-4xl mb-2">🏥</div>
                    <CardTitle className="text-2xl text-gray-800">
                        HealthMate
                    </CardTitle>
                    <CardDescription>
                        Welcome back. Please enter your details
                    </CardDescription>
                </CardHeader>

                <CardContent>

                    {/* Backend Error */}
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Email */}
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email Address"
                                // React Hook Form se connect karo
                                {...register('email', {
                                    required: 'Email zaroor dalo',
                                    pattern: {
                                        value: /^\S+@\S+\.\S+$/,
                                        message: 'Email sahi nahi hai'
                                    }
                                })}
                            />
                            {/* Validation Error */}
                            {errors.email && (
                                <p className="text-red-500 text-xs">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password', {
                                    required: 'Password zaroor dalo',
                                    minLength: {
                                        value: 6,
                                        message: 'Password 6 characters ka hona chahiye'
                                    }
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Forgotten password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Login....' : 'Login'}
                        </Button>

                    </form>

                    {/* Register Link */}
                    <p className="text-center text-sm text-gray-500 mt-4">
                        To register{' '}
                        <Link to="/register" className="text-blue-600 hover:underline">
                            Create new account
                        </Link>
                    </p>

                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
// ```

// ---

// **Kya ho raha hai simple words mein:**
// ```
// User ne email + password dala
//         ↓
// handleSubmit → onSubmit chala
//         ↓
// dispatch(loginUser(data)) → backend pe request
//         ↓
// loading: true → Button disable "Login ho raha hai..."
//         ↓
// Success → user store mein → useEffect → /dashboard
// Error   → error store mein → red box mein dikhao