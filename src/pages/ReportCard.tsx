import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getStudentReportCardSummary } from "../api/reportCardService";
import { BookOpen, TrendingUp, Award, Users, Clock } from "lucide-react";

// Define interfaces directly in component to avoid import issues
interface ReportCard {
  id: number;
  student_id: number;
  subject_id: number;
  teacher_id: number;
  academic_year: string;
  semester?: string;
  term?: string;
  total_marks_obtained: number;
  total_marks_possible: number;
  percentage: number;
  letter_grade: string;
  grade_points: number;
  classes_attended: number;
  total_classes: number;
  attendance_percentage: number;
  teacher_remarks?: string;
  strengths?: string;
  areas_for_improvement?: string;
  is_published: boolean;
  is_final: boolean;
  created_at: string;
  updated_at?: string;
  student_name?: string;
  teacher_name?: string;
  subject_name?: string;
  subject_code?: string;
}

interface StudentReportCardSummary {
  student_id: number;
  student_name: string;
  student_class?: number;
  student_department?: string;
  academic_year: string;
  semester?: string;
  term?: string;
  total_subjects: number;
  overall_percentage: number;
  overall_grade: string;
  overall_gpa: number;
  overall_attendance: number;
  subjects_passed: number;
  subjects_failed: number;
  rank?: number;
  report_cards: ReportCard[];
}

export default function ReportCardPage() {
  const { currentUser } = useAuth();
  const [reportCard, setReportCard] = useState<StudentReportCardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [academicYear, setAcademicYear] = useState("2024-25");
  const [semester, setSemester] = useState("");
  const [term, setTerm] = useState("");

  useEffect(() => {
    if (currentUser && (currentUser.role === "student" || currentUser.role === "teacher")) {
      fetchReportCard();
    }
  }, [currentUser, academicYear, semester, term]);

  const fetchReportCard = async () => {
    try {
      setLoading(true);
      const data = await getStudentReportCardSummary(
        currentUser!.role === "student" ? currentUser!.id : currentUser!.id, // For now, teachers see their own data, can be modified later
        academicYear,
        semester || undefined,
        term || undefined
      );
      setReportCard(data);
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to fetch report card");
      setReportCard(null);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+": return "text-green-600 bg-green-100";
      case "A": return "text-green-600 bg-green-100";
      case "B+": return "text-blue-600 bg-blue-100";
      case "B": return "text-blue-600 bg-blue-100";
      case "C+": return "text-yellow-600 bg-yellow-100";
      case "C": return "text-yellow-600 bg-yellow-100";
      case "D": return "text-orange-600 bg-orange-100";
      case "F": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (currentUser?.role !== "student" && currentUser?.role !== "teacher") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Report Cards Available</h2>
          <p className="text-gray-600">Report cards are only available for students and teachers.</p>
        </div>
      </div>
    );
  }

  // For students, check if they should see report cards (school) or be redirected
  if (currentUser?.role === "student" && currentUser?.institution_type === "college") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Cards Not Available</h2>
          <p className="text-gray-600 mb-4">College students can view their performance in the Individual Grades section.</p>
          <button
            onClick={() => window.location.href = '/grades'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View My Grades
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-full p-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentUser?.role === "student" ? "My Report Card" : "Student Report Cards"}
                </h1>
                <p className="text-gray-600">
                  {currentUser?.role === "student" 
                    ? "View your academic performance" 
                    : "View and manage student report cards"
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2024-25">2024-25</option>
                <option value="2023-24">2023-24</option>
                <option value="2022-23">2022-23</option>
              </select>
            </div>

            {currentUser.institution_type === "college" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Semesters</option>
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>
            )}

            {currentUser.institution_type === "school" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term
                </label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Terms</option>
                  <option value="1st Term">1st Term</option>
                  <option value="2nd Term">2nd Term</option>
                  <option value="3rd Term">3rd Term</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading report card...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && !reportCard && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Card Available</h3>
            <p className="text-gray-500 mb-4">
              No report card data found for the selected academic period.
            </p>
            {currentUser?.role === "teacher" && (
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <BookOpen className="-ml-1 mr-2 h-5 w-5" />
                Create Report Card
              </button>
            )}
          </div>
        )}

        {reportCard && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-3">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Overall Percentage</p>
                    <p className="text-2xl font-bold text-gray-900">{reportCard.overall_percentage}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-3">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Overall Grade</p>
                    <p className={`text-2xl font-bold ${getGradeColor(reportCard.overall_grade).split(' ')[0]}`}>
                      {reportCard.overall_grade}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full p-3">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">GPA</p>
                    <p className="text-2xl font-bold text-gray-900">{reportCard.overall_gpa}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-orange-100 rounded-full p-3">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Attendance</p>
                    <p className="text-2xl font-bold text-gray-900">{reportCard.overall_attendance}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject-wise Report Cards */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Subject-wise Performance</h2>
              </div>

              {reportCard.report_cards.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Marks
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Percentage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Teacher
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportCard.report_cards.map((card) => (
                        <tr key={card.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {card.subject_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {card.subject_code}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {card.total_marks_obtained}/{card.total_marks_possible}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {card.percentage}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(card.letter_grade)}`}>
                              {card.letter_grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {card.attendance_percentage}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {card.teacher_name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No report cards found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No report cards have been published for the selected period.
                  </p>
                  {currentUser?.role === "teacher" && (
                    <div className="mt-6">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <BookOpen className="-ml-1 mr-2 h-5 w-5" />
                        Create Report Card
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Performance Summary */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Subjects:</span>
                    <span className="font-semibold">{reportCard.total_subjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subjects Passed:</span>
                    <span className="font-semibold text-green-600">{reportCard.subjects_passed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subjects Failed:</span>
                    <span className="font-semibold text-red-600">{reportCard.subjects_failed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overall GPA:</span>
                    <span className="font-semibold">{reportCard.overall_gpa}/4.0</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Period</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Academic Year:</span>
                    <span className="font-semibold">{reportCard.academic_year}</span>
                  </div>
                  {reportCard.semester && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Semester:</span>
                      <span className="font-semibold">{reportCard.semester}</span>
                    </div>
                  )}
                  {reportCard.term && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Term:</span>
                      <span className="font-semibold">{reportCard.term}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Class:</span>
                    <span className="font-semibold">
                      {reportCard.student_class || reportCard.student_department}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}