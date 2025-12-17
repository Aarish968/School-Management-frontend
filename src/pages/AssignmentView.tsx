// src/pages/AssignmentView.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAssignmentById } from "../api/assignmentApi";
import { getUserById, type UserDetail } from "../api/userApi";
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Download, 
  ArrowLeft,
  Users,
  Paperclip,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

// Define Assignment type locally if not available from API
interface Assignment {
  id: number;
  title: string;
  description?: string;
  type?: string;
  assigned_teacher_id: number;
  due_date: string;
  due_time?: string | null;
  students: number[];
  attachments: {
    id: number;
    filename: string;
    filepath: string;
  }[];
}

export default function AssignmentView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [teacher, setTeacher] = useState<UserDetail | null>(null);
  const [students, setStudents] = useState<{ [key: number]: UserDetail }>({});
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      try {
        const assignmentData = await getAssignmentById(Number(id));
        setAssignment(assignmentData);

        // Fetch teacher details
        if (assignmentData.assigned_teacher_id) {
          try {
            const teacherData = await getUserById(assignmentData.assigned_teacher_id);
            setTeacher(teacherData);
          } catch (err) {
            console.error("Failed to fetch teacher", err);
          }
        }

        // Fetch student details
        if (assignmentData.students && assignmentData.students.length > 0) {
          const studentPromises = assignmentData.students.map(async (studentId) => {
            try {
              const studentData = await getUserById(studentId);
              return { id: studentId, data: studentData };
            } catch (err) {
              console.error(`Failed to fetch student ${studentId}`, err);
              return null;
            }
          });

          const studentResults = await Promise.all(studentPromises);
          const studentsMap: { [key: number]: UserDetail } = {};
          studentResults.forEach((result) => {
            if (result) {
              studentsMap[result.id] = result.data;
            }
          });
          setStudents(studentsMap);
        }
      } catch (err) {
        console.error("Failed to fetch assignment", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-gray-200/20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Assignment Not Found</h2>
            <p className="text-gray-600 mb-8">The assignment you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const overdue = isOverdue(assignment.due_date);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/20"
        >
          <ArrowLeft className="w-5 h-5 mr-2 text-gray-600 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-gray-700 font-medium">Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200/20 animate-fade-in">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
                    <FileText className="w-4 h-4 mr-2" />
                    {assignment.type || "Assignment"}
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-3 animate-slide-up">
                    {assignment.title}
                  </h1>
                </div>
                {overdue ? (
                  <div className="flex items-center px-4 py-2 bg-red-500/90 backdrop-blur-sm rounded-full text-white text-sm font-medium animate-pulse">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Overdue
                  </div>
                ) : (
                  <div className="flex items-center px-4 py-2 bg-green-500/90 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Active
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-8">
            {/* Description */}
            {assignment.description && (
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-3"></div>
                  Description
                </h2>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-gray-200/50">
                  <p className="text-gray-700 leading-relaxed">{assignment.description}</p>
                </div>
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {/* Due Date */}
              <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-blue-600 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Due Date</p>
                <p className="text-lg font-bold text-gray-800">{formatDate(assignment.due_date)}</p>
              </div>

              {/* Due Time */}
              <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-purple-600 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Due Time</p>
                <p className="text-lg font-bold text-gray-800">{assignment.due_time || "Not specified"}</p>
              </div>

              {/* Teacher */}
              <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-green-600 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Assigned By</p>
                <p className="text-lg font-bold text-gray-800">
                  {teacher ? teacher.full_name : `Teacher #${assignment.assigned_teacher_id}`}
                </p>
              </div>

              {/* Students Count */}
              <div className="group bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-200/50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-orange-600 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Students</p>
                <p className="text-lg font-bold text-gray-800">{assignment.students.length} Assigned</p>
              </div>
            </div>

            {/* Students List */}
            {assignment.students.length > 0 && (
              <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-3"></div>
                  Assigned Students
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assignment.students.map((studentId: number, index: number) => {
                    const student = students[studentId];
                    return (
                      <div
                        key={studentId}
                        className="group bg-white rounded-2xl p-4 border border-gray-200/50 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${0.05 * index}s` }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                              {student ? student.full_name.charAt(0).toUpperCase() : 'S'}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">
                              {student ? student.full_name : `Student #${studentId}`}
                            </p>
                            {student && student.email && (
                              <p className="text-xs text-gray-500 truncate">{student.email}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Attachments */}
            {assignment.attachments.length > 0 && (
              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-3"></div>
                  Attachments
                  <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {assignment.attachments.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assignment.attachments.map((att, index) => {
                    const isImage = att.filename.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                    return (
                      <div
                        key={att.id}
                        className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200/50 hover:scale-105 animate-fade-in"
                        style={{ animationDelay: `${0.1 * index}s` }}
                      >
                        {isImage ? (
                          <div className="relative overflow-hidden bg-gray-100">
                            {imageLoading[att.id] !== false && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                              </div>
                            )}
                            <img
                              src={att.filepath}
                              alt={att.filename}
                              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                              onLoad={() => setImageLoading(prev => ({ ...prev, [att.id]: false }))}
                              onError={() => setImageLoading(prev => ({ ...prev, [att.id]: false }))}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                            <div className="text-center">
                              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300">
                                <Paperclip className="w-8 h-8 text-blue-600" />
                              </div>
                              <p className="text-sm text-gray-600 font-medium">Document</p>
                            </div>
                          </div>
                        )}
                        <div className="p-4">
                          <p className="text-sm font-medium text-gray-800 mb-3 truncate" title={att.filename}>
                            {att.filename}
                          </p>
                          <a
                            href={att.filepath}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 group-hover:shadow-lg"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
