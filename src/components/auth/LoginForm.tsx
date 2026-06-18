import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, getMe } from "../../api/authService";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { login: authLogin } = useAuth()
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    if (!GOOGLE_CLIENT_ID) {
      setErrors({ email: "", password: "", general: "Google sign-in is not configured yet." });
      return;
    }
    // Google OAuth flow will be triggered here when client ID is set
    setErrors({ email: "", password: "", general: "Google sign-in coming soon." });
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "", general: "" };
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({ email: "", password: "", general: "" });
    setSuccessMessage("");
try {
  const data = await apiLogin({ email, password });
  console.log("Login API response:", data);

  const token = data?.access_token;
  if (!token) throw new Error("No authentication token received from server");

  localStorage.setItem("token", token);
  localStorage.setItem("authToken", token);

  // Use backend's user object directly
  let userInfo = null;

  if (data?.user) {
    userInfo = data.user; // ✅ already contains institution_type
  } else {
    // fallback to /me endpoint if needed
    try {
      const userData = await getMe();
      userInfo = userData;
    } catch (meError) {
      console.warn("Failed to get user data from /me:", meError);
    }
  }

  if (!userInfo) throw new Error("Unable to retrieve user info");

  // Save user with institution_type intact
  localStorage.setItem("currentUser", JSON.stringify(userInfo));

  // Update auth context
 authLogin({
   id: userInfo.id,
   full_name: userInfo.full_name,
   email: userInfo.email,
   role: userInfo.role,
   institution_type: userInfo.institution_type || null
 }, token);

  setSuccessMessage(`Welcome back, ${userInfo.full_name}!`);

  // Redirect
  setTimeout(() => {
    redirectBasedOnRole(userInfo.role);
  });
} catch (err: any)   {
      console.error("Login error:", err);

      let errorMessage = "Login failed. Please try again.";
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (err?.response?.status === 429) {
        errorMessage = "Too many login attempts. Please try again later.";
      } else if (err?.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setErrors({ email: "", password: "", general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const redirectBasedOnRole = (role: string | null) => {
    if (!role) {
      console.warn("No role found, redirecting to home");
      navigate("/");
      return;
    }

    const normalizedRole = role.toLowerCase().trim();
    switch (normalizedRole) {
      case "teacher":
        navigate("/dashboard");
        break;
      case "student":
        navigate("/");
        break;
      default:
        console.warn(`Unknown role: ${role}, redirecting to home`);
        navigate("/");
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

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Email Address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="email"
            placeholder="Enter your email"
            className={`w-full pl-12 pr-4 py-4 bg-gray-50/80 backdrop-blur-sm border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-gray-50 transition-colors ${errors.email ? "border-red-300 bg-red-50/50" : "border-gray-200"}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className={`w-full pl-12 pr-12 py-4 bg-gray-50/80 backdrop-blur-sm border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-gray-50 transition-colors ${errors.password ? "border-red-300 bg-red-50/50" : "border-gray-200"}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      {errors.general && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errors.general}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 disabled:opacity-60 transition-opacity"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>

      <div className="relative flex items-center">
        <div className="flex-grow border-t border-gray-200" />
        <span className="mx-3 text-sm text-gray-400">or</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>

      <button
        type="button"
        onClick={() => handleGoogleLogin()}
        disabled={isLoading}
        className="w-full py-4 flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-2xl text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-60 transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 29.9 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.9 0 20-7.9 20-21 0-1.4-.1-2.7-.5-4z"/>
          <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.1 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3c-7.6 0-14.2 4.3-17.7 11.7z"/>
          <path fill="#FBBC05" d="M24 45c5.8 0 10.7-1.9 14.3-5.2l-6.6-5.4C29.8 36.1 27 37 24 37c-5.8 0-10.7-3.9-12.4-9.3l-7 5.4C8.1 40.8 15.5 45 24 45z"/>
          <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.9 2.6-2.6 4.8-4.9 6.3l6.6 5.4C41.6 37.1 45 31 45 24c0-1.4-.1-2.7-.5-4z"/>
        </svg>
        Continue with Google
      </button>
    </form>
  );
}
