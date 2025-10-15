// src/context/AuthContext.ts
import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string } | null;
  login: (user: { name: string }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
