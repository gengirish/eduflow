"use client";
import { useState } from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("principal@greenfield.edu");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { login(email); toast.success("Welcome to EduFlow!"); }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sign in to EduFlow</h1>
          <p className="mt-1 text-sm text-slate-600">AI school management for 2026</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label>
              <input type="password" defaultValue="demo123"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-center">
            <p className="text-xs text-slate-500">Demo credentials pre-filled — just click Sign in</p>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-slate-600">
          Need an account? <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">Get started free</Link>
        </p>
      </div>
    </div>
  );
}
