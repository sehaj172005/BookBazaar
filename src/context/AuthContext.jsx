"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin, register as apiRegister, getProfileMe } from "@/lib/api";
import { toast } from "sonner";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("bb_user");
    const token = localStorage.getItem("bb_token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Optionally verify token/refresh profile
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const res = await getProfileMe();
      setUser(res.data.user);
      localStorage.setItem("bb_user", JSON.stringify(res.data.user));
    } catch (err) {
      console.error("Auth refresh failed:", err);
      // If token is invalid, interceptor will handle redirect to /auth
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await apiLogin({ email, password });
      const { token, ...userData } = res.data;
      
      localStorage.setItem("bb_token", token);
      localStorage.setItem("bb_user", JSON.stringify(userData));
      setUser(userData);
      
      toast.success("Welcome back!");
      router.push("/");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await apiRegister({ name, email, password });
      const { token, ...userData } = res.data;
      
      localStorage.setItem("bb_token", token);
      localStorage.setItem("bb_user", JSON.stringify(userData));
      setUser(userData);
      
      toast.success("Account created successfully!");
      router.push("/");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("bb_token");
    localStorage.removeItem("bb_user");
    setUser(null);
    toast.info("Logged out");
    router.push("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
