"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  CalendarCheck,
  DollarSign,
  Workflow,
  Bot,
  ArrowLeft,
  Search,
  Bell,
  ChevronRight,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Play,
  Pause,
  Plus,
  BarChart3,
  TrendingUp,
  Loader2,
} from "lucide-react";

const TABS = ["Overview", "Students", "Attendance", "Fees", "Workflows", "AI Tools"] as const;
type Tab = typeof TABS[number];

const MOCK_STUDENTS = [
  { id: 1, name: "Arjun Sharma", grade: "10A", attendance: 94, feeStatus: "Paid", risk: "low" },
  { id: 2, name: "Priya Patel", grade: "9B", attendance: 78, feeStatus: "Pending", risk: "medium" },
  { id: 3, name: "Riya Singh", grade: "8C", attendance: 61, feeStatus: "Overdue", risk: "high" },
  { id: 4, name: "Karan Mehta", grade: "7A", attendance: 69, feeStatus: "Overdue", risk: "high" },
  { id: 5, name: "Ananya Gupta", grade: "11B", attendance: 91, feeStatus: "Paid", risk: "low" },
  { id: 6, name: "Rahul Kumar", grade: "6A", attendance: 85, feeStatus: "Paid", risk: "low" },
  { id: 7, name: "Sneha Nair", grade: "12A", attendance: 88, feeStatus: "Pending", risk: "low" },
  { id: 8, name: "Vijay Rao", grade: "10B", attendance: 73, feeStatus: "Pending", risk: "medium" },
  { id: 9, name: "Deepa Iyer", grade: "9A", attendance: 96, feeStatus: "Paid", risk: "low" },
  { id: 10, name: "Rohan Joshi", grade: "8A", attendance: 66, feeStatus: "Overdue", risk: "high" },
];

const CLASSES = [
  { name: "Grade 6A", attendance: 94, total: 32 },
  { name: "Grade 6B", attendance: 89, total: 30 },
  { name: "Grade 7A", attendance: 91, total: 35 },
  { name: "Grade 7B", attendance: 86, total: 33 },
  { name: "Grade 8A", attendance: 88, total: 34 },
  { name: "Grade 8B", attendance: 93, total: 31 },
  { name: "Grade 9A", attendance: 95, total: 36 },
  { name: "Grade 9B", attendance: 82, total: 34 },
];

const FEE_DEFAULTERS = [
  { name: "Riya Singh", grade: "8C", amount: "₹18,500", days: 45, id: 1 },
  { name: "Karan Mehta", grade: "7A", amount: "₹12,000", days: 38, id: 2 },
  { name: "Rohan Joshi", grade: "8A", amount: "₹9,800", days: 22, id: 3 },
  { name: "Vikram Patel", grade: "6B", amount: "₹15,200", days: 18, id: 4 },
  { name: "Meera Doshi", grade: "10C", amount: "₹7,500", days: 12, id: 5 },
];

const WORKFLOWS = [
  {
    id: 1,
    name: "Attendance Alert",
    description: "Auto-alerts parents via WhatsApp on 3rd absence",
    active: true,
    lastTriggered: "2 hours ago",
    triggerCount: 247,
    nodes: ["Student Absent", "3rd Time?", "WhatsApp Parent"],
  },
  {
    id: 2,
    name: "Fee Escalation",
    description: "Automatic late fee escalation and principal notification",
    active: true,
    lastTriggered: "1 day ago",
    triggerCount: 89,
    nodes: ["Fee Overdue", "Days > 7?", "Add Late Fee"],
  },
  {
    id: 3,
    name: "Admission Pipeline",
    description: "End-to-end automated admission process management",
    active: true,
    lastTriggered: "3 hours ago",
    triggerCount: 34,
    nodes: ["Form Submitted", "Docs Verified?", "Book Interview"],
  },
  {
    id: 4,
    name: "Exam Notification",
    description: "Hall tickets and results distribution automation",
    active: false,
    lastTriggered: "2 weeks ago",
    triggerCount: 12,
    nodes: ["Exam Scheduled", "7 Days Before?", "Send Hall Ticket"],
  },
  {
    id: 5,
    name: "Report Card Release",
    description: "Automated report card generation and parent notification",
    active: true,
    lastTriggered: "1 week ago",
    triggerCount: 156,
    nodes: ["Results Finalised", "All Marks In?", "Generate & Send"],
  },
];

const WORKFLOW_TEMPLATES = [
  { name: "Custom Trigger", desc: "Build from scratch", icon: Plus },
  { name: "Scheduled Task", desc: "Time-based automation", icon: Clock },
  { name: "Event-based", desc: "React to school events", icon: Bell },
];

const ACTIVITY = [
  { text: "Rahul Sharma marked absent — WhatsApp sent to parent", time: "2 min ago", type: "alert" },
  { text: "Fee reminder sent to 23 defaulters", time: "15 min ago", type: "fee" },
  { text: "Grade 10 results published to parent portal", time: "1 hr ago", type: "success" },
  { text: "New admission: Priya Patel enrolled in Grade 9B", time: "2 hrs ago", type: "success" },
  { text: "Workflow triggered: Fee escalation for 3 students", time: "3 hrs ago", type: "workflow" },
];

const AT_RISK = [
  { name: "Riya Singh", grade: "9A", attendance: 61, grade_avg: 48, reasons: ["Attendance < 65%", "Failing 3 subjects"] },
  { name: "Karan Mehta", grade: "8B", attendance: 69, grade_avg: 55, reasons: ["Fee overdue 45 days", "Attendance declining"] },
  { name: "Ananya Singh", grade: "10C", attendance: 75, grade_avg: 52, reasons: ["Grade drop: 78% → 52%", "Family issue noted"] },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [workflows, setWorkflows] = useState(WORKFLOWS);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [aiSubTab, setAiSubTab] = useState<"report-card" | "at-risk" | "fee-prediction">("report-card");
  const [reportForm, setReportForm] = useState({ studentName: "", marks: "" });
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [reminderSent, setReminderSent] = useState<Record<number, boolean>>({});
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [atRiskData, setAtRiskData] = useState<any[]>([]);
  const [feePredData, setFeePredData] = useState<any[]>([]);

  const filteredStudents = MOCK_STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleWorkflow = (id: number) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    );
  };

  const callAI = async (tool: string, data?: any) => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch("/api/ai-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, data }),
      });
      const json = await res.json();
      setAiResult(json.result);
      setAiSource(json.source);
      if (tool === "at-risk") {
        try { setAtRiskData(JSON.parse(json.result)); } catch {}
      }
      if (tool === "fee-prediction") {
        try { setFeePredData(JSON.parse(json.result)); } catch {}
      }
    } catch {
      setAiResult("Error connecting to AI service. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const nodeColor = (i: number) => {
    if (i === 0) return { bg: "rgba(0,212,255,0.15)", border: "rgba(0,212,255,0.4)", text: "#00d4ff" };
    if (i === 1) return { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", text: "#f59e0b" };
    return { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.4)", text: "#22c55e" };
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#030014" }}>
      {/* Top Nav */}
      <nav className="border-b border-neural-border sticky top-0 z-40" style={{ backgroundColor: "rgba(3,0,20,0.97)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)" }}>
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white hidden sm:block">EduFlow Dashboard</span>
              <span className="text-gray-500 text-sm hidden md:block">— Greenfield International School</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded-md text-xs font-semibold" style={{ backgroundColor: "rgba(245,158,11,0.2)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" }}>
                Demo Mode
              </span>
              <Link href="/" className="flex items-center gap-1 text-sm text-gray-400 hover:text-neural-cyan transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to site
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Bar */}
      <div className="border-b border-neural-border" style={{ backgroundColor: "rgba(13,10,46,0.6)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-thin">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setAiResult(null); }}
                className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={
                  activeTab === tab
                    ? { backgroundColor: "rgba(0,212,255,0.15)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.3)" }
                    : { color: "#6b7280", backgroundColor: "transparent" }
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* OVERVIEW TAB */}
        {activeTab === "Overview" && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Students", value: "847", icon: Users, color: "#00d4ff", change: "+12 this month" },
                { label: "Attendance Today", value: "91.2%", icon: CalendarCheck, color: "#22c55e", change: "↑ 2.1% vs yesterday" },
                { label: "Fee Collection", value: "₹12.4L", icon: DollarSign, color: "#f59e0b", change: "of ₹15.2L target (81.6%)" },
                { label: "Active Workflows", value: "7", icon: Workflow, color: "#7c3aed", change: "2 triggered today" },
              ].map((card) => (
                <div key={card.label} className="rounded-xl p-5 card-hover" style={{ backgroundColor: "rgba(13,10,46,0.8)", border: "1px solid #1e1b4b" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{card.label}</span>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}20` }}>
                      <card.icon className="w-4 h-4" style={{ color: card.color }} />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{card.value}</div>
                  <div className="text-xs" style={{ color: card.color }}>{card.change}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Activity Feed */}
              <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(13,10,46,0.8)", border: "1px solid #1e1b4b" }}>
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-neural-cyan" /> Recent Activity</h3>
                <div className="space-y-3">
                  {ACTIVITY.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-neural-border last:border-0">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{
                        backgroundColor:
                          a.type === "alert" ? "#ef4444" :
                          a.type === "fee" ? "#f59e0b" :
                          a.type === "success" ? "#22c55e" : "#7c3aed"
                      }} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">{a.text}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* At-Risk Panel */}
              <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(13,10,46,0.8)", border: "1px solid #1e1b4b" }}>
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-neural-amber" /> At-Risk Students</h3>
                <div className="space-y-3">
                  {AT_RISK.map((s, i) => (
                    <div key={i} className="rounded-lg p-3" style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white text-sm">{s.name}</span>
                        <span className="text-xs text-gray-500">{s.grade}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-400 mb-2">
                        <span>Attendance: <span className="text-red-400">{s.attendance}%</span></span>
                        <span>Avg: <span className="text-red-400">{s.grade_avg}%</span></span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {s.reasons.map((r, j) => (
                          <span key={j} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#fca5a5" }}>{r}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === "Students" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name or grade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:border-neural-cyan"
                  style={{ backgroundColor: "rgba(13,10,46,0.8)", border: "1px solid #1e1b4b" }}
                />
              </div>
            </div>

            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1e1b4b" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "rgba(13,10,46,0.9)" }}>
                    {["Name", "Grade", "Attendance", "Fee Status", "Risk"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neural-border">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-neural-surface transition-colors" style={{ backgroundColor: "rgba(3,0,20,0.4)" }}>
                      <td className="px-4 py-3 text-sm font-medium text-white">{s.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{s.grade}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-neural-border overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${s.attendance}%`, backgroundColor: s.attendance >= 85 ? "#22c55e" : s.attendance >= 75 ? "#f59e0b" : "#ef4444" }} />
                          </div>
                          <span className="text-sm text-gray-400">{s.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{
                          backgroundColor: s.feeStatus === "Paid" ? "rgba(34,197,94,0.15)" : s.feeStatus === "Pending" ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
                          color: s.feeStatus === "Paid" ? "#22c55e" : s.feeStatus === "Pending" ? "#f59e0b" : "#ef4444",
                        }}>
                          {s.feeStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{
                          backgroundColor: s.risk === "low" ? "rgba(34,197,94,0.15)" : s.risk === "medium" ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
                          color: s.risk === "low" ? "#22c55e" : s.risk === "medium" ? "#f59e0b" : "#ef4444",
                        }}>
                          {s.risk.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === "Attendance" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Today's Attendance</h2>
                <p className="text-gray-500 text-sm mt-1">March 18, 2026 — 91.2% overall</p>
              </div>
              <button
                onClick={() => setWhatsappSent(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white" }}
              >
                <MessageCircle className="w-4 h-4" />
                {whatsappSent ? "✓ Alerts Sent to 18 Parents" : "Send WhatsApp Alerts (18 absent)"}
              </button>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {CLASSES.map((cls) => (
                <div key={cls.name} className="rounded-xl p-4 card-hover" style={{ backgroundColor: "rgba(13,10,46,0.8)", border: "1px solid #1e1b4b" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-white text-sm">{cls.name}</span>
                    <span className="text-xs text-gray-500">{cls.total} students</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Present</span>
                      <span className="text-sm font-bold" style={{ color: cls.attendance >= 90 ? "#22c55e" : cls.attendance >= 80 ? "#f59e0b" : "#ef4444" }}>{cls.attendance}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neural-border overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${cls.attendance}%`, backgroundColor: cls.attendance >= 90 ? "#22c55e" : cls.attendance >= 80 ? "#f59e0b" : "#ef4444" }} />
                    </div>
                  </div>
                  <button className="w-full mt-2 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ backgroundColor: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)" }}>
                    Mark Attendance
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEES TAB */}
        {activeTab === "Fees" && (
          <div className="space-y-6">
            {/* Collection Progress */}
            <div className="rounded-xl p-6" style={{ backgroundColor: "rgba(13,10,46,0.8)", border: "1px solid #1e1b4b" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white">March 2026 Collection</h3>
                  <p className="text-sm text-gray-500 mt-1">₹12.4L collected of ₹15.2L target</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-neural-amber">81.6%</div>
                  <div className="text-xs text-gray-500">collection rate</div>
                </div>
              </div>
              <div className="w-full h-4 rounded-full bg-neural-border overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: "81.6%", background: "linear-gradient(90deg, #f59e0b, #22c55e)" }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>₹0</span>
                <span>₹12.4L collected</span>
                <span>₹15.2L target</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Defaulters */}
              <div className="md:col-span-2">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-neural-amber" /> Fee Defaulters</h3>
                <div className="space-y-3">
                  {FEE_DEFAULTERS.map((d) => (
                    <div key={d.id} className="rounded-xl p-4 flex items-center justify-between" style={{ backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
                      <div>
                        <div className="font-semibold text-white text-sm">{d.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Grade {d.grade} • Overdue {d.days} days</div>
                      </div>
                      <div className="text-right mr-4">
                        <div className="font-bold text-neural-amber">{d.amount}</div>
                        <div className="text-xs text-gray-600">overdue</div>
                      </div>
                      <button
                        onClick={() => setReminderSent((prev) => ({ ...prev, [d.id]: true }))}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={
                          reminderSent[d.id]
                            ? { backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }
                            : { backgroundColor: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" }
                        }
                      >
                        {reminderSent[d.id] ? "✓ Sent" : "Send Reminder"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="rounded-xl p-5" style={{ backgroundColor: "rgba(13,10,46,0.8)", border: "1px solid #1e1b4b" }}>
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-neural-purple" /> Fee Breakdown</h3>
                <div className="space-y-3">
                  {[
                    { label: "Tuition", pct: 60, color: "#00d4ff" },
                    { label: "Transport", pct: 20, color: "#7c3aed" },
                    { label: "Activities", pct: 15, color: "#22c55e" },
                    { label: "Other", pct: 5, color: "#f59e0b" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-400">{item.label}</span>
                        <span className="font-semibold" style={{ color: item.color }}>{item.pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-neural-border overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WORKFLOWS TAB */}
        {activeTab === "Workflows" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Active Workflows</h2>
              <button
                onClick={() => setShowWorkflowModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)", color: "white" }}
              >
                <Plus className="w-4 h-4" /> New Workflow
              </button>
            </div>

            <div className="space-y-4">
              {workflows.map((wf) => (
                <div key={wf.id} className="rounded-xl p-5 card-hover" style={{ backgroundColor: "rgba(13,10,46,0.8)", border: "1px solid #1e1b4b" }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-white">{wf.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={
                          wf.active
                            ? { backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }
                            : { backgroundColor: "rgba(107,114,128,0.15)", color: "#6b7280", border: "1px solid rgba(107,114,128,0.3)" }
                        }>
                          {wf.active ? "Active" : "Paused"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{wf.description}</p>
                    </div>
                    <button
                      onClick={() => toggleWorkflow(wf.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={
                        wf.active
                          ? { backgroundColor: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" }
                          : { backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }
                      }
                    >
                      {wf.active ? <><Pause className="w-3 h-3" /> Pause</> : <><Play className="w-3 h-3" /> Resume</>}
                    </button>
                  </div>

                  {/* Mini flow */}
                  <div className="flex items-center gap-2 mb-4">
                    {wf.nodes.map((node, i) => {
                      const c = nodeColor(i);
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <div className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
                            {node}
                          </div>
                          {i < wf.nodes.length - 1 && <span className="text-gray-600 text-sm">→</span>}
                        </div>
                      );
                    })}
                    <span className="text-gray-600 text-sm">→ ···</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Last triggered: {wf.lastTriggered}</span>
                    <span>Total runs: {wf.triggerCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI TOOLS TAB */}
        {activeTab === "AI Tools" && (
          <div className="space-y-6">
            <div className="flex gap-2">
              {(["report-card", "at-risk", "fee-prediction"] as const).map((sub) => (
                <button
                  key={sub}
                  onClick={() => { setAiSubTab(sub); setAiResult(null); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={
                    aiSubTab === sub
                      ? { backgroundColor: "rgba(124,58,237,0.2)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.4)" }
                      : { color: "#6b7280", border: "1px solid transparent" }
                  }
                >
                  {sub === "report-card" ? "Report Card Generator" : sub === "at-risk" ? "At-Risk Detector" : "Fee Predictor"}
                </button>
              ))}
            </div>

            {/* Report Card */}
            {aiSubTab === "report-card" && (
              <div className="rounded-xl p-6" style={{ backgroundColor: "rgba(13,10,46,0.8)", border: "1px solid #1e1b4b" }}>
                <h3 className="font-bold text-white mb-1 flex items-center gap-2"><Bot className="w-5 h-5 text-neural-purple" /> AI Report Card Generator</h3>
                <p className="text-sm text-gray-500 mb-6">Generate personalised teacher comments from student marks using Gemini AI</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-1.5">Student Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Arjun Sharma"
                      value={reportForm.studentName}
                      onChange={(e) => setReportForm((p) => ({ ...p, studentName: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
                      style={{ backgroundColor: "rgba(3,0,20,0.6)", border: "1px solid #1e1b4b" }}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1.5">Subject Marks</label>
                    <textarea
                      rows={4}
                      placeholder="e.g. Math: 87/100, Science: 92/100, English: 74/100, Social Studies: 88/100, Hindi: 79/100"
                      value={reportForm.marks}
                      onChange={(e) => setReportForm((p) => ({ ...p, marks: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none"
                      style={{ backgroundColor: "rgba(3,0,20,0.6)", border: "1px solid #1e1b4b" }}
                    />
                  </div>
                  <button
                    onClick={() => callAI("report-card", { studentName: reportForm.studentName || "Arjun Sharma", marks: reportForm.marks || "Math: 87, Science: 92, English: 74" })}
                    disabled={aiLoading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm text-white transition-all hover:scale-105 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #00d4ff)" }}
                  >
                    {aiLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Bot className="w-4 h-4" /> Generate Comments</>}
                  </button>
                  {aiResult && aiSubTab === "report-card" && (
                    <div className="rounded-xl p-5 mt-4" style={{ backgroundColor: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)" }}>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-4 h-4 text-neural-green" />
                        <span className="text-sm font-semibold text-neural-purple">Generated by {aiSource === "gemini" ? "Gemini 2.0 Flash" : aiSource === "openrouter" ? "Claude 3 Haiku" : "Mock (Demo)"}</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{aiResult}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* At-Risk */}
            {aiSubTab === "at-risk" && (
              <div className="rounded-xl p-6" style={{ backgroundColor: "rgba(13,10,46,0.8)", border: "1px solid #1e1b4b" }}>
                <h3 className="font-bold text-white mb-1 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-neural-amber" /> AI At-Risk Detector</h3>
                <p className="text-sm text-gray-500 mb-6">AI analyses attendance, grades, and payment patterns to flag students who need intervention</p>
                <button
                  onClick={() => callAI("at-risk")}
                  disabled={aiLoading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm text-white transition-all hover:scale-105 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
                >
                  {aiLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing...</> : <><TrendingUp className="w-4 h-4" /> Analyse Fleet</>}
                </button>
                {atRiskData.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {atRiskData.map((s: any, i: number) => (
                      <div key={i} className="rounded-xl p-4" style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-white">{s.name}</div>
                          <span className="text-xs text-gray-500">{s.grade}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {s.riskFactors?.map((f: string, j: number) => (
                            <span key={j} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#fca5a5" }}>{f}</span>
                          ))}
                        </div>
                        <p className="text-xs text-neural-amber">Recommendation: {s.recommendation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Fee Predictor */}
            {aiSubTab === "fee-prediction" && (
              <div className="rounded-xl p-6" style={{ backgroundColor: "rgba(13,10,46,0.8)", border: "1px solid #1e1b4b" }}>
                <h3 className="font-bold text-white mb-1 flex items-center gap-2"><DollarSign className="w-5 h-5 text-neural-cyan" /> AI Fee Default Predictor</h3>
                <p className="text-sm text-gray-500 mb-6">Predict which students are likely to default on fees in the next 30 days</p>
                <button
                  onClick={() => callAI("fee-prediction")}
                  disabled={aiLoading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm text-white transition-all hover:scale-105 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)" }}
                >
                  {aiLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Running...</> : <><BarChart3 className="w-4 h-4" /> Run Prediction</>}
                </button>
                {feePredData.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {feePredData.map((s: any, i: number) => (
                      <div key={i} className="rounded-xl p-4 flex items-center gap-4" style={{ backgroundColor: "rgba(13,10,46,0.6)", border: "1px solid #1e1b4b" }}>
                        <div className="flex-1">
                          <div className="font-semibold text-white text-sm">{s.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{s.grade} • {s.reason}</div>
                        </div>
                        <div className="text-right mr-4">
                          <div className="text-2xl font-black" style={{ color: s.defaultProbability >= 70 ? "#ef4444" : s.defaultProbability >= 40 ? "#f59e0b" : "#22c55e" }}>
                            {s.defaultProbability}%
                          </div>
                          <div className="text-xs text-gray-600">default risk</div>
                        </div>
                        <div className="text-xs text-right" style={{ color: s.defaultProbability >= 70 ? "#f59e0b" : "#6b7280" }}>
                          {s.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Workflow Modal */}
      {showWorkflowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="rounded-2xl p-6 w-full max-w-md" style={{ backgroundColor: "#0d0a2e", border: "1px solid #1e1b4b" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white text-lg">New Workflow</h3>
              <button onClick={() => setShowWorkflowModal(false)} className="text-gray-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-6">Choose a starting point for your workflow:</p>
            <div className="space-y-3">
              {WORKFLOW_TEMPLATES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setShowWorkflowModal(false)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)" }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(0,212,255,0.15)" }}>
                    <t.icon className="w-5 h-5 text-neural-cyan" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
