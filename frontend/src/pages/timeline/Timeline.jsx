import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllFiles } from '../../features/files/filesAPI';
import { getAllVitals } from '../../features/vitals/vitalsAPI';

import { Card, CardContent } from '@/components/ui/card';
import { FileText, Activity, Loader2 } from 'lucide-react';

const reportTypeLabels = {
    blood_test: 'Blood Test',
    xray: 'X-Ray',
    ultrasound: 'Ultrasound',
    prescription: 'Prescription',
    other: 'Other',
};

const Timeline = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { files, loading: filesLoading } = useSelector((state) => state.files);
    const { vitals, loading: vitalsLoading } = useSelector((state) => state.vitals);

    // Page load pe dono fetch karo
    useEffect(() => {
        dispatch(getAllFiles());
        dispatch(getAllVitals());
    }, []);

    // Files + Vitals ko ek saath mix karo aur date se sort karo
    const timelineItems = [
        // Files ko timeline format mein convert karo
        ...files.map((file) => ({
            id: file._id,
            type: 'report',
            date: new Date(file.reportDate),
            title: file.fileName,
            subtitle: reportTypeLabels[file.reportType],
            data: file,
        })),

        // Vitals ko timeline format mein convert karo
        ...vitals.map((vital) => ({
            id: vital._id,
            type: 'vital',
            date: new Date(vital.measuredAt),
            title: 'Vitals Entry',
            subtitle: [
                vital.bp?.systolic ? `BP: ${vital.bp.systolic}/${vital.bp.diastolic}` : null,
                vital.sugar ? `Sugar: ${vital.sugar}` : null,
                vital.weight ? `Weight: ${vital.weight}kg` : null,
            ].filter(Boolean).join(' · '),
            data: vital,
        })),
    ]
    // Date se sort karo — nayi pehle
    .sort((a, b) => b.date - a.date);

    // Date format karo
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const isLoading = filesLoading || vitalsLoading;

    return (
        <div className="space-y-5">

            {/* Header */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800">Timeline</h2>
                <p className="text-sm text-gray-500">
                    All your health records sorted by date
                </p>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={28} className="animate-spin text-blue-600" />
                </div>
            )}

            {/* Empty State */}
            {!isLoading && timelineItems.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <Activity size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No records found</p>
                    <p className="text-xs mt-1">
                        Upload a report or add vitals to see your timeline
                    </p>
                </div>
            )}

            {/* Timeline Items */}
            {!isLoading && timelineItems.length > 0 && (
                <div className="relative">

                    {/* Vertical Line */}
                    <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-100" />

                    <div className="space-y-4">
                        {timelineItems.map((item) => (
                            <div key={`${item.type}-${item.id}`}
                                className="flex items-start gap-4 relative">

                                {/* Circle Icon */}
                                <div className={`w-10 h-10 rounded-full flex items-center 
                                              justify-center shrink-0 z-10 border-2 border-white
                                              ${item.type === 'report'
                                                ? 'bg-blue-50'
                                                : 'bg-green-50'
                                              }`}>
                                    {item.type === 'report' ? (
                                        <FileText size={18} className="text-blue-600" />
                                    ) : (
                                        <Activity size={18} className="text-green-600" />
                                    )}
                                </div>

                                {/* Content */}
                                <Card
                                    className={`flex-1 border border-gray-100 shadow-none
                                              ${item.type === 'report'
                                                ? 'cursor-pointer hover:border-blue-200 transition-colors'
                                                : ''
                                              }`}
                                    onClick={() => {
                                        if (item.type === 'report') {
                                            navigate(`/reports/${item.id}`);
                                        }
                                    }}
                                >
                                    <CardContent className="py-3 px-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 truncate">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {item.subtitle}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-400 shrink-0 ml-2">
                                                {formatDate(item.date)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Timeline;