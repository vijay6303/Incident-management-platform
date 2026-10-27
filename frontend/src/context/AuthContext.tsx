import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { loginUser, registerUser } from "../api/authApi";
import type { AuthResponse } from "../types/auth";

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("accessToken")
  );

  async function login(email: string, password: string) {
    const response: AuthResponse = await loginUser({
      email,
      password,
    });

    localStorage.setItem("accessToken", response.accessToken);
    setToken(response.accessToken);
  }

  async function register(email: string, password: string) {
    await registerUser({ email, password });
  }

  function logout() {
    localStorage.removeItem("accessToken");
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}