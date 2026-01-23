import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { BookOpen, Upload, Save, FileText, Calculator, Download } from "lucide-react";

// Define interfaces for the marks entry
interface Student {
  id: number;
  full_name: string;
  email: string;
  classes?: number;
  department?: string;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  credits: number;
}

interface MarkEntry {
  student_id: number;
  student_name: string;
  subject_id: number;
  subject_name: string;
  subject_code: string;
  marks_obtained: number;
  total_marks: number;
  percentage: number;
  letter_grade: string;
  attendance_percentage: number;
  teacher_remarks?: string;
}

export default function EnterMarksPage() {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [academicYear, setAcademicYear] = useState("2024-25");
  const [classLevel, setClassLevel] = useState("1st");
  const [markEntries, setMarkEntries] = useState<MarkEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    // Mock students data with different classes
    const mockStudents = [
      { id: 1, full_name: "John Doe", email: "john@example.com", classes: 1 },
      { id: 2, full_name: "Jane Smith", email: "jane@example.com", classes: 1 },
      { id: 3, full_name: "Bob Johnson", email: "bob@example.com", classes: 2 },
      { id: 4, full_name: "Alice Brown", email: "alice@example.com", classes: 2 },
      { id: 5, full_name: "Charlie Wilson", email: "charlie@example.com", classes: 3 },
      { id: 6, full_name: "Diana Davis", email: "diana@example.com", classes: 3 },
    ];
    
    // Filter students by selected class level
    const classNumber = parseInt(classLevel.replace(/\D/g, ''));
    const filteredStudents = mockStudents.filter(student => student.classes === classNumber);
    setStudents(filteredStudents);
    
    // Reset selected student when class changes
    setSelectedStudent(null);
  }, [classLevel]);

  useEffect(() => {
    // Mock subjects data
    setSubjects([
      { id: 1, name: "Mathematics", code: "MATH", credits: 4 },
      { id: 2, name: "Science", code: "SCI", credits: 4 },
      { id: 3, name: "English", code: "ENG", credits: 3 },
      { id: 4, name: "History", code: "HIST", credits: 3 },
      { id: 5, name: "Geography", code: "GEO", credits: 3 },
    ]);
  }, []);

  useEffect(() => {
    if (selectedStudent && subjects.length > 0) {
      // Initialize mark entries for all subjects for the selected student
      const selectedStudentData = students.find(s => s.id === selectedStudent);
      if (selectedStudentData) {
        const entries = subjects.map(subject => ({
          student_id: selectedStudent,
          student_name: selectedStudentData.full_name,
          subject_id: subject.id,
          subject_name: subject.name,
          subject_code: subject.code,
          marks_obtained: 0,
          total_marks: 100,
          percentage: 0,
          letter_grade: "F",
          attendance_percentage: 85,
          teacher_remarks: ""
        }));
        setMarkEntries(entries);
      }
    } else {
      setMarkEntries([]);
    }
  }, [selectedStudent, subjects, students]);

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C+";
    if (percentage >= 40) return "C";
    if (percentage >= 33) return "D";
    return "F";
  };

  const updateMarkEntry = (subjectId: number, field: keyof MarkEntry, value: any) => {
    setMarkEntries(prev => prev.map(entry => {
      if (entry.subject_id === subjectId) {
        const updated = { ...entry, [field]: value };
        
        // Auto-calculate percentage and grade when marks change
        if (field === 'marks_obtained' || field === 'total_marks') {
          const percentage = (updated.marks_obtained / updated.total_marks) * 100;
          updated.percentage = Math.round(percentage * 100) / 100;
          updated.letter_grade = calculateGrade(updated.percentage);
        }
        
        return updated;
      }
      return entry;
    }));
  };

  const handleSaveMarks = async () => {
    if (!selectedStudent) {
      setError("Please select a student");
      return;
    }

    setSaving(true);
    setError("");
    
    try {
      // Here you would make API calls to save the marks
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess("Report card marks saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save marks. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleBulkUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    input.click();
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError("");
    
    try {
      // For now, just show a success message
      // In a real implementation, you would parse the CSV/Excel file
      // and populate the markEntries state
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data population from file
      if (selectedStudent && subjects.length > 0) {
        const selectedStudentData = students.find(s => s.id === selectedStudent);
        if (selectedStudentData) {
          const mockUploadedData = subjects.map((subject, index) => ({
            student_id: selectedStudent,
            student_name: selectedStudentData.full_name,
            subject_id: subject.id,
            subject_name: subject.name,
            subject_code: subject.code,
            marks_obtained: 75 + (index * 5), // Mock data
            total_marks: 100,
            percentage: 75 + (index * 5),
            letter_grade: calculateGrade(75 + (index * 5)),
            attendance_percentage: 85 + (index * 2),
            teacher_remarks: `Uploaded from ${file.name}`
          }));
          
          setMarkEntries(mockUploadedData);
          setSuccess(`Successfully uploaded marks from ${file.name}`);
          setTimeout(() => setSuccess(""), 3000);
        }
      }
    } catch (err) {
      setError("Failed to upload file. Please check the format and try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    if (!selectedStudent) {
      setError("Please select a student first");
      return;
    }

    const selectedStudentData = students.find(s => s.id === selectedStudent);
    if (!selectedStudentData) return;

    // Create CSV template
    const headers = ['Subject Code', 'Subject Name', 'Marks Obtained', 'Total Marks', 'Attendance %', 'Remarks'];
    const csvContent = [
      headers.join(','),
      ...subjects.map(subject => 
        `${subject.code},"${subject.name}",0,100,85,""`
      )
    ].join('\n');

    // Download the template
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marks_template_${selectedStudentData.full_name.replace(/\s+/g, '_')}_${classLevel}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (currentUser?.role !== "teacher") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600">Only teachers can enter report card marks.</p>
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
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Enter Report Card Marks</h1>
                <p className="text-gray-600">Enter and manage student marks for report cards</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={downloadTemplate}
                disabled={!selectedStudent}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={!selectedStudent}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentUser?.institution_type === "school" ? "Class" : "Term"}
              </label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currentUser?.institution_type === "school" ? (
                  <>
                    <option value="1st">1st Class</option>
                    <option value="2nd">2nd Class</option>
                    <option value="3rd">3rd Class</option>
                    <option value="4th">4th Class</option>
                    <option value="5th">5th Class</option>
                    <option value="6th">6th Class</option>
                    <option value="7th">7th Class</option>
                    <option value="8th">8th Class</option>
                    <option value="9th">9th Class</option>
                    <option value="10th">10th Class</option>
                    <option value="11th">11th Class</option>
                    <option value="12th">12th Class</option>
                  </>
                ) : (
                  <>
                    <option value="1st Term">1st Term</option>
                    <option value="2nd Term">2nd Term</option>
                    <option value="3rd Term">3rd Term</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student
              </label>
              <select
                value={selectedStudent || ""}
                onChange={(e) => setSelectedStudent(Number(e.target.value) || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSaveMarks}
                disabled={!selectedStudent || saving || markEntries.length === 0}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Marks
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Loading overlay for file upload */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-900">Processing file upload...</span>
              </div>
            </div>
          </div>
        )}

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Bulk Upload Instructions */}
        {selectedStudent && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Bulk Upload Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>1. Download the CSV template using the "Download Template" button</li>
              <li>2. Fill in the marks data for all subjects in the template file</li>
              <li>3. Upload the completed file using the "Bulk Upload" button</li>
              <li>4. Supported formats: CSV (.csv), Excel (.xlsx, .xls)</li>
            </ul>
          </div>
        )}

        {/* Marks Entry Table */}
        {selectedStudent && markEntries.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Enter Marks for {students.find(s => s.id === selectedStudent)?.full_name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Academic Year: {academicYear} | {currentUser?.institution_type === "school" ? `${classLevel} Class` : classLevel} | {subjects.length} subjects
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks Obtained
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {markEntries.map((entry) => (
                    <tr key={entry.subject_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-purple-100 rounded-full p-2 mr-3">
                            <BookOpen className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {entry.subject_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {entry.subject_code}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max={entry.total_marks}
                          value={entry.marks_obtained}
                          onChange={(e) => updateMarkEntry(entry.subject_id, 'marks_obtained', Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="1"
                          value={entry.total_marks}
                          onChange={(e) => updateMarkEntry(entry.subject_id, 'total_marks', Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {entry.percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          entry.letter_grade === 'A+' || entry.letter_grade === 'A' ? 'bg-green-100 text-green-800' :
                          entry.letter_grade === 'B+' || entry.letter_grade === 'B' ? 'bg-blue-100 text-blue-800' :
                          entry.letter_grade === 'C+' || entry.letter_grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          entry.letter_grade === 'D' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {entry.letter_grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={entry.attendance_percentage}
                          onChange={(e) => updateMarkEntry(entry.subject_id, 'attendance_percentage', Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          placeholder="Optional remarks"
                          value={entry.teacher_remarks || ""}
                          onChange={(e) => updateMarkEntry(entry.subject_id, 'teacher_remarks', e.target.value)}
                          className="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select Student to Enter Marks</h3>
            <p className="text-gray-500 mb-4">
              Please select a student from the dropdown above to start entering marks for all subjects.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                <strong>How it works:</strong> Select a class and student, then enter marks for all their subjects in one place.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}