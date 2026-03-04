import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllVitals, deleteVitals } from '../../features/vitals/vitalsAPI';
import { clearError } from '../../features/vitals/vitalsSlice';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Trash2, Plus, Loader2 } from 'lucide-react';

const AllVitals = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { vitals, loading, error } = useSelector((state) => state.vitals);

    // Page load pe sare vitals fetch karo
    useEffect(() => {
        dispatch(getAllVitals());
    }, []);

    // Page chhodne pe clear karo
    useEffect(() => {
        return () => dispatch(clearError());
    }, []);

    // Delete karo
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            dispatch(deleteVitals(id));
        }
    };

    // Date format karo
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">My Vitals</h2>
                    <p className="text-sm text-gray-500">{vitals.length} entries found</p>
                </div>
                <Button
                    onClick={() => navigate('/vitals/add')}
                    className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                    <Plus size={16} />
                    Add Vitals
                </Button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-md">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={28} className="animate-spin text-blue-600" />
                </div>
            )}

            {/* Empty State */}
            {!loading && vitals.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <Activity size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No vitals logged yet</p>
                    <p className="text-xs mt-1">Start tracking your BP, Sugar and Weight</p>
                    <Button
                        onClick={() => navigate('/vitals/add')}
                        variant="outline"
                        className="mt-4 text-blue-600 border-blue-200"
                    >
                        Add First Entry
                    </Button>
                </div>
            )}

            {/* Vitals List */}
            {!loading && vitals.length > 0 && (
                <div className="space-y-3">
                    {vitals.map((vital) => (
                        <Card key={vital._id} className="border border-gray-100 shadow-none">
                            <CardContent className="py-4">

                                <div className="flex items-start justify-between">

                                    {/* Left — Vitals Data */}
                                    <div className="flex items-start gap-4">

                                        {/* Icon */}
                                        <div className="w-10 h-10 rounded-lg bg-green-50
                                                      flex items-center justify-center shrink-0">
                                            <Activity size={20} className="text-green-600" />
                                        </div>

                                        {/* Data */}
                                        <div className="space-y-1">

                                            {/* BP */}
                                            {vital.bp?.systolic && (
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-medium">BP: </span>
                                                    {vital.bp.systolic}/{vital.bp.diastolic} mmHg
                                                </p>
                                            )}

                                            {/* Sugar */}
                                            {vital.sugar && (
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-medium">Sugar: </span>
                                                    {vital.sugar} mg/dL
                                                </p>
                                            )}

                                            {/* Weight */}
                                            {vital.weight && (
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-medium">Weight: </span>
                                                    {vital.weight} kg
                                                </p>
                                            )}

                                            {/* Notes */}
                                            {vital.notes && (
                                                <p className="text-xs text-gray-400">
                                                    {vital.notes}
                                                </p>
                                            )}

                                            {/* Date */}
                                            <p className="text-xs text-gray-400">
                                                {formatDate(vital.measuredAt)}
                                            </p>

                                        </div>
                                    </div>

                                    {/* Right — Delete Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500 border-red-200 hover:bg-red-50"
                                        onClick={() => handleDelete(vital._id)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>

                                </div>

                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

        </div>
    );
};

export default AllVitals;