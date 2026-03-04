import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../features/auth/authAPI';
import { clearError, clearMessage } from '../../features/auth/authSlice';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const ForgotPassword = () => {
    const dispatch = useDispatch();

    const { loading, error, successMessage } = useSelector((state) => state.auth);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        dispatch(forgotPassword(data.email));
    };

    // Page chhodne pe clear karo
    useEffect(() => {
        return () => {
            dispatch(clearError());
            dispatch(clearMessage());
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

            <Card className="w-full max-w-md shadow-md">

                <CardHeader className="text-center">
                    <div className="text-4xl mb-2">🔐</div>
                    <CardTitle className="text-2xl text-gray-800">
                        Forgot Password
                    </CardTitle>
                    <CardDescription>
                        Enter your email to receive a reset OTP
                    </CardDescription>
                </CardHeader>

                <CardContent>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    {/* Success — OTP bhej diya */}
                    {successMessage && (
                        <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-md mb-4">
                            {successMessage} — 
                            <Link to="/reset-password" className="font-medium underline ml-1">
                                Reset password now
                            </Link>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Email */}
                        <div className="space-y-1">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Your registered email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+\.\S+$/,
                                        message: 'Please enter a valid email'
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs">{errors.email.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </Button>

                    </form>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Remember your password?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Back to login
                        </Link>
                    </p>

                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
// ```

// ---

// **Flow:**
// ```
// User email dalta hai
//       ↓
// OTP email pe jaata hai
//       ↓
// successMessage dikhta hai + "Reset password now" link
//       ↓
// /reset-password pe jaata hai