"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LayoutDashboard, Users, CheckSquare, DollarSign, GitBranch, Brain, BarChart3, Settings, LogOut, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { usePlan } from "@/hooks/use-plan";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, feature: "dashboard" },
  { label: "Students", href: "/dashboard/students", icon: Users, feature: "students" },
  { label: "Attendance", href: "/dashboard/attendance", icon: CheckSquare, feature: "attendance" },
  { label: "Fees", href: "/dashboard/fees", icon: DollarSign, feature: "fees" },
  { label: "Workflows", href: "/dashboard/workflows", icon: GitBranch, feature: "workflows" },
  { label: "AI Tools", href: "/dashboard/ai", icon: Brain, feature: "ai_tools" },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3, feature: "analytics" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, feature: "dashboard" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { canAccess } = usePlan();

  return (
    <aside className="flex h-screen w-60 flex-col bg-slate-900 px-3 py-6">
      <div className="mb-8 flex items-center gap-2 px-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-bold text-white">EduFlow</span>
        <span className="ml-auto rounded-full bg-indigo-900 px-2 py-0.5 text-xs font-medium text-indigo-300">#15</span>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const locked = !canAccess(item.feature);
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={locked ? "#" : item.href}
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white",
                locked && "cursor-not-allowed opacity-40")}>
              <item.icon className="h-4 w-4" />
              {item.label}
              {locked && <Lock className="ml-auto h-3 w-3" />}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 pt-4">
        <div className="flex items-center gap-3 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white">GH</div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-semibold text-white">Greenfield School</p>
            <p className="truncate text-xs text-slate-500">Starter Plan</p>
          </div>
          <button onClick={logout} className="text-slate-500 hover:text-white transition-colors"><LogOut className="h-4 w-4" /></button>
        </div>
      </div>
    </aside>
  );
}
