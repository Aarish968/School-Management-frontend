import { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  Award, 
  TrendingUp, 
  ChevronRight,
  Sparkles,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle,
  FileText,
  BarChart3,
  Library,
  Bus,
  CreditCard,
  Star,
  Zap,
  Heart
} from "lucide-react";

// Mock auth context for demo
const useAuth = () => ({
  currentUser: null, // Change to { full_name: "John Doe", role: "student" } to test authenticated views
  isAuthenticated: false
});

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    setIsVisible(true);
    
    // Mouse tracking for parallax effects
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate featured items
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % getCurrentFeatures().length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Comprehensive student profiles, enrollment, and academic tracking with AI-powered insights",
      color: "from-blue-500 to-cyan-400",
      accent: "from-blue-600 to-cyan-500"
    },
    {
      icon: BookOpen,
      title: "Course Management", 
      description: "Organize curriculum, assignments, and learning resources with smart scheduling",
      color: "from-purple-500 to-pink-400",
      accent: "from-purple-600 to-pink-500"
    },
    {
      icon: Calendar,
      title: "Schedule Management",
      description: "Efficient timetables, events, and calendar coordination with conflict detection",
      color: "from-green-500 to-emerald-400",
      accent: "from-green-600 to-emerald-500"
    },
    {
      icon: Award,
      title: "Performance Tracking",
      description: "Grade management, progress reports, and advanced analytics with predictive modeling",
      color: "from-orange-500 to-red-400",
      accent: "from-orange-600 to-red-500"
    }
  ];

  const facilityFeatures = [
    {
      icon: Library,
      title: "Library Management",
      description: "Digital catalog, automated check-in/out, and reading recommendations",
      color: "from-indigo-500 to-blue-400",
      accent: "from-indigo-600 to-blue-500"
    },
    {
      icon: Bus,
      title: "Transport System",
      description: "Real-time tracking, route optimization, and parent notifications",
      color: "from-green-500 to-teal-400",
      accent: "from-green-600 to-teal-500"
    },
    {
      icon: CreditCard,
      title: "Fee Management",
      description: "Automated billing, payment tracking, and financial reporting",
      color: "from-purple-500 to-pink-400",
      accent: "from-purple-600 to-pink-500"
    },
    {
      icon: Shield,
      title: "Security & Safety",
      description: "Biometric access, visitor management, and emergency protocols",
      color: "from-orange-500 to-red-400",
      accent: "from-orange-600 to-red-500"
    }
  ];

  const studentFeatures = [
    {
      icon: CheckCircle,
      title: "Attendance Tracking",
      description: "Real-time attendance updates with automated notifications",
      color: "from-green-500 to-emerald-400",
      accent: "from-green-600 to-emerald-500"
    },
    {
      icon: Calendar,
      title: "Timetable Access",
      description: "Interactive schedules with reminders and room navigation",
      color: "from-blue-500 to-cyan-400",
      accent: "from-blue-600 to-cyan-500"
    },
    {
      icon: BookOpen,
      title: "Homework & Assignments",
      description: "Smart submission system with plagiarism detection",
      color: "from-purple-500 to-pink-400",
      accent: "from-purple-600 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Results & Progress",
      description: "Personalized analytics and improvement recommendations",
      color: "from-orange-500 to-red-400",
      accent: "from-orange-600 to-red-500"
    }
  ];

  const teacherFeatures = [
    {
      icon: CheckCircle,
      title: "Attendance Management",
      description: "Quick attendance with facial recognition and pattern analysis",
      color: "from-green-500 to-emerald-400",
      accent: "from-green-600 to-emerald-500"
    },
    {
      icon: FileText,
      title: "Assignment Upload",
      description: "Bulk upload, auto-grading, and feedback distribution",
      color: "from-blue-500 to-cyan-400",
      accent: "from-blue-600 to-cyan-500"
    },
    {
      icon: BarChart3,
      title: "Marks Entry",
      description: "Smart grade entry with statistical analysis and insights",
      color: "from-purple-500 to-pink-400",
      accent: "from-purple-600 to-pink-500"
    },
    {
      icon: Users,
      title: "Student Monitoring",
      description: "AI-powered student progress tracking and intervention alerts",
      color: "from-orange-500 to-red-400",
      accent: "from-orange-600 to-red-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Students", icon: Users, color: "from-blue-500 to-cyan-400" },
    { number: "500+", label: "Teachers", icon: GraduationCap, color: "from-purple-500 to-pink-400" },
    { number: "100+", label: "Courses", icon: BookOpen, color: "from-green-500 to-emerald-400" },
    { number: "99%", label: "Success Rate", icon: TrendingUp, color: "from-orange-500 to-red-400" }
  ];

  const getDisplayName = () => currentUser?.full_name || "User";
  const role = currentUser?.role ?? null;

  const getWelcomeTitle = () => {
    if (!isAuthenticated) return "Welcome to SchoolMS";
    if (role === "student") return `Welcome Back, ${getDisplayName()}`;
    if (role === "teacher") return `Welcome Back, ${getDisplayName()}`;
    return "Welcome to SchoolMS";
  };

  const getSummaryContent = () => {
    if (!isAuthenticated) {
      return {
        content: "Transform your educational institution with our next-generation School Management System. Streamline operations, enhance learning experiences, and connect your entire school community through intelligent automation and intuitive design."
      };
    }
    
    if (role === "student") {
      return {
        content: "Your personalized learning hub awaits. Track attendance, access assignments, view results, and stay connected with your academic journey through our intelligent student portal designed just for you."
      };
    }
    
    if (role === "teacher") {
      return {
        content: "Empower your teaching with advanced tools. Manage attendance, upload assignments, track student progress, and create engaging learning experiences through our comprehensive teacher dashboard."
      };
    }
    
    return {
      content: "Welcome to the School Management System – a complete platform designed to make learning and teaching easier."
    };
  };

  const getCurrentFeatures = () => {
    if (!isAuthenticated) return features;
    if (role === "student") return studentFeatures;
    if (role === "teacher") return teacherFeatures;
    return features;
  };

  const showFacilitySection = !isAuthenticated;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Dynamic gradient orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            top: `${20 + mousePosition.y * 0.1}%`,
            left: `${10 + mousePosition.x * 0.1}%`,
            transform: `translate(-50%, -50%)`,
            animation: 'float 20s ease-in-out infinite'
          }}
        ></div>
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            top: `${60 + mousePosition.y * 0.05}%`,
            right: `${15 + mousePosition.x * 0.05}%`,
            transform: `translate(50%, -50%)`,
            animation: 'float 25s ease-in-out infinite reverse'
          }}
        ></div>
        <div 
          className="absolute w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            bottom: `${10 + mousePosition.y * 0.08}%`,
            left: `${60 + mousePosition.x * 0.08}%`,
            transform: `translate(-50%, 50%)`,
            animation: 'float 30s ease-in-out infinite'
          }}
        ></div>

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `particle-float ${15 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) rotate(0deg); }
          33% { transform: translate(-50%, -50%) translateY(-30px) rotate(120deg); }
          66% { transform: translate(-50%, -50%) translateY(15px) rotate(240deg); }
        }
        
        @keyframes particle-float {
          0%, 100% { transform: translateY(0px) translateX(0px) opacity(0.3); }
          50% { transform: translateY(-100px) translateX(50px) opacity(0.8); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }

        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        .glow-hover:hover {
          animation: glow-pulse 2s ease-in-out infinite;
        }

        .text-shimmer {
          background: linear-gradient(90deg, #1e40af, #7c3aed, #1e40af);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s ease-in-out infinite;
        }
      `}</style>

      <div className="relative pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-screen flex items-center">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
            <div className={`text-center transition-all duration-1500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
              {/* Floating Badge */}
              <div className={`inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-lg rounded-full text-sm font-medium text-blue-600 border border-blue-200/50 mb-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 ${isVisible ? 'animate-bounce' : ''}`}
                   style={{ animationDelay: '0.5s', animationDuration: '2s', animationIterationCount: '3' }}>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
                {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard` : "Next Generation School Management"}
                <Zap className="w-4 h-4 ml-2 text-yellow-500 animate-pulse" />
              </div>

              {/* Main Heading with Staggered Animation */}
              <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                {getWelcomeTitle().split(' ').map((word, index) => (
                  <span 
                    key={index}
                    className={`inline-block text-shimmer transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ 
                      transitionDelay: `${index * 200}ms`,
                      textShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    {word}&nbsp;
                  </span>
                ))}
              </h1>

              {/* Enhanced Summary Section */}
              <div className={`max-w-5xl mx-auto mb-16 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                   style={{ transitionDelay: '800ms' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 hover:border-blue-200/50 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-t-3xl"></div>
                    <p className="text-xl text-gray-700 leading-relaxed font-medium">
                      {getSummaryContent().content}
                    </p>
                    <div className="flex justify-center mt-6 space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse`} style={{ animationDelay: `${i * 0.5}s` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced CTA Buttons */}
              {!isAuthenticated && (
                <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                     style={{ transitionDelay: '1200ms' }}>
                  <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 text-white rounded-2xl font-bold transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-110 glow-hover overflow-hidden">
                    <div className="relative z-10 flex items-center space-x-3">
                      <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
                      <span>Get Started Today</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 left-0 w-full h-full shimmer opacity-0 group-hover:opacity-100"></div>
                  </button>
                  
                  <button className="group px-10 py-5 bg-white/90 backdrop-blur-lg text-gray-700 rounded-2xl font-bold border border-gray-200/50 hover:bg-white hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-blue-300/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                      <span>Watch Demo</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="relative py-20 bg-white/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map(({ number, label, icon: Icon, color }, index) => (
                <div 
                  key={label}
                  className={`text-center group transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="relative">
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500 scale-110`}></div>
                    
                    {/* Main card */}
                    <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 group-hover:shadow-2xl group-hover:-translate-y-3 transition-all duration-500">
                      <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${color} rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      
                      <div className={`text-4xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        {number}
                      </div>
                      <div className="text-gray-700 font-semibold text-lg">{label}</div>
                      
                      {/* Animated border */}
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${color} group-hover:w-full transition-all duration-500 rounded-full`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className={`text-center mb-20 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                 style={{ transitionDelay: '400ms' }}>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-600 font-medium mb-6">
                <Star className="w-4 h-4 mr-2 animate-pulse" />
                {isAuthenticated 
                  ? (role === "student" ? "Your Learning Tools" : role === "teacher" ? "Teaching Excellence" : "Core Features")
                  : "Powerful Features"
                }
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold text-shimmer mb-8">
                {isAuthenticated 
                  ? (role === "student" ? "Your Student Features" : role === "teacher" ? "Your Teaching Tools" : "Powerful Features")
                  : "Revolutionize Education"
                }
              </h2>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {isAuthenticated 
                  ? (role === "student" ? "Everything you need to excel in your academic journey" : role === "teacher" ? "Advanced tools to inspire and educate the next generation" : "Everything you need to manage your educational institution effectively")
                  : "Experience the future of school management with AI-powered insights and seamless integration"
                }
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
              {getCurrentFeatures().map(({ icon: Icon, title, description, color, accent }, index) => (
                <div 
                  key={title}
                  className={`group relative overflow-hidden transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} ${activeFeature === index ? 'scale-105' : ''}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  {/* Card Background with Multiple Layers */}
                  <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 group h-full">
                    {/* Animated Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-3xl opacity-0 group-hover:opacity-10 transition-all duration-500`}></div>
                    
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    </div>

                    {/* Floating Icon */}
                    <div className="relative z-10">
                      <div className={`relative w-16 h-16 bg-gradient-to-r ${accent} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white drop-shadow-sm" />
                        
                        {/* Icon Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${accent} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500 scale-150`}></div>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors duration-300">
                        {title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                        {description}
                      </p>

                      {/* Enhanced Learn More Link */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300 cursor-pointer">
                          <span className="text-sm">Explore Feature</span>
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                        
                        {/* Active Indicator */}
                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${activeFeature === index ? `bg-gradient-to-r ${color} scale-100` : 'bg-gray-300 scale-75'}`}></div>
                      </div>
                    </div>

                    {/* Animated Border */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${accent} transition-all duration-500 ${activeFeature === index ? 'w-full' : 'w-0 group-hover:w-full'} rounded-full`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Facility Section */}
        {showFacilitySection && (
          <section className="py-24 bg-gradient-to-r from-blue-900/5 via-purple-900/5 to-blue-900/5 backdrop-blur-sm relative overflow-hidden">
            {/* Section Background */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="text-center mb-20">
                <div className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-lg rounded-full text-purple-600 font-medium mb-8 shadow-lg">
                  <Library className="w-4 h-4 mr-2 animate-bounce" />
                  School Facilities
                  <Heart className="w-4 h-4 ml-2 text-red-500 animate-pulse" />
                </div>
                
                <h2 className="text-5xl md:text-6xl font-bold text-shimmer mb-8">
                  Complete Infrastructure
                </h2>
                
                {/* Enhanced Facility Description */}
                <div className="max-w-5xl mx-auto mb-12">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                      <p className="text-lg text-gray-700 leading-relaxed">
                        Experience seamless integration of <strong className="text-blue-600">library management</strong>, <strong className="text-green-600">transport coordination</strong>, and <strong className="text-purple-600">financial operations</strong>. Our intelligent system ensures every aspect of school life runs smoothly, from book recommendations to route optimization.
                      </p>
                      
                      {/* Animated Icons */}
                      <div className="flex justify-center mt-8 space-x-6">
                        <Library className="w-8 h-8 text-blue-500 animate-bounce" style={{ animationDelay: '0s' }} />
                        <Bus className="w-8 h-8 text-green-500 animate-bounce" style={{ animationDelay: '0.5s' }} />
                        <CreditCard className="w-8 h-8 text-purple-500 animate-bounce" style={{ animationDelay: '1s' }} />
                        <Shield className="w-8 h-8 text-orange-500 animate-bounce" style={{ animationDelay: '1.5s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Facility Features Grid */}
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
                {facilityFeatures.map(({ icon: Icon, title, description, color, accent }, index) => (
                  <div 
                    key={title}
                    className={`group relative transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                    style={{ transitionDelay: `${600 + index * 150}ms` }}
                  >
                    {/* 3D Card Effect */}
                    <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-6 hover:rotate-1 group overflow-hidden h-full">
                      {/* Animated Background Pattern */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-3xl opacity-0 group-hover:opacity-15 transition-all duration-500`}></div>
                      
                      {/* Floating Particles for Each Card */}
                      <div className="absolute inset-0 overflow-hidden">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className={`absolute w-1 h-1 bg-gradient-to-r ${color} rounded-full opacity-0 group-hover:opacity-60 transition-all duration-1000`}
                            style={{
                              top: `${20 + i * 25}%`,
                              right: `${10 + i * 15}%`,
                              animation: `particle-float ${8 + i * 2}s ease-in-out infinite`,
                              animationDelay: `${i * 0.5}s`
                            }}
                          ></div>
                        ))}
                      </div>

                      <div className="relative z-10">
                        {/* Animated Icon */}
                        <div className={`relative w-16 h-16 bg-gradient-to-r ${accent || color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500 shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                          
                          {/* Icon Ripple Effect */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${accent || color} rounded-2xl animate-ping opacity-0 group-hover:opacity-75`}></div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors duration-300">
                          {title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                          {description}
                        </p>

                        {/* Interactive Elements */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300 cursor-pointer">
                            <span className="text-sm">Discover More</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                          </div>
                          
                          {/* Pulse Indicator */}
                          <div className="relative">
                            <div className={`w-3 h-3 bg-gradient-to-r ${color} rounded-full`}></div>
                            <div className={`absolute inset-0 w-3 h-3 bg-gradient-to-r ${color} rounded-full animate-ping opacity-75`}></div>
                          </div>
                        </div>
                      </div>

                      {/* Magic Corner Effect */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/50 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Enhanced Trust Section */}
        <section className="py-20 bg-gradient-to-r from-white/60 via-blue-50/80 to-white/60 backdrop-blur-sm relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-green-400/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-purple-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                 style={{ transitionDelay: '300ms' }}>
              
              {/* Trust Badges */}
              <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12 mb-12">
                {[
                  { icon: Shield, text: "Bank-Grade Security", color: "from-green-500 to-emerald-400" },
                  { icon: Clock, text: "99.9% Uptime", color: "from-blue-500 to-cyan-400" },
                  { icon: Award, text: "Industry Leading", color: "from-purple-500 to-pink-400" }
                ].map(({ icon: Icon, text, color }, index) => (
                  <div 
                    key={text}
                    className={`group flex items-center space-x-3 px-6 py-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500 hover:scale-110 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                    style={{ transitionDelay: `${500 + index * 200}ms` }}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{text}</span>
                    
                    {/* Animated underline */}
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r ${color} group-hover:w-3/4 transition-all duration-500`}></div>
                  </div>
                ))}
              </div>

              {/* Trust Message */}
              <div className="max-w-2xl mx-auto">
                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                  Trusted by thousands of educational institutions worldwide. 
                  <span className="text-blue-600 font-semibold"> Join the revolution</span> in educational technology.
                </p>
                
                {/* Animated Stars */}
                <div className="flex justify-center mt-6 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 text-yellow-400 fill-current transition-all duration-300 hover:scale-125 ${isVisible ? 'animate-pulse' : ''}`}
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section - Enhanced */}
        {!isAuthenticated && (
          <section className="py-24 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_70%)]"></div>
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_70%)]"></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                   style={{ transitionDelay: '200ms' }}>
                
                {/* CTA Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-600 font-medium mb-8 animate-pulse">
                  <Zap className="w-4 h-4 mr-2" />
                  Ready to Transform Your School?
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-shimmer mb-6">
                  Start Your Journey Today
                </h2>
                
                <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of schools already using SchoolMS to create better learning experiences for students and teachers.
                </p>

                {/* Enhanced CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <button className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 text-white rounded-2xl font-bold transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-110 overflow-hidden">
                    <div className="relative z-10 flex items-center space-x-3">
                      <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} />
                      <span className="text-lg">Start Free Trial</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform duration-300" />
                    </div>
                    
                    {/* Multiple Layer Effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 scale-150"></div>
                  </button>
                  
                  <button className="group px-12 py-6 bg-white/90 backdrop-blur-lg text-gray-700 rounded-2xl font-bold border-2 border-gray-200/50 hover:bg-white hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-blue-300/50 relative overflow-hidden">
                    <div className="relative z-10 flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-lg">Schedule Demo</span>
                    </div>
                    
                    {/* Hover Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 flex justify-center items-center space-x-8 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No Credit Card Required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>GDPR Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span>Setup in Minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Floating Action Elements for Authenticated Users */}
        {isAuthenticated && (
          <div className="fixed bottom-8 right-8 z-50">
            <div className="relative group">
              {/* Main FAB */}
              <button className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '4s' }} />
              </button>
              
              {/* Notification Dot */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Scroll Indicator */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <div className="flex flex-col items-center space-y-2 animate-bounce">
            <div className="w-6 h-10 border-2 border-blue-400/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mt-2 animate-pulse"></div>
            </div>
            <span className="text-xs text-gray-500 font-medium">Scroll to explore</span>
          </div>
        </div>

        {/* Performance Indicator */}
        <div className="fixed top-24 right-4 z-50">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/50">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600 font-medium">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}