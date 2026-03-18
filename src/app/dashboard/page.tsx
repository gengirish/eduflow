"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users, GraduationCap, DollarSign, AlertTriangle, CheckCircle,
  Zap, Brain, BarChart3, Settings, Plus,
  RefreshCw, ChevronRight, Wifi
} from "lucide-react";
import {
  fetchStudents, fetchStudentStats, fetchAttendanceSummary,
  fetchFeeStats, fetchWorkflows, toggleWorkflow, callAITool,
  createStudent, markAttendance
} from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://intelliforge-eduflow-api.fly.dev";

type Student = {
  id: number; name: string; grade: string; parent_name?: string;
  parent_phone?: string; parent_email?: string; fee_status: string;
  attendance_pct: number; risk_score: string; is_active: boolean; created_at: string;
};

type Workflow = {
  id: number; name: string; trigger_type: string; is_active: boolean; trigger_count: number; config: Record<string, unknown>;
};

// Template workflows to show when DB is empty
const WORKFLOW_TEMPLATES = [
  { name: "Attendance Alert", trigger_type: "attendance", description: "Auto-notify parents when student is absent", nodes: ["Student Absent", "3rd time?", "WhatsApp Parent", "Alert Counselor"] },
  { name: "Fee Escalation", trigger_type: "fee", description: "Escalate overdue fees automatically", nodes: ["Fee Overdue", "Day 7 Reminder", "Late Fee Added", "Principal Alert"] },
  { name: "Admission Pipeline", trigger_type: "admission", description: "Manage end-to-end admissions", nodes: ["Form Submitted", "Doc Check", "Interview", "Enrolled"] },
  { name: "Exam Notification", trigger_type: "exam", description: "Exam scheduling and result workflow", nodes: ["Exam Scheduled", "Hall Ticket", "Results", "Report Card"] },
  { name: "Staff Leave Approval", trigger_type: "staff", description: "Leave request approval chain", nodes: ["Leave Applied", "HOD Review", "Approved/Rejected", "Calendar Updated"] },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [students, setStudents] = useState<Student[]>([]);
  const [studentStats, setStudentStats] = useState({ total: 0, at_risk: 0, fee_overdue: 0 });
  const [attendance, setAttendance] = useState({ present: 0, absent: 0, date: "" });
  const [feeStats, setFeeStats] = useState({ total: 0, collected: 0, overdue_count: 0 });
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiResult, setAiResult] = useState("");
  const [aiTool, setAiTool] = useState("report-card");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [studentFilter, setStudentFilter] = useState<string | undefined>(undefined);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", grade: "", parent_name: "", parent_phone: "", parent_email: "" });
  const [apiConnected, setApiConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [stats, att, fees, wfs, studs] = await Promise.all([
        fetchStudentStats(),
        fetchAttendanceSummary(),
        fetchFeeStats(),
        fetchWorkflows(),
        fetchStudents(studentFilter ? { risk_score: studentFilter } : undefined),
      ]);
      setStudentStats(stats);
      setAttendance(att);
      setFeeStats(fees);
      setWorkflows(wfs);
      setStudents(studs);
      setApiConnected(true);
      setLastUpdated(new Date().toLocaleTimeString("en-IN"));
    } catch {
      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  }, [studentFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleToggleWorkflow = async (id: number) => {
    await toggleWorkflow(id);
    const updated = await fetchWorkflows();
    setWorkflows(updated);
  };

  const handleActivateTemplate = async (tpl: typeof WORKFLOW_TEMPLATES[0]) => {
    const res = await fetch(`${API_URL}/api/workflows/`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: tpl.name, trigger_type: tpl.trigger_type, config: { nodes: tpl.nodes } })
    });
    const wf = await res.json();
    setWorkflows(prev => [...prev, wf]);
  };

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.grade) return;
    await createStudent(newStudent);
    setShowAddStudent(false);
    setNewStudent({ name: "", grade: "", parent_name: "", parent_phone: "", parent_email: "" });
    const [studs, stats] = await Promise.all([fetchStudents(), fetchStudentStats()]);
    setStudents(studs);
    setStudentStats(stats);
  };

  const handleMarkAttendance = async (studentId: number, status: "present" | "absent") => {
    const today = new Date().toISOString().split("T")[0];
    await markAttendance({ student_id: studentId, date: today, status });
    const att = await fetchAttendanceSummary();
    setAttendance(att);
  };

  const handleAITool = async () => {
    setAiLoading(true);
    setAiResult("");
    const data = aiTool === "report-card" ? { studentName: "Student", marks: aiInput } : {};
    const res = await callAITool(aiTool, data);
    setAiResult(typeof res.result === "string" ? res.result : JSON.stringify(res.result, null, 2));
    setAiLoading(false);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "students", label: "Students", icon: Users },
    { id: "attendance", label: "Attendance", icon: CheckCircle },
    { id: "fees", label: "Fees", icon: DollarSign },
    { id: "workflows", label: "Workflows", icon: Settings },
    { id: "ai", label: "AI Tools", icon: Brain },
  ];

  const feeCollectionPct = feeStats.total > 0 ? Math.round((feeStats.collected / feeStats.total) * 100) : 0;
  const attendancePct = (attendance.present + attendance.absent) > 0
    ? Math.round((attendance.present / (attendance.present + attendance.absent)) * 100) : 0;

  return (
    <div style={{ backgroundColor: "#030014", minHeight: "100vh", color: "white", fontFamily: "system-ui, sans-serif" }}>
      {/* Top nav */}
      <div style={{ borderBottom: "1px solid #1e1b4b", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <GraduationCap size={24} color="#00d4ff" />
          <span style={{ fontWeight: 700, fontSize: "18px" }}>EduFlow Dashboard</span>
          <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "8px" }}>Greenfield International School</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
            <Wifi size={12} color={apiConnected ? "#22c55e" : "#ef4444"} />
            <span style={{ color: apiConnected ? "#22c55e" : "#ef4444" }}>
              {apiConnected ? `Live • Neon DB` : "Offline"}
            </span>
          </div>
          <span style={{ fontSize: "11px", color: "#6b7280" }}>Updated: {lastUpdated}</span>
          <button onClick={loadData} style={{ background: "none", border: "none", color: "#00d4ff", cursor: "pointer" }}>
            <RefreshCw size={16} />
          </button>
          <Link href="/" style={{ fontSize: "13px", color: "#00d4ff", textDecoration: "none" }}>← Back to site</Link>
          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "12px", background: "#1e1b4b", color: "#7c3aed" }}>Demo Mode</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid #1e1b4b", padding: "0 24px", display: "flex", gap: "4px" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: "12px 16px", background: "none", border: "none", cursor: "pointer",
            color: activeTab === tab.id ? "#00d4ff" : "#6b7280",
            borderBottom: activeTab === tab.id ? "2px solid #00d4ff" : "2px solid transparent",
            display: "flex", alignItems: "center", gap: "6px", fontSize: "14px",
          }}>
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
            <RefreshCw size={32} style={{ animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
            <div>Connecting to Neon PostgreSQL…</div>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {!loading && activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
              {[
                { label: "Total Students", value: studentStats.total, icon: Users, color: "#00d4ff", sub: "Active enrolments" },
                { label: "Attendance Today", value: `${attendancePct}%`, icon: CheckCircle, color: "#22c55e", sub: `${attendance.present} present, ${attendance.absent} absent` },
                { label: "Fee Collection", value: `${feeCollectionPct}%`, icon: DollarSign, color: "#f59e0b", sub: `\u20b9${(feeStats.collected/100000).toFixed(1)}L of \u20b9${(feeStats.total/100000).toFixed(1)}L` },
                { label: "At-Risk Students", value: studentStats.at_risk, icon: AlertTriangle, color: "#ef4444", sub: `${studentStats.fee_overdue} fee overdue` },
              ].map((card, i) => (
                <div key={i} style={{ background: "#0d0a2e", border: "1px solid #1e1b4b", borderRadius: "12px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>{card.label}</div>
                      <div style={{ fontSize: "28px", fontWeight: 700, color: card.color }}>{card.value}</div>
                      <div style={{ fontSize: "12px", color: "#4b5563", marginTop: "4px" }}>{card.sub}</div>
                    </div>
                    <card.icon size={24} color={card.color} style={{ opacity: 0.6 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div style={{ background: "#0d0a2e", border: "1px solid #1e1b4b", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontWeight: 600, marginBottom: "16px", color: "#00d4ff" }}>Live from Neon PostgreSQL</div>
              {students.slice(0, 5).map(s => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e1b4b" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1e1b4b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 500 }}>{s.name}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>Grade {s.grade}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "12px", background: s.risk_score === "high" ? "#450a0a" : s.risk_score === "medium" ? "#451a03" : "#052e16", color: s.risk_score === "high" ? "#ef4444" : s.risk_score === "medium" ? "#f59e0b" : "#22c55e" }}>
                      {s.risk_score} risk
                    </span>
                    <span style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "12px", background: s.fee_status === "overdue" ? "#450a0a" : "#1e1b4b", color: s.fee_status === "overdue" ? "#ef4444" : "#6b7280" }}>
                      {s.fee_status}
                    </span>
                  </div>
                </div>
              ))}
              {students.length === 0 && <div style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>No students yet. Add one in the Students tab.</div>}
            </div>
          </div>
        )}

        {/* STUDENTS TAB */}
        {!loading && activeTab === "students" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                {[undefined, "high", "medium"].map(f => (
                  <button key={String(f)} onClick={() => setStudentFilter(f)} style={{
                    padding: "6px 16px", borderRadius: "20px", border: "1px solid", cursor: "pointer", fontSize: "13px",
                    background: studentFilter === f ? "#00d4ff" : "transparent",
                    color: studentFilter === f ? "#030014" : "#00d4ff",
                    borderColor: "#00d4ff"
                  }}>
                    {f === undefined ? "All" : f === "high" ? "At-Risk" : "Medium Risk"}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAddStudent(!showAddStudent)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#00d4ff", color: "#030014", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                <Plus size={14} /> Add Student
              </button>
            </div>

            {showAddStudent && (
              <div style={{ background: "#0d0a2e", border: "1px solid #00d4ff", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                <div style={{ fontWeight: 600, marginBottom: "12px", color: "#00d4ff" }}>Add New Student to Neon DB</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  {[
                    { key: "name", placeholder: "Student name *" },
                    { key: "grade", placeholder: "Grade (e.g. 10A) *" },
                    { key: "parent_name", placeholder: "Parent name" },
                    { key: "parent_phone", placeholder: "Parent phone" },
                    { key: "parent_email", placeholder: "Parent email" },
                  ].map(f => (
                    <input key={f.key} placeholder={f.placeholder} value={(newStudent as Record<string, string>)[f.key]} onChange={e => setNewStudent(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={{ padding: "8px 12px", background: "#030014", border: "1px solid #1e1b4b", borderRadius: "8px", color: "white", fontSize: "13px" }} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={handleAddStudent} style={{ padding: "8px 20px", background: "#7c3aed", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>Save to Neon</button>
                  <button onClick={() => setShowAddStudent(false)} style={{ padding: "8px 20px", background: "transparent", color: "#6b7280", border: "1px solid #1e1b4b", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            )}

            <div style={{ background: "#0d0a2e", border: "1px solid #1e1b4b", borderRadius: "12px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1e1b4b" }}>
                    {["ID", "Name", "Grade", "Attendance", "Fee Status", "Risk", "Parent Contact"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} style={{ borderBottom: "1px solid #1e1b4b" }}>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "#6b7280" }}>#{s.id}</td>
                      <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 500 }}>{s.name}</td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "#00d4ff" }}>{s.grade}</td>
                      <td style={{ padding: "12px 16px", fontSize: "13px" }}>
                        <span style={{ color: s.attendance_pct < 70 ? "#ef4444" : s.attendance_pct < 85 ? "#f59e0b" : "#22c55e" }}>{s.attendance_pct}%</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "12px", background: s.fee_status === "overdue" ? "#450a0a" : s.fee_status === "pending" ? "#451a03" : "#052e16", color: s.fee_status === "overdue" ? "#ef4444" : s.fee_status === "pending" ? "#f59e0b" : "#22c55e" }}>
                          {s.fee_status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "12px", background: s.risk_score === "high" ? "#450a0a" : s.risk_score === "medium" ? "#451a03" : "#052e16", color: s.risk_score === "high" ? "#ef4444" : s.risk_score === "medium" ? "#f59e0b" : "#22c55e" }}>
                          {s.risk_score}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "12px", color: "#6b7280" }}>{s.parent_phone || "\u2014"}</td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>No students found. Add your first student above.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {!loading && activeTab === "attendance" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <div style={{ background: "#0d0a2e", border: "1px solid #1e1b4b", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "36px", fontWeight: 700, color: "#22c55e" }}>{attendance.present}</div>
                <div style={{ color: "#6b7280", fontSize: "14px" }}>Present Today</div>
              </div>
              <div style={{ background: "#0d0a2e", border: "1px solid #1e1b4b", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "36px", fontWeight: 700, color: "#ef4444" }}>{attendance.absent}</div>
                <div style={{ color: "#6b7280", fontSize: "14px" }}>Absent Today</div>
              </div>
              <div style={{ background: "#0d0a2e", border: "1px solid #1e1b4b", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "36px", fontWeight: 700, color: "#00d4ff" }}>{attendancePct}%</div>
                <div style={{ color: "#6b7280", fontSize: "14px" }}>Attendance Rate</div>
              </div>
            </div>
            <div style={{ background: "#0d0a2e", border: "1px solid #1e1b4b", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontWeight: 600, marginBottom: "16px", color: "#00d4ff" }}>Mark Today&apos;s Attendance</div>
              {students.map(s => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1e1b4b" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>{s.name}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>Grade {s.grade}</div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleMarkAttendance(s.id, "present")} style={{ padding: "4px 12px", background: "#052e16", color: "#22c55e", border: "1px solid #22c55e", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                      Present
                    </button>
                    <button onClick={() => handleMarkAttendance(s.id, "absent")} style={{ padding: "4px 12px", background: "#450a0a", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEES TAB */}
        {!loading && activeTab === "fees" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <div style={{ background: "#0d0a2e", border: "1px solid #1e1b4b", borderRadius: "12px", padding: "20px" }}>
                <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>Total Billed</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#00d4ff" }}>\u20b9{(feeStats.total/100000).toFixed(1)}L</div>
              </div>
              <div style={{ background: "#0d0a2e", border: "1px solid #1e1b4b", borderRadius: "12px", padding: "20px" }}>
                <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>Collected</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#22c55e" }}>\u20b9{(feeStats.collected/100000).toFixed(1)}L</div>
              </div>
              <div style={{ background: "#0d0a2e", border: "1px solid #1e1b4b", borderRadius: "12px", padding: "20px" }}>
                <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>Overdue Records</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#ef4444" }}>{feeStats.overdue_count}</div>
              </div>
            </div>
            <div style={{ background: "#0d0a2e", border: "1px solid #1e1b4b", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontWeight: 600, marginBottom: "12px", color: "#f59e0b" }}>Collection Progress</div>
              <div style={{ background: "#1e1b4b", borderRadius: "8px", height: "12px", overflow: "hidden" }}>
                <div style={{ width: `${feeCollectionPct}%`, height: "100%", background: "linear-gradient(90deg, #f59e0b, #22c55e)", borderRadius: "8px" }} />
              </div>
              <div style={{ marginTop: "8px", fontSize: "14px", color: "#6b7280" }}>{feeCollectionPct}% collected this month</div>
              <div style={{ marginTop: "16px", fontSize: "13px", color: "#6b7280" }}>
                Add fee records via <code style={{ color: "#00d4ff" }}>POST /api/fees/</code> to see real data here.
              </div>
            </div>
          </div>
        )}

        {/* WORKFLOWS TAB */}
        {!loading && activeTab === "workflows" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ fontWeight: 600, color: "#00d4ff" }}>{workflows.length > 0 ? `${workflows.length} Active Workflows` : "Workflow Templates"}</div>
            </div>
            {(workflows.length > 0 ? workflows.map(wf => ({
              id: wf.id, name: wf.name, description: `Trigger: ${wf.trigger_type}`, is_active: wf.is_active, trigger_count: wf.trigger_count,
              nodes: (wf.config as Record<string, string[]>).nodes || ["Trigger", "Condition", "Action"]
            })) : WORKFLOW_TEMPLATES.map(t => ({ ...t, id: 0, is_active: false, trigger_count: 0 }))).map((wf, i) => (
              <div key={i} style={{ background: "#0d0a2e", border: "1px solid #1e1b4b", borderRadius: "12px", padding: "20px", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "15px" }}>{wf.name}</div>
                    <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>{wf.description} • {wf.trigger_count} triggers</div>
                  </div>
                  {wf.id > 0 ? (
                    <button onClick={() => handleToggleWorkflow(wf.id)} style={{ padding: "6px 14px", background: wf.is_active ? "#052e16" : "#1e1b4b", color: wf.is_active ? "#22c55e" : "#6b7280", border: `1px solid ${wf.is_active ? "#22c55e" : "#1e1b4b"}`, borderRadius: "20px", cursor: "pointer", fontSize: "12px" }}>
                      {wf.is_active ? "\u25cf Active" : "\u25cb Paused"}
                    </button>
                  ) : (
                    <button onClick={() => handleActivateTemplate(wf as typeof WORKFLOW_TEMPLATES[0])} style={{ padding: "6px 14px", background: "#7c3aed", color: "white", border: "none", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
                      Activate
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  {wf.nodes.map((node: string, j: number) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 500, background: j === 0 ? "#0c1a2e" : j === wf.nodes.length - 1 ? "#0a2e1a" : "#1e1b4b", color: j === 0 ? "#00d4ff" : j === wf.nodes.length - 1 ? "#22c55e" : "#f59e0b", border: `1px solid ${j === 0 ? "#00d4ff" : j === wf.nodes.length - 1 ? "#22c55e" : "#f59e0b"}` }}>
                        {node}
                      </div>
                      {j < wf.nodes.length - 1 && <ChevronRight size={14} color="#4b5563" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI TOOLS TAB */}
        {!loading && activeTab === "ai" && (
          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {[
                { id: "report-card", label: "Report Card Generator" },
                { id: "at-risk", label: "At-Risk Detector" },
                { id: "fee-prediction", label: "Fee Predictor" },
              ].map(t => (
                <button key={t.id} onClick={() => { setAiTool(t.id); setAiResult(""); }} style={{ padding: "8px 16px", background: aiTool === t.id ? "#7c3aed" : "transparent", color: aiTool === t.id ? "white" : "#7c3aed", border: "1px solid #7c3aed", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
                  {t.label}
                </button>
              ))}
            </div>

            <div style={{ background: "#0d0a2e", border: "1px solid #1e1b4b", borderRadius: "12px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "#7c3aed" }}>
                <Brain size={20} />
                <span style={{ fontWeight: 600 }}>Powered by Gemini 2.0 Flash → OpenRouter fallback</span>
              </div>

              {aiTool === "report-card" && (
                <textarea value={aiInput} onChange={e => setAiInput(e.target.value)}
                  placeholder="Enter student marks: Maths: 85, Science: 72, English: 65, Social Studies: 78..."
                  style={{ width: "100%", height: "100px", background: "#030014", border: "1px solid #1e1b4b", borderRadius: "8px", color: "white", padding: "12px", fontSize: "13px", resize: "vertical", boxSizing: "border-box", marginBottom: "12px" }} />
              )}

              <button onClick={handleAITool} disabled={aiLoading} style={{ padding: "10px 24px", background: aiLoading ? "#1e1b4b" : "#7c3aed", color: "white", border: "none", borderRadius: "8px", cursor: aiLoading ? "not-allowed" : "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                <Zap size={14} />
                {aiLoading ? "Calling Gemini\u2026" : aiTool === "report-card" ? "Generate Comments" : aiTool === "at-risk" ? "Detect At-Risk Students" : "Predict Fee Defaults"}
              </button>

              {aiResult && (
                <div style={{ marginTop: "20px", background: "#030014", border: "1px solid #7c3aed", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ fontSize: "12px", color: "#7c3aed", marginBottom: "8px" }}>AI Response (via FastAPI → Gemini/OpenRouter → Neon)</div>
                  <pre style={{ whiteSpace: "pre-wrap", fontSize: "13px", color: "#e2e8f0", fontFamily: "monospace", margin: 0 }}>{aiResult}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
