"use client";
import { Lock } from "lucide-react";
import { usePlan } from "@/hooks/use-plan";

export function FeatureGate({ feature, children }: { feature: string; children: React.ReactNode }) {
  const { canAccess, requiredPlan } = usePlan();
  if (canAccess(feature)) return <>{children}</>;
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-12 text-center">
      <Lock className="mb-3 h-8 w-8 text-slate-400" />
      <p className="text-sm font-semibold text-slate-700">
        {requiredPlan(feature).charAt(0).toUpperCase() + requiredPlan(feature).slice(1)} plan required
      </p>
      <p className="mt-1 text-xs text-slate-500">Upgrade to unlock this feature</p>
      <button className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500">Upgrade Plan</button>
    </div>
  );
}
