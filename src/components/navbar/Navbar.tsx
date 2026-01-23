// src/components/Navbar/Navbar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  GraduationCap,
  Menu,
  X,
  Home,
  LogIn,
  ChevronDown,
  BookOpen,
  Users,
  LogOut,
} from "lucide-react";

type UserRole = "student" | "teacher" | "admin";

export default function Navbar() {
  const { currentUser, isAuthenticated, logoutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const role = currentUser?.role ?? null;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(false);
    setShowMore(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  // Dynamic menu based on user role and institution type
  const getMenuItems = (userRole: UserRole, institutionType?: string) => {
    const baseMenus: Record<UserRole, { to: string; label: string; icon: any }[]> = {
      student: [
        // Show grades for college students, report card for school students
        ...(institutionType === "college" 
          ? [{ to: "/grades", label: "My Grades", icon: BookOpen }]
          : [{ to: "/report-card", label: "Report Card", icon: Users }]
        ),
        { to: "/timetable", label: "Timetable", icon: Users },
        { to: "/study-materials", label: "Download Notes & Study Material", icon: BookOpen },
      ],
      teacher: [
        { to: "/upload-homework", label: "Upload Homework / Assignments", icon: Users },
        // Show different grade entry options based on institution type
        ...(institutionType === "college" 
          ? [{ to: "/grades", label: "Enter Student Grades", icon: BookOpen }]
          : [{ to: "/enter-marks", label: "Enter Report Card Marks", icon: Users }]
        ),
        { to: "/student-reports", label: "Student Progress Reports", icon: Users },
      ],
      admin: [
        { to: "/admin-dashboard", label: "Admin Dashboard", icon: Users },
        { to: "/manage-users", label: "Manage Users", icon: Users },
      ],
    };
    
    return baseMenus[userRole] || [];
  };

  const roleMenus = getMenuItems(role as UserRole, currentUser?.institution_type || undefined);

  const commonMenuItems = [
    { to: "/profile", label: "My Profile", icon: Users },
  ];

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl">
                <GraduationCap className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                SchoolMS
              </span>
              <span className="text-xs text-gray-500 -mt-1">Management System</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                isActive("/")
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50/80"
              }`}
            >
              <Home className="inline-block w-4 h-4 mr-2" />
              Home
            </Link>

            {!isAuthenticated ? (
              <Link
                to="/login"
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  isActive("/login")
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50/80"
                }`}
              >
                <LogIn className="inline-block w-4 h-4 mr-2" />
                Login
              </Link>
            ) : (
              <>
                {role === "teacher" && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                        isActive("/dashboard")
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50/80"
                      }`}
                    >
                      <Users className="inline-block w-4 h-4 mr-2" />
                      Dashboard
                    </Link>

                    <Link
                      to="/take-attendance"
                      className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                        isActive("/take-attendance")
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50/80"
                      }`}
                    >
                      <BookOpen className="inline-block w-4 h-4 mr-2" />
                      Take Attendance
                    </Link>
                  </>
                )}

                {role === "student" && (
                  <>
                    <Link
                      to="/attendance"
                      className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                        isActive("/attendance")
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50/80"
                      }`}
                    >
                      <BookOpen className="inline-block w-4 h-4 mr-2" />
                      View Attendance
                    </Link>

                    <Link
                      to="/homework"
                      className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                        isActive("/homework")
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50/80"
                      }`}
                    >
                      <BookOpen className="inline-block w-4 h-4 mr-2" />
                      Homework
                    </Link>
                  </>
                )}

                {/* Profile Link - Available for all authenticated users */}
                {/* <Link
                  to="/profile"
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    isActive("/profile")
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50/80"
                  }`}
                >
                  <Users className="inline-block w-4 h-4 mr-2" />
                  Profile
                </Link> */}

                {/* More Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all"
                  >
                    <span>More</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        showMore ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showMore && role && roleMenus.length > 0 && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                      {roleMenus.map(({ to, label, icon: Icon }) => (
                        <Link
                          key={to}
                          to={to}
                          className={`flex items-center px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                            isActive(to) ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-700"
                          }`}
                          onClick={() => setShowMore(false)}
                        >
                          <Icon className="h-4 w-4 mr-3 text-blue-600" />
                          {label}
                        </Link>
                      ))}

                      <div className="border-t border-gray-200 my-2"></div>

                      {commonMenuItems.map(({ to, label, icon: Icon }) => (
                        <Link
                          key={to}
                          to={to}
                          className={`flex items-center px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                            isActive(to) ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-700"
                          }`}
                          onClick={() => setShowMore(false)}
                        >
                          <Icon className="h-4 w-4 mr-3 text-blue-600" />
                          {label}
                        </Link>
                      ))}

                      <div className="border-t border-gray-200 my-2"></div>

                      <button
                        onClick={() => {
                          handleLogout();
                          setShowMore(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm hover:bg-red-50 transition-colors text-red-600"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-3 rounded-full bg-gray-50/80 text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 transition-all duration-300 group"
              aria-label="Toggle navigation menu"
            >
              <div className="relative w-5 h-5">
                <Menu
                  className={`absolute inset-0 transition-all duration-300 ${
                    isOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                  }`}
                />
                <X
                  className={`absolute inset-0 transition-all duration-300 ${
                    isOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-xl rounded-xl mt-2 border border-gray-200/20 shadow-lg">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/")
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Home className="inline-block w-4 h-4 mr-2" />
                Home
              </Link>

              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/login")
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn className="inline-block w-4 h-4 mr-2" />
                  Login
                </Link>
              ) : (
                <>
                  {role === "teacher" && (
                    <>
                      <Link
                        to="/dashboard"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          isActive("/dashboard")
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Users className="inline-block w-4 h-4 mr-2" />
                        Dashboard
                      </Link>

                      <Link
                        to="/take-attendance"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          isActive("/take-attendance")
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <BookOpen className="inline-block w-4 h-4 mr-2" />
                        Take Attendance
                      </Link>
                    </>
                  )}

                  {role === "student" && (
                    <>
                      <Link
                        to="/attendance"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          isActive("/attendance")
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <BookOpen className="inline-block w-4 h-4 mr-2" />
                        View Attendance
                      </Link>

                      <Link
                        to="/homework"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          isActive("/homework")
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <BookOpen className="inline-block w-4 h-4 mr-2" />
                        Homework
                      </Link>
                    </>
                  )}

                  {/* Profile Link - Available for all authenticated users */}
                  <Link
                    to="/profile"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/profile")
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Users className="inline-block w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/upload-homework"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/upload-homework")
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Users className="inline-block w-4 h-4 mr-2" />
                    Upload Home-Work & Assignment
                  </Link>

                  {role && roleMenus.length > 0 && roleMenus.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActive(to)
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="inline-block w-4 h-4 mr-2" />
                      {label}
                    </Link>
                  ))}

                  {commonMenuItems.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActive(to)
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="inline-block w-4 h-4 mr-2" />
                      {label}
                    </Link>
                  ))}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="inline-block w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}