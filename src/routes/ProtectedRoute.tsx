import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getToken } from "../api/authService";
import type { ReactElement } from "react";

export default function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const token = getToken();
    const redirectTo = token ? "/login" : "/signup";
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children;
}


