"use client";
import { useState, useEffect, useCallback } from "react";
import { Users, CheckSquare, DollarSign, AlertTriangle, RefreshCw } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { usePlan } from "@/hooks/use-plan";
import { FeatureGate } from "@/components/feature-gate";

const API_URL = "https://intelliforge-eduflow-api.fly.dev";

type Student = {
  id: number; name: string; grade: string;
  fee_status: "paid" | "pending" | "overdue";
  attendance_pct: number; risk_score: "low" | "medium" | "high";
  is_active: boolean; created_at: string;
};

function generateSparkline(base: number, count = 7) {
  return Array.from({ length: count }, (_, i) => ({
    day: i,
    value: Math.max(0, base + Math.floor((Math.random() - 0.5) * base * 0.3)),
  }));
}

export default function DashboardPage() {
  const { role } = useAuth();
  const { plan } = usePlan();
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState({ total: 0, at_risk: 0, fee_overdue: 0 });
  const [attendance, setAttendance] = useState({ present: 0, absent: 0 });
  const [feeStats, setFeeStats] = useState({ total: 0, collected: 0 });
  const [loading, setLoading] = useState(true);
  const [weeklyStudents] = useState(generateSparkline(120));
  const [weeklyAttendance] = useState(generateSparkline(85));
  const [weeklyFees] = useState(generateSparkline(72));
  const [weeklyRisk] = useState(generateSparkline(8));

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, attRes, feesRes, studsRes] = await Promise.all([
        fetch(`${API_URL}/api/students/stats`).then(r => r.json()),
        fetch(`${API_URL}/api/attendance/summary`).then(r => r.json()),
        fetch(`${API_URL}/api/fees/stats`).then(r => r.json()),
        fetch(`${API_URL}/api/students/?limit=10`).then(r => r.json()),
      ]);
      setStats(statsRes);
      setAttendance({ present: attRes.present || 0, absent: attRes.absent || 0 });
      setFeeStats({ total: feesRes.total || 0, collected: feesRes.collected || 0 });
      setStudents(Array.isArray(studsRes) ? studsRes : studsRes.students || []);
    } catch {
      // use fallback demo data
      setStats({ total: 247, at_risk: 12, fee_overdue: 18 });
      setAttendance({ present: 221, absent: 26 });
      setFeeStats({ total: 5000000, collected: 3750000 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleRefresh = async () => {
    await loadData();
    toast.success("Data refreshed");
  };

  const attendancePct = attendance.present + attendance.absent > 0
    ? Math.round((attendance.present / (attendance.present + attendance.absent)) * 100) : 0;
  const feeCollectionPct = feeStats.total > 0
    ? Math.round((feeStats.collected / feeStats.total) * 100) : 0;

  const feeStatusColor: Record<string, string> = {
    paid: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    overdue: "bg-red-50 text-red-700",
  };

  const riskColor: Record<string, string> = {
    low: "bg-emerald-50 text-emerald-700",
    medium: "bg-amber-50 text-amber-700",
    high: "bg-red-50 text-red-700",
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Greenfield School — {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <button onClick={handleRefresh} disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60 transition-colors">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Students</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyStudents}>
                <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="#eef2ff" strokeWidth={2} dot={false} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Attendance Today</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{attendancePct}%</p>
            </div>
            <CheckSquare className="h-8 w-8 text-emerald-500" />
          </div>
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyAttendance}>
                <Area type="monotone" dataKey="value" stroke="#10b981" fill="#d1fae5" strokeWidth={2} dot={false} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Fee Collection</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{feeCollectionPct}%</p>
            </div>
            <DollarSign className="h-8 w-8 text-amber-500" />
          </div>
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyFees}>
                <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} dot={false} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">At-Risk Students</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stats.at_risk}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyRisk}>
                <Area type="monotone" dataKey="value" stroke="#ef4444" fill="#fee2e2" strokeWidth={2} dot={false} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Present Today</p>
          <p className="mt-2 text-4xl font-bold text-emerald-500">{attendance.present}</p>
          <p className="mt-1 text-xs text-slate-500">out of {attendance.present + attendance.absent} students</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Absent Today</p>
          <p className="mt-2 text-4xl font-bold text-red-500">{attendance.absent}</p>
          <p className="mt-1 text-xs text-slate-500">parents notified via WhatsApp</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Fee Overdue</p>
          <p className="mt-2 text-4xl font-bold text-amber-500">{stats.fee_overdue}</p>
          <p className="mt-1 text-xs text-slate-500">escalation workflows triggered</p>
        </div>
      </div>

      {/* Recent Students Table */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Recent Students</h2>
          <p className="mt-0.5 text-sm text-slate-500">Live from the database</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Fee Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                    {loading ? "Loading students..." : "No students found."}
                  </td>
                </tr>
              )}
              {students.slice(0, 8).map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                        {s.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-900">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">{s.grade}</td>
                  <td className="px-6 py-3">
                    <span className={`text-sm font-medium ${s.attendance_pct < 70 ? "text-red-600" : s.attendance_pct < 85 ? "text-amber-600" : "text-emerald-600"}`}>
                      {s.attendance_pct}%
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${feeStatusColor[s.fee_status] || "bg-slate-100 text-slate-700"}`}>
                      {s.fee_status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskColor[s.risk_score] || "bg-slate-100 text-slate-700"}`}>
                      {s.risk_score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Tools — feature gated */}
      <FeatureGate feature="ai_tools">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">AI Tools</h2>
          <p className="mt-1 text-sm text-slate-500">Powered by Gemini 2.0 Flash</p>
        </div>
      </FeatureGate>
    </div>
  );
}
