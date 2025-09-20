import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getToken, logout } from "../api/authService"; // ✅ now it exists

type UserRole = "student" | "teacher" | "admin" | null;

interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
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
        const user: AuthUser = JSON.parse(savedUser);
        user.id = Number(user.id);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        logout();
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  const login = (user: AuthUser, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser({ ...user, id: Number(user.id) });
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
