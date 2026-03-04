import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getOneFile } from '../../features/files/filesAPI';
import { analyzeFile } from '../../features/ai/aiAPI';
import { clearCurrentFile } from '../../features/files/filesSlice';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    FileText, ArrowLeft, Loader2, Brain,
    AlertCircle, MessageSquare, Utensils, Home
} from 'lucide-react';

const ViewReport = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams(); // URL se file id lo

    const { currentFile, loading } = useSelector((state) => state.files);
    const { insight, loading: aiLoading } = useSelector((state) => state.ai);

    // Page load pe file fetch karo
    useEffect(() => {
        dispatch(getOneFile(id));
    }, [id]);

    // Page chhodne pe clear karo
    useEffect(() => {
        return () => dispatch(clearCurrentFile());
        dispatch(clearInsight()); // ← add karo
    }, []);

    // AI Analysis start karo
    const handleAnalyze = () => {
        dispatch(analyzeFile(id));
    };

    if (loading) return (
        <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-blue-600" />
        </div>
    );

    if (!currentFile) return null;

    

    return (
        <div className="max-w-3xl mx-auto space-y-5">

            {/* ============================================ */}
            {/* Header */}
            {/* ============================================ */}
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/reports')}
                    className="gap-1"
                >
                    <ArrowLeft size={14} />
                    Back
                </Button>
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {currentFile.fileName}
                </h2>
            </div>

            {/* ============================================ */}
            {/* File Preview */}
            {/* ============================================ */}
            <Card className="border border-gray-100 shadow-none">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-gray-800">
                        Report Preview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {currentFile.fileType === 'pdf' ? (
                        <iframe
                            src={currentFile.cloudinary.url}
                            className="w-full h-96 rounded-md border border-gray-100"
                            title="PDF Preview"
                        />
                    ) : (
                        <img
                            src={currentFile.cloudinary.url}
                            alt="Report"
                            className="max-h-96 mx-auto rounded-md object-contain"
                        />
                    )}
                </CardContent>
            </Card>

            {/* ============================================ */}
            {/* AI Analysis Button */}
            {/* ============================================ */}
            {!insight && (
                <div className="text-center py-6 bg-white rounded-xl border border-gray-100">
                    <Brain size={36} className="mx-auto mb-3 text-purple-400" />
                    <p className="text-sm font-medium text-gray-800">
                        Get AI Analysis
                    </p>
                    <p className="text-xs text-gray-400 mt-1 mb-4">
                        Let AI explain your report in simple words
                    </p>
                    <Button
                        onClick={handleAnalyze}
                        className="bg-purple-600 hover:bg-purple-700 gap-2"
                        disabled={aiLoading}
                    >
                        {aiLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Brain size={16} />
                                Analyze with AI
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* ============================================ */}
            {/* AI Insight */}
            {/* ============================================ */}
            {insight && (
                <div className="space-y-4">

                    {/* English Summary */}
                    <Card className="border border-gray-100 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                <Brain size={18} className="text-purple-600" />
                                AI Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">English</p>
                                <p className="text-sm text-gray-700">{insight.summaryEnglish}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">Roman Urdu</p>
                                <p className="text-sm text-gray-700">{insight.summaryUrdu}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Abnormal Values */}
                    {insight.abnormalValues?.length > 0 && (
                        <Card className="border border-gray-100 shadow-none">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                    <AlertCircle size={18} className="text-red-500" />
                                    Abnormal Values
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {insight.abnormalValues.map((item, index) => (
                                        <div key={index}
                                            className="flex items-center justify-between 
                                                     px-3 py-2 bg-red-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700">
                                                {item.name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">
                                                    {item.value}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                                    ${item.status === 'High'
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Doctor Questions */}
                    {insight.doctorQuestions?.length > 0 && (
                        <Card className="border border-gray-100 shadow-none">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                    <MessageSquare size={18} className="text-blue-600" />
                                    Questions to Ask Your Doctor
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {insight.doctorQuestions.map((q, index) => (
                                        <li key={index}
                                            className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="text-blue-600 font-medium shrink-0">
                                                {index + 1}.
                                            </span>
                                            {q}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Food Suggestions */}
                    {insight.foodSuggestions && (
                        <Card className="border border-gray-100 shadow-none">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                    <Utensils size={18} className="text-green-600" />
                                    Food Suggestions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-red-500 mb-2">
                                        ❌ Avoid
                                    </p>
                                    <ul className="space-y-1">
                                        {insight.foodSuggestions.avoid?.map((food, index) => (
                                            <li key={index} className="text-sm text-gray-600">
                                                • {food}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-green-500 mb-2">
                                        ✅ Recommended
                                    </p>
                                    <ul className="space-y-1">
                                        {insight.foodSuggestions.recommended?.map((food, index) => (
                                            <li key={index} className="text-sm text-gray-600">
                                                • {food}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Home Remedies */}
                    {insight.homeRemedies?.length > 0 && (
                        <Card className="border border-gray-100 shadow-none">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                    <Home size={18} className="text-orange-500" />
                                    Home Remedies
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {insight.homeRemedies.map((remedy, index) => (
                                        <li key={index}
                                            className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="text-orange-500 shrink-0">•</span>
                                            {remedy}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                </div>
            )}

        </div>
    );
};

export default ViewReport;
// ```

// ---

// **Yeh page use kar raha hai `aiAPI` — ab banate hain:**
// ```
// features/ai/aiAPI.js
// features/ai/aiSlice.js