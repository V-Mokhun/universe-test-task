import { AuthContext, type AuthContextType } from "@/context/auth-context";
import { authService } from "@/services";
import {
  type LoginCredentials,
  type RegisterCredentials,
  type User,
} from "@/services/auth-service/types";
import React, { useEffect, useState } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await authService.getCurrentUser();
        if (data) {
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to get current user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const { data, error } = await authService.login(credentials);
      if (data) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: error || "Login failed" };
      }
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const { data, error } = await authService.register(credentials);
      if (data) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: error || "Registration failed" };
      }
    } catch (error) {
      return { success: false, error: "Registration failed" };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
