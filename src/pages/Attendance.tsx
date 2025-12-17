import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createAttendance, getAttendance } from "../api/attendanceService";
import { getTeachers } from "../api/authService";

const StudentAttendancePage = () => {
  const [records, setRecords] = useState<any[]>([]);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const institutionType = currentUser?.institution_type ?? null;

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAttendance();
      setRecords(data);
    } catch (err: any) {
      setError(err?.detail || "Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const openModal = async () => {
    setModalLoading(true);
    setError("");
    try {
      const data = await getTeachers();
      if (institutionType === "school") {
        setTeachers(data.school_teachers);
      } else if (institutionType === "college") {
        setTeachers(data.college_teachers);
      }
      setShowModal(true);
    } catch (err: any) {
      setError(err?.detail || "Failed to fetch teachers");
    } finally {
      setModalLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedTeacher) {
      setError("Please select a teacher");
      return;
    }
    
    setSubmitting(true);
    setError("");
    
    try {
      await createAttendance(selectedTeacher);
      setShowModal(false);
      setSelectedTeacher("");
      setSuccessMessage("Attendance marked successfully!");
      fetchAttendance();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err?.detail || "Failed to create attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTeacher("");
    setError("");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        bg: "bg-gradient-to-r from-amber-100 to-yellow-100",
        text: "text-amber-800",
        border: "border-amber-200",
        icon: "⏳",
        pulse: true
      },
      present: {
        bg: "bg-gradient-to-r from-emerald-100 to-green-100",
        text: "text-emerald-800",
        border: "border-emerald-200",
        icon: "✓",
        pulse: false
      },
      absent: {
        bg: "bg-gradient-to-r from-red-100 to-rose-100",
        text: "text-red-800",
        border: "border-red-200",
        icon: "✗",
        pulse: false
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${config.bg} ${config.text} ${config.border} ${config.pulse ? 'animate-pulse' : ''} shadow-sm`}>
        <span className="text-base">{config.icon}</span>
        <span className="capitalize">{status || 'Pending'}</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-blue-400"></div>
          </div>
          <p className="text-slate-700 font-semibold text-lg">Loading your attendance...</p>
          <p className="text-slate-500 mt-2">Please wait while we fetch your records</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-25 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Floating Header */}
        <div className="mb-8 animate-slide-down">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
                  My Attendance
                </h1>
                <p className="text-slate-600 text-lg">Track and manage your attendance records</p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-6 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 animate-bounce-in">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center text-white">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-lg">{successMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 animate-shake">
            <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-lg">{error}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setError("")}
                  className="text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded-lg p-1"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">Total Records</p>
                    <p className="text-3xl font-black text-slate-800">{records.length}</p>
                  </div>
                </div>
                <div className="hidden sm:block h-12 w-px bg-slate-200"></div>
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">Present</p>
                    <p className="text-3xl font-black text-slate-800">{records.filter(r => r.status === 'present').length}</p>
                  </div>
                </div>
                <div className="hidden sm:block h-12 w-px bg-slate-200"></div>
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">⏳</span>
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">Pending</p>
                    <p className="text-3xl font-black text-slate-800">{records.filter(r => r.status === 'pending').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchAttendance}
                  className="group flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <svg className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="font-semibold hidden sm:block">Refresh</span>
                </button>
                
                <button
                  onClick={openModal}
                  disabled={modalLoading}
                  className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {modalLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span className="font-semibold">Loading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="font-semibold">Mark Attendance</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-white/20">
          {records.length === 0 ? (
            <div className="text-center py-20 px-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2">No attendance records found</h3>
              <p className="text-slate-500 text-lg mb-6">Start by marking your first attendance</p>
              <button
                onClick={openModal}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-semibold">Mark Attendance</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                    <th className="px-8 py-6 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID</th>
                    <th className="px-8 py-6 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Teacher</th>
                    <th className="px-8 py-6 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-6 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((rec, index) => (
                    <tr 
                      key={rec.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 animate-fade-in-up group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-700 bg-slate-100 rounded-lg px-3 py-1 inline-block">
                          #{rec.id}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-14 w-14">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <span className="text-white font-bold text-lg">
                                {rec.teacher.full_name?.charAt(0).toUpperCase() || 'T'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-lg font-bold text-slate-900">{rec.teacher.full_name}</div>
                            <div className="text-sm text-slate-500 font-medium">{rec.teacher.email || 'Teacher'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        {getStatusBadge(rec.status)}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-700">
                          {formatDate(rec.date)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md animate-modal-up">
              <div className="p-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">Select Teacher</h3>
                    <p className="text-slate-500 mt-1">Choose your teacher to mark attendance</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Teacher Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Available Teachers
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-4 pr-12 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      value={selectedTeacher}
                      onChange={(e) => setSelectedTeacher(e.target.value)}
                    >
                      <option value="">-- Select a teacher --</option>
                      {teachers.map((t: any, i: number) => (
                        <option key={i} value={t.id}>
                          {t.full_name} ({t.email})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={closeModal}
                    disabled={submitting}
                    className="flex-1 px-6 py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={submitting || !selectedTeacher}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Submit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-50px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) translateY(-10px);
          }
          70% {
            transform: scale(0.95) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modal-up {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-modal-up {
          animation: modal-up 0.3s ease-out;
        }

        .backdrop-blur-xl {
          backdrop-filter: blur(20px);
        }

        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
      `}</style>
    </div>
  );
};

export default StudentAttendancePage;