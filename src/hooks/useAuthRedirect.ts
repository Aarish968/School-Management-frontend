import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../api/authService";

/**
 * Redirects user to /login if not authenticated
 */
export function useAuthRedirect() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const me = await getMe();
        if (me) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate("/login", { replace: true });
        }
      } catch (err) {
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  return { loading, isAuthenticated };
}
