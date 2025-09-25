// src/pages/AssignmentsList.tsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAssignments } from "../api/assignmentApi";
import type { Assignment } from "../api/assignmentApi";

const LoadingSkeleton = ({ delay = 0 }) => (
  <div 
    className="group relative overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg animate-pulse"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Shimmer effect */}
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-blue-100/50 to-transparent"></div>
    
    <div className="space-y-4">
      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-3/4"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3"></div>
      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
    </div>
  </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-[bounceIn_1s_ease-out]">
    <div className="relative mb-8">
      <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center animate-[wiggle_1s_ease-in-out_infinite]">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-full animate-ping opacity-30"></div>
    </div>
    
    <h3 className="text-3xl font-bold text-gray-800 mb-4 animate-[fadeInDown_0.8s_ease-out]">Oops! Something went wrong</h3>
    <p className="text-gray-600 text-lg mb-8 max-w-md animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
      We couldn't fetch your assignments. Please check your connection and try again.
    </p>
    
    <button
      onClick={onRetry}
      className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl 
                 transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/30
                 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300/50
                 animate-[pulse_2s_ease-in-out_infinite] hover:animate-none"
    >
      <span className="relative z-10">Try Again</span>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl opacity-0 
                      group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  </div>
);

const EmptyState = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-[zoomIn_1s_ease-out]">
    <div className="relative mb-8">
      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-[bounce_2s_ease-in-out_infinite]">
        <svg className="w-16 h-16 text-white animate-[spin_3s_linear_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full animate-pulse opacity-30"></div>
    </div>
    
    <h3 className="text-3xl font-bold text-gray-800 mb-4 animate-[fadeInLeft_1s_ease-out]">No assignments yet</h3>
    <p className="text-gray-600 text-lg max-w-md animate-[fadeInRight_1s_ease-out_0.3s_both]">
      Your assignments will appear here once they're created. Check back soon!
    </p>
  </div>
);

const AssignmentCard = ({ assignment, index, onClick }: {
  assignment: Assignment;
  index: number;
  onClick: () => void;
}) => {
  const isOverdue = useMemo(() => {
    if (!assignment.due_date) return false;
    const dueDate = new Date(assignment.due_date + (assignment.due_time ? ` ${assignment.due_time}` : ''));
    return dueDate < new Date();
  }, [assignment.due_date, assignment.due_time]);

  const formatDueDate = useMemo(() => {
    if (!assignment.due_date) return 'No due date';
    const date = new Date(assignment.due_date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today${assignment.due_time ? ` at ${assignment.due_time}` : ''}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow${assignment.due_time ? ` at ${assignment.due_time}` : ''}`;
    }
    return `${assignment.due_date}${assignment.due_time ? ` ${assignment.due_time}` : ''}`;
  }, [assignment.due_date, assignment.due_time]);

  return (
    <div
      className="group relative overflow-hidden cursor-pointer animate-[slideInUp_0.8s_ease-out] opacity-0"
      style={{ 
        animationDelay: `${index * 200}ms`,
        animationFillMode: 'forwards'
      }}
      onClick={onClick}
    >
      {/* Main card */}
      <div className={`relative bg-white/95 backdrop-blur-sm border rounded-2xl p-6 h-full shadow-lg
                      transition-all duration-500 ease-out transform
                      hover:scale-[1.05] hover:-translate-y-4 hover:rotate-1 hover:shadow-2xl
                      ${isOverdue ? 'border-red-300 bg-red-50/80 hover:shadow-red-200/50' : 'border-gray-200 hover:shadow-blue-200/50'}
                      hover:border-blue-300 active:scale-[1.02] active:rotate-0`}>
        
        {/* Magical glow effect */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 
                        opacity-0 group-hover:opacity-20 transition-all duration-700 blur-sm animate-[rotate_4s_linear_infinite]"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-[float_3s_ease-in-out_infinite]"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full animate-[float_4s_ease-in-out_infinite_0.5s]"></div>
          <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-[float_3.5s_ease-in-out_infinite_1s]"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-all duration-300 
                           leading-tight line-clamp-2 flex-1 mr-4 group-hover:scale-105 transform origin-left">
              {assignment.title}
            </h2>
            
            <div className="flex-shrink-0 relative">
              <div className={`w-4 h-4 rounded-full transition-all duration-500 group-hover:scale-125 group-hover:animate-pulse
                              ${isOverdue ? 'bg-red-400 animate-[heartbeat_1.5s_ease-in-out_infinite]' : 'bg-emerald-400 animate-[breathe_2s_ease-in-out_infinite]'}`}></div>
              <div className={`absolute inset-0 w-4 h-4 rounded-full opacity-30 animate-ping
                              ${isOverdue ? 'bg-red-400' : 'bg-emerald-400'}`}></div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
            {assignment.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12
                              ${isOverdue ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium mb-1">Due Date</div>
                <div className={`font-semibold text-sm ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
                  {formatDueDate}
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-400 group-hover:text-blue-600 transition-all duration-300 
                            transform group-hover:translate-x-2 group-hover:scale-110">
              <span className="text-sm font-medium mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                View
              </span>
              <div className="p-2 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-all duration-300 group-hover:rotate-45">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Overdue badge with animation */}
          {isOverdue && (
            <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold 
                            rounded-full shadow-lg animate-[bounce_1s_ease-in-out_infinite] transform rotate-12">
              OVERDUE
            </div>
          )}
        </div>

        {/* Animated corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-2xl
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[spin_8s_linear_infinite]"></div>
      </div>
    </div>
  );
};

export default function AssignmentsList() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAssignments();
      setAssignments(data);
    } catch (err) {
      console.error("Failed to fetch assignments", err);
      setError("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleCardClick = useCallback((id: string | number) => {
    navigate(`/assignments/${id}`);
  }, [navigate]);

  const sortedAssignments = useMemo(() => {
    return [...assignments].sort((a, b) => {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      
      const dateA = new Date(a.due_date + (a.due_time ? ` ${a.due_time}` : ''));
      const dateB = new Date(b.due_date + (b.due_time ? ` ${b.due_time}` : ''));
      
      return dateA.getTime() - dateB.getTime();
    });
  }, [assignments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-300/15 to-pink-300/15 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-200/10 to-blue-200/10 rounded-full blur-3xl animate-[rotate_15s_linear_infinite]"></div>
      </div>

      {/* Add top spacing for navbar */}
      <div className="pt-20 relative z-10">
        <div className="container mx-auto px-6 py-10">
          {/* Header with spectacular animations */}
          <div className="text-center mb-12 animate-[titleReveal_1.5s_ease-out]">
            <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-gray-800 via-blue-600 to-indigo-700 
                           bg-clip-text text-transparent animate-[textShine_3s_ease-in-out_infinite] 
                           hover:scale-105 transform transition-transform duration-300 cursor-default">
              Assignments
            </h1>
            <div className="relative">
              <p className="text-gray-600 text-lg font-medium animate-[slideInFromBottom_1s_ease-out_0.5s_both]">
                {loading ? (
                  <span className="inline-block w-64 h-6 bg-gray-200 rounded-lg animate-pulse"></span>
                ) : assignments.length > 0 ? (
                  <span className="animate-[countUp_2s_ease-out_1s_both]">
                    {assignments.length} assignment{assignments.length !== 1 ? 's' : ''} ready for you
                  </span>
                ) : (
                  "No assignments available"
                )}
              </p>
              {!loading && assignments.length > 0 && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-[expandWidth_1s_ease-out_1.5s_both]"></div>
              )}
            </div>
          </div>

          {/* Content */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {Array.from({ length: 6 }).map((_, i) => (
                <LoadingSkeleton key={i} delay={i * 150} />
              ))}
            </div>
          )}

          {error && <ErrorState onRetry={fetchAssignments} />}

          {!loading && !error && assignments.length === 0 && <EmptyState />}

          {!loading && !error && assignments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {sortedAssignments.map((assignment, index) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  index={index}
                  onClick={() => handleCardClick(assignment.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes slideInUp {
          from { 
            opacity: 0;
            transform: translateY(60px) scale(0.9) rotateX(20deg);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg);
          }
        }
        
        @keyframes titleReveal {
          0% { 
            opacity: 0;
            transform: translateY(-30px) scale(1.1);
            filter: blur(10px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        
        @keyframes textShine {
          0%, 100% { 
            background-position: 0% 50%;
            filter: brightness(1);
          }
          50% { 
            background-position: 100% 50%;
            filter: brightness(1.2);
          }
        }
        
        @keyframes slideInFromBottom {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes expandWidth {
          from { width: 0; }
          to { width: 96px; }
        }
        
        @keyframes countUp {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-1deg); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1.2); }
          75% { transform: scale(1.1); }
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        
        @keyframes bounceIn {
          0% { 
            opacity: 0;
            transform: scale(0.3) translateY(-50px);
          }
          50% { 
            opacity: 1;
            transform: scale(1.1) translateY(0);
          }
          100% { 
            transform: scale(1);
          }
        }
        
        @keyframes zoomIn {
          from { 
            opacity: 0;
            transform: scale(0.5);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeInDown {
          from { 
            opacity: 0;
            transform: translateY(-30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from { 
            opacity: 0;
            transform: translateX(-30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from { 
            opacity: 0;
            transform: translateX(30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}