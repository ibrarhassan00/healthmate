import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../../features/files/filesAPI';
import { clearError, clearMessage } from '../../features/files/filesSlice';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const reportTypes = [
    { value: 'blood_test', label: 'Blood Test' },
    { value: 'xray', label: 'X-Ray' },
    { value: 'ultrasound', label: 'Ultrasound' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'other', label: 'Other' },
];

const UploadReport = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, successMessage } = useSelector((state) => state.files);

    // File preview ke liye
    const [preview, setPreview] = useState(null);
    const [fileError, setFileError] = useState('');

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    // File change hone pe preview dikhao
    const selectedFile = watch('file');
    useEffect(() => {
        if (selectedFile && selectedFile[0]) {
            const file = selectedFile[0];

            // Sirf PDF ya Image allow karo
            if (file.type === 'application/pdf') {
                setPreview('pdf');
                setFileError('');
            } else if (file.type.startsWith('image/')) {
                setPreview(URL.createObjectURL(file));
                setFileError('');
            } else {
                setPreview(null);
                setFileError('Only PDF or Image files are allowed');
            }
        }
    }, [selectedFile]);

    const onSubmit = (data) => {
        // FormData banao — file upload ke liye
        const formData = new FormData();
        formData.append('file', data.file[0]);
        formData.append('reportType', data.reportType);
        formData.append('reportDate', data.reportDate);
        formData.append('notes', data.notes || '');

        dispatch(uploadFile(formData));
    };

    // Upload kamyab hua to reports pe bhejo
    useEffect(() => {
        if (successMessage) {
            setTimeout(() => navigate('/reports'), 1500);
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
                        Upload Medical Report
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

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* File Upload */}
                        <div className="space-y-1">
                            <Label>Report File</Label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                                <Input
                                    type="file"
                                    accept=".pdf,image/*"
                                    className="hidden"
                                    id="file"
                                    {...register('file', {
                                        required: 'Please select a file',
                                    })}
                                />
                                <label htmlFor="file" className="cursor-pointer">
                                    {/* File Preview */}
                                    {preview === 'pdf' ? (
                                        <div className="text-blue-600">
                                            <p className="text-3xl mb-1">📄</p>
                                            <p className="text-sm font-medium">
                                                {selectedFile[0]?.name}
                                            </p>
                                        </div>
                                    ) : preview ? (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="max-h-32 mx-auto rounded-md object-contain"
                                        />
                                    ) : (
                                        <div className="text-gray-400">
                                            <p className="text-3xl mb-1">📁</p>
                                            <p className="text-sm">
                                                Click to upload PDF or Image
                                            </p>
                                            <p className="text-xs mt-1">
                                                PDF, JPG, PNG supported
                                            </p>
                                        </div>
                                    )}
                                </label>
                            </div>
                            {errors.file && (
                                <p className="text-red-500 text-xs">{errors.file.message}</p>
                            )}
                            {fileError && (
                                <p className="text-red-500 text-xs">{fileError}</p>
                            )}
                        </div>

                        {/* Report Type */}
                        <div className="space-y-1">
                            <Label htmlFor="reportType">Report Type</Label>
                            <select
                                id="reportType"
                                className="w-full border border-gray-200 rounded-md px-3 py-2 
                                         text-sm text-gray-700 focus:outline-none focus:ring-2 
                                         focus:ring-blue-500"
                                {...register('reportType', {
                                    required: 'Please select report type',
                                })}
                            >
                                <option value="">Select report type</option>
                                {reportTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            {errors.reportType && (
                                <p className="text-red-500 text-xs">{errors.reportType.message}</p>
                            )}
                        </div>

                        {/* Report Date */}
                        <div className="space-y-1">
                            <Label htmlFor="reportDate">Report Date</Label>
                            <Input
                                id="reportDate"
                                type="date"
                                {...register('reportDate', {
                                    required: 'Please select report date',
                                })}
                            />
                            {errors.reportDate && (
                                <p className="text-red-500 text-xs">{errors.reportDate.message}</p>
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
                                onClick={() => navigate('/reports')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                disabled={loading || !!fileError}
                            >
                                {loading ? 'Uploading...' : 'Upload Report'}
                            </Button>
                        </div>

                    </form>

                </CardContent>
            </Card>
        </div>
    );
};

export default UploadReport;