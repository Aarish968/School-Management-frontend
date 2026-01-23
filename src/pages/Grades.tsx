import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getStudentGradesSummary } from "../api/gradeService";
import { BookOpen, TrendingUp, Award, Calendar } from "lucide-react";

// Define interfaces directly in component to avoid import issues
interface Grade {
  id: number;
  student_id: number;
  subject_id: number;
  teacher_id: number;
  assignment_name: string;
  grade_type: string;
  marks_obtained: number;
  total_marks: number;
  percentage: number;
  letter_grade?: string;
  academic_year: string;
  semester?: string;
  term?: string;
  remarks?: string;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
  student_name?: string;
  teacher_name?: string;
  subject_name?: string;
  subject_code?: string;
}

interface StudentGradesSummary {
  student_id: number;
  student_name: string;
  academic_year: string;
  semester?: string;
  term?: string;
  total_subjects: number;
  average_percentage: number;
  overall_grade: string;
  grades: Grade[];
}

export default function GradesPage() {
  const { currentUser } = useAuth();
  const [gradesSummary, setGradesSummary] = useState<StudentGradesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [academicYear, setAcademicYear] = useState("2024-25");
  const [semester, setSemester] = useState("");
  const [term, setTerm] = useState("");

  useEffect(() => {
    if (currentUser && (currentUser.role === "student" || currentUser.role === "teacher")) {
      fetchGrades();
    }
  }, [currentUser, academicYear, semester, term]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const data = await getStudentGradesSummary(
        currentUser!.role === "student" ? currentUser!.id : currentUser!.id, // For now, teachers see their own data, can be modified later
        academicYear,
        semester || undefined,
        term || undefined
      );
      setGradesSummary(data);
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to fetch grades");
      setGradesSummary(null);
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

  const getGradeTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "exam": return "bg-red-100 text-red-800";
      case "test": return "bg-blue-100 text-blue-800";
      case "assignment": return "bg-green-100 text-green-800";
      case "quiz": return "bg-yellow-100 text-yellow-800";
      case "project": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (currentUser?.role !== "student" && currentUser?.role !== "teacher") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Grades Available</h2>
          <p className="text-gray-600">Grades are only available for students and teachers.</p>
        </div>
      </div>
    );
  }

  // For students, check if they should see grades (college) or be redirected
  if (currentUser?.role === "student" && currentUser?.institution_type === "school") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Individual Grades Not Available</h2>
          <p className="text-gray-600 mb-4">School students can view their performance in the Report Card section.</p>
          <button
            onClick={() => window.location.href = '/report-card'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Report Card
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
                  {currentUser?.role === "student" ? "My Grades" : "Student Grades"}
                </h1>
                <p className="text-gray-600">
                  {currentUser?.role === "student" 
                    ? "View your individual assignment and test grades" 
                    : "View and manage student grades"
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
            <p className="mt-4 text-gray-600">Loading grades...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && !gradesSummary && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Grades Available</h3>
            <p className="text-gray-500 mb-4">
              No grade data found for the selected academic period.
            </p>
            {currentUser?.role === "teacher" && (
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <BookOpen className="-ml-1 mr-2 h-5 w-5" />
                Add New Grade
              </button>
            )}
          </div>
        )}

        {gradesSummary && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-3">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Subjects</p>
                    <p className="text-2xl font-bold text-gray-900">{gradesSummary.total_subjects}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Percentage</p>
                    <p className="text-2xl font-bold text-gray-900">{gradesSummary.average_percentage}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full p-3">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Overall Grade</p>
                    <p className={`text-2xl font-bold ${getGradeColor(gradesSummary.overall_grade).split(' ')[0]}`}>
                      {gradesSummary.overall_grade}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-orange-100 rounded-full p-3">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Grades</p>
                    <p className="text-2xl font-bold text-gray-900">{gradesSummary.grades.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grades Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Individual Grades</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
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
                        Teacher
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {gradesSummary.grades.map((grade) => (
                      <tr key={grade.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {grade.subject_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {grade.subject_code}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{grade.assignment_name}</div>
                          {grade.remarks && (
                            <div className="text-sm text-gray-500">{grade.remarks}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeTypeColor(grade.grade_type)}`}>
                            {grade.grade_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {grade.marks_obtained}/{grade.total_marks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {grade.percentage}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(grade.letter_grade || '')}`}>
                            {grade.letter_grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {grade.teacher_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(grade.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {gradesSummary.grades.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No grades found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No grades have been published for the selected period.
                  </p>
                  {currentUser?.role === "teacher" && (
                    <div className="mt-6">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <BookOpen className="-ml-1 mr-2 h-5 w-5" />
                        Add New Grade
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}