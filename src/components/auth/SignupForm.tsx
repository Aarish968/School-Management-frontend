import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup as apiSignup, getMe } from "../../api/authService";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, GraduationCap, BookOpen } from "lucide-react";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "teacher",
    institution_type: "school" as "school" | "college"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    institution_type: "",
    general: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {
      full_name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      institution_type: "",
      general: ""
    };
    let isValid = true;

    // Full name validation
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
      isValid = false;
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = "Full name must be at least 2 characters";
      isValid = false;
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (!/^[a-zA-Z0-9_\.]{3,20}$/.test(formData.username)) {
      newErrors.username = "3-20 chars, letters/numbers/_/. only";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Please select a role";
      isValid = false;
    }

    // Institution type validation
    if (!formData.institution_type) {
      newErrors.institution_type = "Please select institution type";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({
      full_name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      institution_type: "",
      general: ""
    });
    setSuccessMessage("");

    try {
      const signupData = {
        full_name: formData.full_name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        institution_type: formData.institution_type
      };

      const data = await apiSignup(signupData);
      console.log("Signup API response:", data);

      const token = data?.access_token;
      if (!token) throw new Error("No authentication token received from server");

      // Store token
      localStorage.setItem("token", token);
      localStorage.setItem("authToken", token);

      // Get user data from /me endpoint
      let userInfo: { id: string; full_name: string; email: string; role: "student" | "teacher" } | null = null;
      try {
        const userData = await getMe();
        console.log("User data from /me endpoint:", userData);
        
        userInfo = {
          id: userData.id?.toString() || Date.now().toString(),
          full_name: userData.full_name || formData.full_name,
          email: userData.email || formData.email,
          role: (userData.role ? userData.role.toLowerCase().trim() : formData.role) as "student" | "teacher",
        };
      } catch (meError) {
        console.warn("Failed to get user data from /me endpoint:", meError);
        
        // Fallback: use form data
        userInfo = {
          id: Date.now().toString(),
          full_name: formData.full_name,
          email: formData.email,
          role: formData.role,
        };
      }

      // Store user data
      localStorage.setItem("currentUser", JSON.stringify(userInfo));

      // Update auth context
      authLogin({
        id: parseInt(userInfo.id),
        full_name: userInfo.full_name,
        email: userInfo.email,
        role: userInfo.role,
        institution_type: null // Add required field
      }, token);

      setSuccessMessage(`Welcome to SchoolMS, ${userInfo.full_name}!`);

      // Redirect based on role
      setTimeout(() => {
        if (userInfo.role === "teacher") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }, 1000);

    } catch (err: any) {
      console.error("Signup error:", err);

      let errorMessage = "Signup failed. Please try again.";
      if (err?.response?.status === 409) {
        errorMessage = "An account with this email already exists.";
      } else if (err?.response?.status === 400) {
        errorMessage = "Please check your input data and try again.";
      } else if (err?.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setErrors(prev => ({
        ...prev,
        general: errorMessage
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div className="p-4 bg-green-500 text-white rounded-2xl">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Row 1: Full Name & Username */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="full_name"
              placeholder="Enter your full name"
              className={`w-full pl-12 pr-4 py-4 bg-gray-50/80 backdrop-blur-sm border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-gray-50 transition-colors ${errors.full_name ? "border-red-300 bg-red-50/50" : "border-gray-200"}`}
              value={formData.full_name}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            {errors.full_name && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
            )}
          </div>
          {errors.full_name && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.full_name}</span>
            </p>
          )}
        </div>

        {/* Username */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              className={`w-full pl-12 pr-4 py-4 bg-gray-50/80 backdrop-blur-sm border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-gray-50 transition-colors ${errors.username ? "border-red-300 bg-red-50/50" : "border-gray-200"}`}
              value={formData.username}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            {errors.username && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
            )}
          </div>
          {errors.username && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.username}</span>
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Email & Institution Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className={`w-full pl-12 pr-4 py-4 bg-gray-50/80 backdrop-blur-sm border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-gray-50 transition-colors ${errors.email ? "border-red-300 bg-red-50/50" : "border-gray-200"}`}
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            {errors.email && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Institution Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Institution Type</label>
          <div className="relative">
            <select
              name="institution_type"
              value={formData.institution_type}
              onChange={handleInputChange}
              className={`w-full px-4 py-4 bg-gray-50/80 backdrop-blur-sm border rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-gray-50 transition-colors ${errors.institution_type ? "border-red-300 bg-red-50/50" : "border-gray-200"}`}
              disabled={isLoading}
            >
              <option value="school">School</option>
              <option value="college">College</option>
            </select>
          </div>
          {errors.institution_type && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.institution_type}</span>
            </p>
          )}
        </div>
      </div>

      {/* Row 3: Role & Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Role Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Role</label>
          <div className="relative">
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={`w-full px-4 py-4 bg-gray-50/80 backdrop-blur-sm border rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-gray-50 transition-colors ${errors.role ? "border-red-300 bg-red-50/50" : "border-gray-200"}`}
              disabled={isLoading}
            >
              <option value="student" className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Student
              </option>
              <option value="teacher" className="flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                Teacher
              </option>
            </select>
          </div>
          {errors.role && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.role}</span>
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className={`w-full pl-12 pr-12 py-4 bg-gray-50/80 backdrop-blur-sm border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-gray-50 transition-colors ${errors.password ? "border-red-300 bg-red-50/50" : "border-gray-200"}`}
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>
      </div>

      {/* Row 4: Confirm Password (full width) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm your password"
            className={`w-full pl-12 pr-12 py-4 bg-gray-50/80 backdrop-blur-sm border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-gray-50 transition-colors ${errors.confirmPassword ? "border-red-300 bg-red-50/50" : "border-gray-200"}`}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.confirmPassword}</span>
          </p>
        )}
      </div>



      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 disabled:opacity-60 transition-opacity"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </form>
  );
}