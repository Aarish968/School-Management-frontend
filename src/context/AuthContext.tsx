import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getToken, logout } from "../api/authService";

type UserRole = "student" | "teacher";

interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  role: UserRole | null;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    const savedUser = localStorage.getItem("currentUser");
    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        // Clear invalid data
        logout();
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  const login = (user: AuthUser, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const logoutUser = () => {
    logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}