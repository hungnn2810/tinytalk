import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, login, logout } = context;
  const isAuthenticated = !!user;

  return {
    user,
    login,
    logout,
    isAuthenticated,
  };
};
