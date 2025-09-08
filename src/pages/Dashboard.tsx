import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../api/authService"; // adjust path if needed

type UserRole = "student" | "teacher" | "admin" | "parent";

interface CurrentUser {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
}

export default function Dashboard() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if token exists first
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.log("No token found, redirecting to login");
          navigate("/login", { replace: true });
          return;
        }

        console.log("Fetching user data...");
        const data = await getMe();
        
        if (data && data.id) {
          setUser(data);
          console.log("User authenticated:", data);
        } else {
          throw new Error("Invalid user data received");
        }
      } catch (err) {
        console.error("Authentication failed:", err);
        setError("Authentication failed");
        
        // Clear all auth-related data
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        
        // Navigate with replace to prevent back navigation to dashboard
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  // Show error state (though this might not be visible due to navigation)
  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  // Don't render anything if no user (prevents flash before redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user.full_name}
          </h1>
          <p className="text-gray-600 capitalize">Role: {user.role}</p>
          
          {/* Debug info - remove in production */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Token exists:</strong> {localStorage.getItem("token") ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}