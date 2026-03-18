"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/types";

export function useAuth() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("eduflow_token");
    const savedRole = localStorage.getItem("eduflow_role") as UserRole;
    if (token) { setIsAuthenticated(true); setRole(savedRole || "principal"); }
    setLoading(false);
  }, []);

  const login = (email: string) => {
    localStorage.setItem("eduflow_token", "demo-token-" + Date.now());
    localStorage.setItem("eduflow_role", "principal");
    setIsAuthenticated(true); setRole("principal");
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("eduflow_token"); localStorage.removeItem("eduflow_role");
    setIsAuthenticated(false); setRole(null); router.push("/login");
  };

  return { role, isAuthenticated, loading, login, logout };
}
