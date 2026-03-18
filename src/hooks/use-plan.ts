"use client";
import { useState } from "react";
import type { PlanTier } from "@/lib/types";

const PLAN_HIERARCHY: PlanTier[] = ["free", "starter", "growth", "enterprise"];
const FEATURE_TIERS: Record<string, PlanTier> = {
  dashboard: "free", students: "free", attendance: "free",
  fees: "starter", workflows: "starter", ai_tools: "growth",
  whatsapp: "growth", analytics: "enterprise",
};

export function usePlan() {
  const [plan] = useState<PlanTier>("starter");
  const canAccess = (f: string) => PLAN_HIERARCHY.indexOf(plan) >= PLAN_HIERARCHY.indexOf(FEATURE_TIERS[f] || "free");
  const requiredPlan = (f: string): PlanTier => FEATURE_TIERS[f] || "free";
  return { plan, canAccess, requiredPlan };
}
