import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, getMe } from "../../api/authService";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

function decodeJwt(token: string): any | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("JWT decode error:", error);
    return null;
  }
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { login: authLogin } = useAuth()
  const navigate = useNavigate();

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

      // Get user data from /me endpoint
      let userInfo = null;
      try {
        const userData = await getMe();
        console.log("User data from /me endpoint:", userData);
        
        userInfo = {
          id: userData.id?.toString() || Date.now().toString(),
          full_name: userData.full_name || "User",
          email: userData.email || email,
          role: userData.role ? userData.role.toLowerCase().trim() : null,
        };
      } catch (meError) {
        console.warn("Failed to get user data from /me endpoint:", meError);
        
        // Fallback: try to decode JWT for user info
        try {
          const decoded = decodeJwt(token);
          if (decoded) {
            userInfo = {
              id: decoded?.sub || decoded?.id || Date.now().toString(),
              full_name: decoded?.name || decoded?.full_name || "User",
              email: decoded?.email || email,
              role: decoded?.role ? decoded.role.toLowerCase().trim() : null,
            };
          }
        } catch (jwtError) {
          console.warn("JWT decode failed:", jwtError);
        }
      }

      // If still no user info, try to get from API response
      if (!userInfo && data?.user) {
        userInfo = {
          id: data.user.id?.toString() || Date.now().toString(),
          full_name: data.user.full_name || data.user.name || "User",
          email: data.user.email || email,
          role: data.user.role ? data.user.role.toLowerCase().trim() : null,
        };
      }

      // Fallback if no user info available
      if (!userInfo) {
        userInfo = {
          id: Date.now().toString(),
          full_name: "User",
          email: email,
          role: null,
        };
      }

      // Store user data
      localStorage.setItem("currentUser", JSON.stringify(userInfo));

      // Update auth context
      authLogin(userInfo, token);
      
      setSuccessMessage(`Welcome back, ${userInfo.full_name}!`);

      // Redirect based on role
      setTimeout(() => {
        redirectBasedOnRole(userInfo.role);
      });
    } catch (err: any) {
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
    </form>
  );
}
