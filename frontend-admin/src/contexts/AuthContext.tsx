// src/context/AuthContext.ts
import { createContext } from "react";
import type { User } from "../models/user.model";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
