import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import type { User } from "../models/user.model";
import { refreshAccessToken } from "../services/auth.service";
import { isTokenExpired } from "../utils/auth.util";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const savedUser = localStorage.getItem("user");

        if (!accessToken || !refreshToken) {
          logout();
          if (window.location.pathname !== "/login") {
            navigate("/login", { replace: true });
          }
          return;
        }

        if (isTokenExpired(accessToken)) {
          if (isTokenExpired(refreshToken)) {
            logout();
            navigate("/login", { replace: true });
            return;
          }

          try {
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (!newAccessToken) {
              logout();
              navigate("/login", { replace: true });
              return;
            }
            localStorage.setItem("accessToken", newAccessToken);
          } catch {
            logout();
            navigate("/login", { replace: true });
            return;
          }
        }

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch {
        logout();
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    void initAuth();
  }, [navigate]);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  if (loading) {
    return <div>Loading...</div>; // 👈 tránh render app khi chưa load xong
  }

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
