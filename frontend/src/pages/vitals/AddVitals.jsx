import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addVitals } from '../../features/vitals/vitalsAPI';
import { clearError, clearMessage } from '../../features/vitals/vitalsSlice';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AddVitals = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, successMessage } = useSelector((state) => state.vitals);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        // BP object banao
        const formData = {
            bp: {
                systolic: data.systolic ? Number(data.systolic) : undefined,
                diastolic: data.diastolic ? Number(data.diastolic) : undefined,
            },
            sugar: data.sugar ? Number(data.sugar) : undefined,
            weight: data.weight ? Number(data.weight) : undefined,
            notes: data.notes,
            measuredAt: data.measuredAt,
        };

        dispatch(addVitals(formData));
    };

    // Success hone pe vitals page pe bhejo
    useEffect(() => {
        if (successMessage) {
            setTimeout(() => navigate('/vitals'), 1500);
        }
    }, [successMessage]);

    // Page chhodne pe clear karo
    useEffect(() => {
        return () => {
            dispatch(clearError());
            dispatch(clearMessage());
        };
    }, []);

    return (
        <div className="max-w-2xl mx-auto">

            <Card className="border border-gray-100 shadow-none">

                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                        Add Vitals
                    </CardTitle>
                </CardHeader>

                <CardContent>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {successMessage && (
                        <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-md mb-4">
                            {successMessage} Redirecting...
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Blood Pressure */}
                        <div className="space-y-2">
                            <Label>Blood Pressure (mmHg)</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Input
                                        type="number"
                                        placeholder="Systolic (e.g. 120)"
                                        {...register('systolic')}
                                    />
                                    <p className="text-xs text-gray-400">Upper value</p>
                                </div>
                                <div className="space-y-1">
                                    <Input
                                        type="number"
                                        placeholder="Diastolic (e.g. 80)"
                                        {...register('diastolic')}
                                    />
                                    <p className="text-xs text-gray-400">Lower value</p>
                                </div>
                            </div>
                        </div>

                        {/* Sugar */}
                        <div className="space-y-1">
                            <Label htmlFor="sugar">Blood Sugar (mg/dL)</Label>
                            <Input
                                id="sugar"
                                type="number"
                                placeholder="e.g. 95"
                                {...register('sugar')}
                            />
                        </div>

                        {/* Weight */}
                        <div className="space-y-1">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                                id="weight"
                                type="number"
                                placeholder="e.g. 70"
                                {...register('weight')}
                            />
                        </div>

                        {/* Date */}
                        <div className="space-y-1">
                            <Label htmlFor="measuredAt">Date & Time</Label>
                            <Input
                                id="measuredAt"
                                type="datetime-local"
                                {...register('measuredAt', {
                                    required: 'Date is required',
                                })}
                            />
                            {errors.measuredAt && (
                                <p className="text-red-500 text-xs">
                                    {errors.measuredAt.message}
                                </p>
                            )}
                        </div>

                        {/* Notes */}
                        <div className="space-y-1">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <textarea
                                id="notes"
                                rows={3}
                                placeholder="Any additional notes..."
                                className="w-full border border-gray-200 rounded-md px-3 py-2
                                         text-sm text-gray-700 focus:outline-none focus:ring-2
                                         focus:ring-blue-500 resize-none"
                                {...register('notes')}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => navigate('/vitals')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Vitals'}
                            </Button>
                        </div>

                    </form>

                </CardContent>
            </Card>
        </div>
    );
};

export default AddVitals;