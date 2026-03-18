"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowLeft,
  Plus,
  X,
  ChevronRight,
  Zap,
  Clock,
  Bell,
  CheckCircle,
  Play,
} from "lucide-react";

const WORKFLOW_TEMPLATES = [
  {
    id: 1,
    name: "Attendance Alert",
    description: "Automatically notify parents and counselors when a student misses class repeatedly",
    category: "Student Welfare",
    status: "Active",
    nodes: [
      { label: "Absent Marked", type: "trigger" },
      { label: "Check: 3rd time?", type: "condition" },
      { label: "WhatsApp Parent", type: "action" },
      { label: "No Response?", type: "condition" },
      { label: "Alert Counselor", type: "action" },
    ],
    runs: 247,
    lastRun: "2 hours ago",
  },
  {
    id: 2,
    name: "Fee Escalation",
    description: "Progressive fee escalation from gentle reminder to legal notice over 30 days",
    category: "Finance",
    status: "Active",
    nodes: [
      { label: "Fee Overdue", type: "trigger" },
      { label: "Day 7: Reminder", type: "action" },
      { label: "Day 14: Late Fee", type: "action" },
      { label: "Day 21: Call Principal", type: "action" },
      { label: "Day 30: Legal Notice", type: "action" },
    ],
    runs: 89,
    lastRun: "1 day ago",
  },
  {
    id: 3,
    name: "Admission Pipeline",
    description: "Complete end-to-end admission workflow from form submission to enrollment",
    category: "Admissions",
    status: "Active",
    nodes: [
      { label: "Form Submitted", type: "trigger" },
      { label: "Doc Verification", type: "condition" },
      { label: "Interview Scheduled", type: "action" },
      { label: "Decision Made", type: "condition" },
      { label: "Fee Payment", type: "action" },
    ],
    runs: 34,
    lastRun: "3 hours ago",
  },
  {
    id: 4,
    name: "Exam Notification",
    description: "Automated exam preparation pipeline — hall tickets, reminders, results, report cards",
    category: "Academics",
    status: "Available",
    nodes: [
      { label: "Exam Scheduled", type: "trigger" },
      { label: "7 Days: Hall Ticket", type: "action" },
      { label: "1 Day: Reminder", type: "action" },
      { label: "Results Ready", type: "condition" },
      { label: "Report Card: Generate", type: "action" },
    ],
    runs: 12,
    lastRun: "2 weeks ago",
  },
  {
    id: 5,
    name: "Staff Leave Approval",
    description: "Streamline leave applications through HOD review with calendar sync",
    category: "HR",
    status: "Available",
    nodes: [
      { label: "Leave Applied", type: "trigger" },
      { label: "HOD Review", type: "condition" },
      { label: "If Approved: Confirm", type: "action" },
      { label: "If Rejected: Notify", type: "action" },
      { label: "Update Calendar", type: "action" },
    ],
    runs: 58,
    lastRun: "5 days ago",
  },
];

const NODE_TRIGGER_OPTIONS = [
  { name: "Custom Trigger", desc: "Define a custom event to start this workflow", icon: Zap },
  { name: "Scheduled Task", desc: "Run automatically on a time-based schedule", icon: Clock },
  { name: "Event-based", desc: "React to school events and actions", icon: Bell },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState(WORKFLOW_TEMPLATES);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activatedIds, setActivatedIds] = useState<Set<number>>(new Set([1, 2, 3]));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleActivate = (id: number) => {
    setActivatedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast("Workflow paused.");
      } else {
        next.add(id);
        showToast("Workflow activated successfully!");
      }
      return next;
    });
  };

  const nodeStyle = (type: string) => {
    if (type === "trigger") return { bg: "rgba(0,212,255,0.15)", border: "rgba(0,212,255,0.4)", text: "#00d4ff" };
    if (type === "condition") return { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", text: "#f59e0b" };
    return { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.4)", text: "#22c55e" };
  };

  const categoryColor: Record<string, string> = {
    "Student Welfare": "#00d4ff",
    Finance: "#f59e0b",
    Admissions: "#7c3aed",
    Academics: "#22c55e",
    HR: "#6b7280",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#030014" }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
          <CheckCircle className="w-4 h-4" /> {toast}
        </div>
      )}

      {/* Nav */}
      <nav className="border-b border-neural-border sticky top-0 z-40" style={{ backgroundColor: "rgba(3,0,20,0.97)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)" }}>
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">EduFlow</span>
              <span className="text-gray-600 text-sm hidden sm:block">/ Workflow Builder</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)" }}
              >
                <Plus className="w-4 h-4" /> New Workflow
              </button>
              <Link href="/" className="flex items-center gap-1 text-sm text-gray-400 hover:text-neural-cyan transition-colors">
                <ArrowLeft className="w-4 h-4" /> Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-3">
            Visual <span className="gradient-text-cyan-purple">Workflow Builder</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Configure any school process in minutes — no code, no IT team. Choose a template or build from scratch.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 rounded-xl" style={{ backgroundColor: "rgba(13,10,46,0.6)", border: "1px solid #1e1b4b" }}>
          <span className="text-sm text-gray-500 font-medium">Node types:</span>
          {[
            { label: "Trigger", color: "#00d4ff", bg: "rgba(0,212,255,0.15)", border: "rgba(0,212,255,0.4)" },
            { label: "Condition", color: "#f59e0b", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)" },
            { label: "Action", color: "#22c55e", bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.4)" },
          ].map((n) => (
            <span key={n.label} className="px-3 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: n.bg, border: `1px solid ${n.border}`, color: n.color }}>
              {n.label}
            </span>
          ))}
          <span className="text-gray-600 text-sm ml-2">Connected by → arrows</span>
        </div>

        {/* Workflow Cards */}
        <div className="space-y-6">
          {workflows.map((wf) => {
            const isActive = activatedIds.has(wf.id);
            return (
              <div key={wf.id} className="rounded-2xl p-6 card-hover" style={{ backgroundColor: "rgba(13,10,46,0.8)", border: "1px solid #1e1b4b" }}>
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold text-white">{wf.name}</h3>
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={
                          isActive
                            ? { backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }
                            : { backgroundColor: "rgba(107,114,128,0.15)", color: "#6b7280", border: "1px solid rgba(107,114,128,0.3)" }
                        }
                      >
                        {isActive ? "Active" : "Available"}
                      </span>
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: `${categoryColor[wf.category] || "#6b7280"}20`, color: categoryColor[wf.category] || "#6b7280", border: `1px solid ${categoryColor[wf.category] || "#6b7280"}40` }}
                      >
                        {wf.category}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{wf.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => showToast("Workflow Customizer coming soon! (Full drag-and-drop canvas in v2)")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{ backgroundColor: "rgba(124,58,237,0.15)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.3)" }}
                    >
                      Customise
                    </button>
                    <button
                      onClick={() => handleActivate(wf.id)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:scale-105"
                      style={isActive ? { background: "linear-gradient(135deg, #f59e0b, #ef4444)" } : { background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
                    >
                      {isActive ? "Pause" : <><Play className="w-3 h-3" /> Activate</>}
                    </button>
                  </div>
                </div>

                {/* Node Chain */}
                <div className="overflow-x-auto pb-2">
                  <div className="flex items-center gap-2 min-w-max">
                    {wf.nodes.map((node, i) => {
                      const s = nodeStyle(node.type);
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <div
                            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-center whitespace-nowrap"
                            style={{ backgroundColor: s.bg, border: `1px solid ${s.border}`, color: s.text }}
                          >
                            {node.label}
                          </div>
                          {i < wf.nodes.length - 1 && (
                            <div className="flex items-center gap-0.5">
                              <div className="w-6 h-0.5 animate-flow" style={{ backgroundColor: "#1e1b4b" }} />
                              <span className="text-gray-600 text-lg animate-flow">→</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer stats */}
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-neural-border text-xs text-gray-600">
                  <span>Last run: {wf.lastRun}</span>
                  <span>Total runs: {wf.runs.toLocaleString()}</span>
                  <span>Nodes: {wf.nodes.length}</span>
                  {isActive && <span className="text-neural-green font-medium">Running</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Build From Scratch CTA */}
        <div className="mt-10 rounded-2xl p-8 text-center" style={{ backgroundColor: "rgba(124,58,237,0.08)", border: "1px dashed rgba(124,58,237,0.3)" }}>
          <h3 className="text-xl font-bold text-white mb-2">Need a custom workflow?</h3>
          <p className="text-gray-400 text-sm mb-6">Build any school process with our visual canvas — 20+ triggers, 50+ actions, unlimited complexity.</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #7c3aed, #00d4ff)" }}
          >
            <Plus className="w-4 h-4" /> Build Custom Workflow
          </button>
        </div>
      </div>

      {/* New Workflow Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
          <div className="rounded-2xl p-6 w-full max-w-md" style={{ backgroundColor: "#0d0a2e", border: "1px solid #1e1b4b" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white text-lg">New Workflow</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-6">Choose how to start your workflow:</p>
            <div className="space-y-3 mb-6">
              {NODE_TRIGGER_OPTIONS.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => { setShowModal(false); showToast(`Workflow canvas opening... (Full builder in v2)`); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)" }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(0,212,255,0.15)" }}>
                    <opt.icon className="w-5 h-5 text-neural-cyan" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{opt.name}</div>
                    <div className="text-xs text-gray-500">{opt.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 ml-auto" />
                </button>
              ))}
            </div>
            <div className="text-xs text-center text-gray-600">
              Or <Link href="/dashboard" className="text-neural-cyan hover:underline">view existing workflows</Link> in the dashboard
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
