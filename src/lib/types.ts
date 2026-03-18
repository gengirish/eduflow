export type UserRole = "admin" | "principal" | "teacher" | "staff";
export type PlanTier = "free" | "starter" | "growth" | "enterprise";
export type Student = {
  id: number; name: string; grade: string;
  parent_name?: string; parent_phone?: string; parent_email?: string;
  fee_status: "paid" | "pending" | "overdue";
  attendance_pct: number; risk_score: "low" | "medium" | "high";
  is_active: boolean; created_at: string;
};
