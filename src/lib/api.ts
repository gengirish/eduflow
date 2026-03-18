const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://intelliforge-eduflow-api.fly.dev";

export async function fetchStudents(params?: { grade?: string; fee_status?: string; risk_score?: string }) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const res = await fetch(`${API_URL}/api/students/${query ? `?${query}` : ""}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchStudentStats() {
  const res = await fetch(`${API_URL}/api/students/stats/summary`, { cache: "no-store" });
  if (!res.ok) return { total: 0, at_risk: 0, fee_overdue: 0 };
  return res.json();
}

export async function createStudent(data: { name: string; grade: string; parent_name?: string; parent_phone?: string; parent_email?: string }) {
  const res = await fetch(`${API_URL}/api/students/`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateStudent(id: number, data: { fee_status?: string; attendance_pct?: number; risk_score?: string }) {
  const res = await fetch(`${API_URL}/api/students/${id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchAttendanceSummary() {
  const res = await fetch(`${API_URL}/api/attendance/today/summary`, { cache: "no-store" });
  if (!res.ok) return { present: 0, absent: 0 };
  return res.json();
}

export async function markAttendance(data: { student_id: number; date: string; status: string; notes?: string }) {
  const res = await fetch(`${API_URL}/api/attendance/`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchFeeStats() {
  const res = await fetch(`${API_URL}/api/fees/stats/collection`, { cache: "no-store" });
  if (!res.ok) return { total: 0, collected: 0, overdue_count: 0 };
  return res.json();
}

export async function fetchWorkflows() {
  const res = await fetch(`${API_URL}/api/workflows/`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function toggleWorkflow(id: number) {
  const res = await fetch(`${API_URL}/api/workflows/${id}/toggle`, { method: "PATCH" });
  return res.json();
}

export async function callAITool(tool: string, data?: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/ai/tools`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tool, data }),
  });
  return res.json();
}
