import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllFiles, deleteFile } from '../../features/files/filesAPI';
import { clearError } from '../../features/files/filesSlice';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Trash2, Eye, Upload, Loader2 } from 'lucide-react';

const reportTypeLabels = {
    blood_test: 'Blood Test',
    xray: 'X-Ray',
    ultrasound: 'Ultrasound',
    prescription: 'Prescription',
    other: 'Other',
};

const reportTypeColors = {
    blood_test: 'bg-red-50 text-red-600',
    xray: 'bg-blue-50 text-blue-600',
    ultrasound: 'bg-purple-50 text-purple-600',
    prescription: 'bg-green-50 text-green-600',
    other: 'bg-gray-50 text-gray-600',
};

const AllReports = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { files, loading, error } = useSelector((state) => state.files);

    useEffect(() => {
        dispatch(getAllFiles());
    }, []);

    useEffect(() => {
        return () => dispatch(clearError());
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            dispatch(deleteFile(id));
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">My Reports</h2>
                    <p className="text-sm text-gray-500">{files.length} reports found</p>
                </div>
                <Button
                    onClick={() => navigate('/reports/upload')}
                    className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                    <Upload size={16} />
                    Upload Report
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
            {!loading && files.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <FileText size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No reports uploaded yet</p>
                    <p className="text-xs mt-1">Upload your first medical report</p>
                    <Button
                        onClick={() => navigate('/reports/upload')}
                        variant="outline"
                        className="mt-4 text-blue-600 border-blue-200"
                    >
                        Upload Report
                    </Button>
                </div>
            )}

            {/* Files List */}
            {!loading && files.length > 0 && (
                <div className="space-y-3">
                    {files.map((file) => (
                        <Card key={file._id} className="border border-gray-100 shadow-none">
                            <CardContent className="flex items-center gap-4 py-4">

                                <div className="w-10 h-10 rounded-lg bg-blue-50
                                              flex items-center justify-center shrink-0">
                                    <FileText size={20} className="text-blue-600" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                        {file.fileName}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                            ${reportTypeColors[file.reportType]}`}>
                                            {reportTypeLabels[file.reportType]}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {formatDate(file.reportDate)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                                        onClick={() => navigate(`/reports/${file._id}`)}
                                    >
                                        <Eye size={14} />
                                        View
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1 text-red-500 border-red-200 hover:bg-red-50"
                                        onClick={() => handleDelete(file._id)}
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

export default AllReports;