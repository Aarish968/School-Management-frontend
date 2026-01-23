
import { useAuth } from "../context/AuthContext";
import { BookOpen, TrendingUp, Users, BarChart3, FileText } from "lucide-react";

export default function StudentReportsPage() {
  const { currentUser } = useAuth();

  if (currentUser?.role !== "teacher") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600">Only teachers can view student progress reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 rounded-full p-3">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Progress Reports</h1>
              <p className="text-gray-600">View and analyze student performance and progress</p>
            </div>
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <TrendingUp className="w-12 h-12 text-purple-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h2>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              The Student Progress Reports feature is currently under development. 
              This section will provide comprehensive analytics and insights about 
              student performance, attendance trends, and academic progress.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Detailed Reports</h3>
                <p className="text-sm text-gray-600">Individual student performance analysis</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Class Analytics</h3>
                <p className="text-sm text-gray-600">Class-wide performance insights</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> For now, you can use the "Enter Report Card Marks" 
                section to input student grades and marks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}