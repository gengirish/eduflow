import Link from "next/link";
import {
  GraduationCap, ArrowRight, Workflow, Bot, MessageCircle,
  DollarSign, Users, BarChart3, CheckCircle, Star,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">EduFlow</span>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">MVP #15</span>
            </div>
            <div className="hidden items-center gap-6 md:flex">
              <Link href="/#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
              <Link href="/#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link>
              <Link href="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">Sign in</Link>
              <Link href="/dashboard" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pb-20 pt-32 px-4 bg-slate-50">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            Built for the 2026 school — AI-native, WhatsApp-first
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-slate-900 md:text-6xl">
            The School OS<br />
            <span className="text-indigo-600">Built for 2026</span>
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-xl text-slate-600">
            Stop managing schools on WhatsApp and Excel. EduFlow gives you configurable workflows, AI-powered report cards, and real-time analytics — all in one platform.
          </p>
          <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard" className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-indigo-500 transition-colors">
              Try Demo Dashboard <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/#pricing" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              View Pricing
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["500K+ schools still on Excel", "AI-powered report cards", "WhatsApp-first communication", "15% YoY market growth"].map((badge) => (
              <span key={badge} className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-extrabold text-slate-900">Everything Your School Needs</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              One platform to replace five legacy tools — and actually make your staff love their software.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Workflow, title: "Visual Workflow Builder", desc: "Drag-and-drop automation with 20+ triggers and 50+ actions. Automate admissions, fee reminders, exam notifications — anything.", color: "indigo" },
              { icon: Bot, title: "AI Report Cards", desc: "Auto-generate personalised teacher comments from marks using Gemini AI. 10 minutes of work becomes 10 seconds.", color: "indigo" },
              { icon: MessageCircle, title: "WhatsApp-First", desc: "Attendance alerts, fee reminders, and results sent directly via WhatsApp. Meet parents where they already are.", color: "emerald" },
              { icon: DollarSign, title: "Fee Management", desc: "Razorpay & Stripe integration, instalment plans, automatic late fees, and real-time collection dashboards.", color: "amber" },
              { icon: Users, title: "Student SIS", desc: "Full Student Information System with parent portal, academic history, attendance tracking, and health records.", color: "indigo" },
              { icon: BarChart3, title: "Predictive Analytics", desc: "AI detects at-risk students before they drop out and predicts fee defaults 30 days in advance.", color: "indigo" },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-slate-50 py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-extrabold text-slate-900">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-slate-600">No setup fees. No long-term contracts. Cancel anytime.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Starter", price: "$99", priceINR: "₹8,299", period: "/month",
                desc: "Perfect for small schools getting started",
                features: ["Up to 300 students", "Core modules (SIS, Attendance, Fees)", "5 pre-built workflows", "Email support", "Basic analytics"],
                cta: "Start Free Trial", popular: false,
              },
              {
                name: "Growth", price: "$299", priceINR: "₹24,999", period: "/month",
                desc: "For growing schools that want AI superpowers",
                features: ["Up to 1,500 students", "All AI features (report cards, at-risk detection)", "WhatsApp integration", "Unlimited custom workflows", "Priority support", "Fee prediction AI"],
                cta: "Start Free Trial", popular: true,
              },
              {
                name: "Enterprise", price: "$799", priceINR: "₹66,999", period: "/month",
                desc: "For large schools and multi-campus institutions",
                features: ["Unlimited students", "Custom workflow development", "Dedicated Customer Success Manager", "99.9% SLA guarantee", "Custom integrations (ERP, Tally, etc.)", "On-premise option available"],
                cta: "Talk to Sales", popular: false,
              },
            ].map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl p-8 ${plan.popular ? "border-2 border-indigo-600 bg-white shadow-lg" : "border border-slate-200 bg-white shadow-sm"}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white">
                      <Star className="h-3 w-3" /> Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                    <span className="text-slate-500">{plan.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{plan.priceINR}/month billed in INR</p>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard"
                  className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${plan.popular ? "bg-indigo-600 text-white hover:bg-indigo-500" : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-slate-900">Start Your Free 30-Day Trial</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
            No credit card required. Full access to all features. Onboarding support included.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-indigo-500 transition-colors">
            Try Demo Dashboard <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 px-4">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">EduFlow by IntelliForge AI</div>
              <div className="text-xs text-slate-500">#BuildwithAiGiri MVP #15</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">Sign in</Link>
            <span>© 2026 IntelliForge AI. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
