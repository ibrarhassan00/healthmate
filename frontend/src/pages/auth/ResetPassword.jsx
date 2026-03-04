import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../features/auth/authAPI';
import { clearError, clearMessage } from '../../features/auth/authSlice';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Track karo — user ne form submit kiya ya nahi
    const [isReset, setIsReset] = useState(false);

    const { loading, error, successMessage } = useSelector((state) => state.auth);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const newPassword = watch('newPassword');

    console.log('successMessage:', successMessage);


    // Form submit hone pe yeh chale ga
    const onSubmit = async (data) => {
   try {
        await dispatch(resetPassword({
            otp: data.otp,
            newPassword: data.newPassword,
        })).unwrap(); // ✅ Sirf fulfilled pe aage jaye ga, rejected pe catch mein jaye ga

        setIsReset(true); // Yeh sirf success pe chalega
    } catch (err) {
        // API fail hui — isReset false rahega
        console.error('Reset failed:', err);
    }
    };

    // Sirf tab navigate karo jab reset action se successMessage aaya
    useEffect(() => {
        if (successMessage && isReset) {
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        }
    }, [successMessage, isReset]);

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
                    <div className="text-4xl mb-2">🔑</div>
                    <CardTitle className="text-2xl text-gray-800">
                        Reset Password
                    </CardTitle>
                    <CardDescription>
                        Enter the OTP sent to your email and set a new password
                    </CardDescription>
                </CardHeader>

                <CardContent>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    {/* Success — sirf tab dikho jab reset hua ho */}
                    {successMessage && isReset && (
                        <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-md mb-4">
                            Password reset successful! Redirecting...
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* OTP */}
                        <div className="space-y-1">
                            <Label htmlFor="otp">OTP Code</Label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                {...register('otp', {
                                    required: 'OTP is required',
                                    minLength: {
                                        value: 6,
                                        message: 'OTP must be 6 digits'
                                    }
                                })}
                            />
                            {errors.otp && (
                                <p className="text-red-500 text-xs">{errors.otp.message}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-1">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="••••••••"
                                {...register('newPassword', {
                                    required: 'New password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                            />
                            {errors.newPassword && (
                                <p className="text-red-500 text-xs">{errors.newPassword.message}</p>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (value) =>
                                        value === newPassword || 'Passwords do not match'
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={loading || (successMessage && isReset)}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;