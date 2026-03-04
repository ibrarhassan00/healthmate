// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { FileText, Activity, Clock, Upload, Plus } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';

// const Dashboard = () => {
//     const { user } = useSelector((state) => state.auth);
//     const navigate = useNavigate();

//     return (
//         <div className="space-y-6">

//             {/* ============================================ */}
//             {/* Welcome Section */}
//             {/* ============================================ */}
//             <div className="bg-white rounded-xl p-6 border border-gray-100">
//                 <h2 className="text-xl font-semibold text-gray-800">
//                     Good day, {user?.name?.split(' ')[0]}! 👋
//                 </h2>
//                 <p className="text-gray-500 text-sm mt-1">
//                     Manage your health records and track your vitals
//                 </p>
//             </div>

//             {/* ============================================ */}
//             {/* Stats Cards */}
//             {/* ============================================ */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

//                 {/* Total Reports */}
//                 <Card className="border border-gray-100 shadow-none">
//                     <CardContent className="flex items-center gap-4 pt-6">
//                         <div className="w-10 h-10 rounded-lg bg-blue-50 
//                                       flex items-center justify-center">
//                             <FileText size={20} className="text-blue-600" />
//                         </div>
//                         <div>
//                             <p className="text-2xl font-semibold text-gray-800">0</p>
//                             <p className="text-sm text-gray-500">Total Reports</p>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* Vitals Logged */}
//                 <Card className="border border-gray-100 shadow-none">
//                     <CardContent className="flex items-center gap-4 pt-6">
//                         <div className="w-10 h-10 rounded-lg bg-green-50 
//                                       flex items-center justify-center">
//                             <Activity size={20} className="text-green-600" />
//                         </div>
//                         <div>
//                             <p className="text-2xl font-semibold text-gray-800">0</p>
//                             <p className="text-sm text-gray-500">Vitals Logged</p>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* AI Analysis */}
//                 <Card className="border border-gray-100 shadow-none">
//                     <CardContent className="flex items-center gap-4 pt-6">
//                         <div className="w-10 h-10 rounded-lg bg-purple-50 
//                                       flex items-center justify-center">
//                             <Clock size={20} className="text-purple-600" />
//                         </div>
//                         <div>
//                             <p className="text-2xl font-semibold text-gray-800">0</p>
//                             <p className="text-sm text-gray-500">AI Analysis Done</p>
//                         </div>
//                     </CardContent>
//                 </Card>

//             </div>

//             {/* ============================================ */}
//             {/* Quick Actions */}
//             {/* ============================================ */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//                 {/* Upload Report */}
//                 <div
//                     onClick={() => navigate('/reports/upload')}
//                     className="bg-white border border-gray-100 rounded-xl p-6 
//                              flex items-center gap-4 cursor-pointer 
//                              hover:border-blue-200 hover:bg-blue-50 transition-colors"
//                 >
//                     <div className="w-10 h-10 rounded-lg bg-blue-100 
//                                   flex items-center justify-center">
//                         <Upload size={20} className="text-blue-600" />
//                     </div>
//                     <div>
//                         <p className="font-medium text-gray-800">Upload Report</p>
//                         <p className="text-sm text-gray-500">
//                             Upload your medical reports
//                         </p>
//                     </div>
//                 </div>

//                 {/* Add Vitals */}
//                 <div
//                     onClick={() => navigate('/vitals/add')}
//                     className="bg-white border border-gray-100 rounded-xl p-6 
//                              flex items-center gap-4 cursor-pointer 
//                              hover:border-green-200 hover:bg-green-50 transition-colors"
//                 >
//                     <div className="w-10 h-10 rounded-lg bg-green-100 
//                                   flex items-center justify-center">
//                         <Plus size={20} className="text-green-600" />
//                     </div>
//                     <div>
//                         <p className="font-medium text-gray-800">Add Vitals</p>
//                         <p className="text-sm text-gray-500">
//                             Log your BP, Sugar, Weight
//                         </p>
//                     </div>
//                 </div>

//             </div>

//             {/* ============================================ */}
//             {/* Recent Reports — Baad mein real data aayega */}
//             {/* ============================================ */}
//             <Card className="border border-gray-100 shadow-none">
//                 <CardHeader>
//                     <CardTitle className="text-base font-semibold text-gray-800">
//                         Recent Reports
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="text-center py-8 text-gray-400">
//                         <FileText size={36} className="mx-auto mb-2 opacity-30" />
//                         <p className="text-sm">No reports uploaded yet</p>
//                         <Button
//                             onClick={() => navigate('/reports/upload')}
//                             variant="outline"
//                             className="mt-4 text-blue-600 border-blue-200"
//                         >
//                             Upload your first report
//                         </Button>
//                     </div>
//                 </CardContent>
//             </Card>

//         </div>
//     );
// };

// export default Dashboard;



import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllFiles } from '../../features/files/filesAPI';
import { getAllVitals } from '../../features/vitals/vitalsAPI';
import { FileText, Activity, Clock, Upload, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { files } = useSelector((state) => state.files);
    const { vitals } = useSelector((state) => state.vitals);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Page load pe data fetch karo
    useEffect(() => {
        dispatch(getAllFiles());
        dispatch(getAllVitals());
    }, []);

    // AI analysis count — jinki insight ban chuki hai
    const aiCount = files.filter((f) => f.hasInsight).length;

    return (
        <div className="space-y-6">

            {/* Welcome */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">
                    Good day, {user?.name?.split(' ')[0]}! 👋
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Manage your health records and track your vitals
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <Card className="border border-gray-100 shadow-none">
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FileText size={20} className="text-blue-600" />
                        </div>
                        <div>
                            {/* Real data */}
                            <p className="text-2xl font-semibold text-gray-800">
                                {files.length}
                            </p>
                            <p className="text-sm text-gray-500">Total Reports</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-100 shadow-none">
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <Activity size={20} className="text-green-600" />
                        </div>
                        <div>
                            {/* Real data */}
                            <p className="text-2xl font-semibold text-gray-800">
                                {vitals.length}
                            </p>
                            <p className="text-sm text-gray-500">Vitals Logged</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                    onClick={() => navigate('/reports/upload')}
                    className="bg-white border border-gray-100 rounded-xl p-6
                             flex items-center gap-4 cursor-pointer
                             hover:border-blue-200 hover:bg-blue-50 transition-colors"
                >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Upload size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">Upload Report</p>
                        <p className="text-sm text-gray-500">Upload your medical reports</p>
                    </div>
                </div>

                <div
                    onClick={() => navigate('/vitals/add')}
                    className="bg-white border border-gray-100 rounded-xl p-6
                             flex items-center gap-4 cursor-pointer
                             hover:border-green-200 hover:bg-green-50 transition-colors"
                >
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Plus size={20} className="text-green-600" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">Add Vitals</p>
                        <p className="text-sm text-gray-500">Log your BP, Sugar, Weight</p>
                    </div>
                </div>
            </div>

            {/* Recent Reports */}
            <Card className="border border-gray-100 shadow-none">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-gray-800">
                        Recent Reports
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {files.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <FileText size={36} className="mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No reports uploaded yet</p>
                            <Button
                                onClick={() => navigate('/reports/upload')}
                                variant="outline"
                                className="mt-4 text-blue-600 border-blue-200"
                            >
                                Upload your first report
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {/* Sirf 3 recent reports dikhao */}
                            {files.slice(0, 3).map((file) => (
                                <div
                                    key={file._id}
                                    onClick={() => navigate(`/reports/${file._id}`)}
                                    className="flex items-center gap-3 p-3 rounded-lg
                                             hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <FileText size={16} className="text-blue-600 shrink-0" />
                                    <p className="text-sm text-gray-700 truncate flex-1">
                                        {file.fileName}
                                    </p>
                                    <p className="text-xs text-gray-400 shrink-0">
                                        {new Date(file.reportDate).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'short',
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    );
};

export default Dashboard;