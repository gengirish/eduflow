import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  Workflow,
  Bot,
  MessageCircle,
  DollarSign,
  Users,
  BarChart3,
  CheckCircle,
  Zap,
  AlertTriangle,
  TrendingUp,
  Star,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#030014" }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neural-border" style={{ backgroundColor: "rgba(3,0,20,0.95)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)" }}>
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EduFlow</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full" style={{ backgroundColor: "rgba(124,58,237,0.2)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.3)" }}>
                MVP #15
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/#features" className="text-sm text-gray-400 hover:text-neural-cyan transition-colors">Features</Link>
              <Link href="/#workflows" className="text-sm text-gray-400 hover:text-neural-cyan transition-colors">Workflows</Link>
              <Link href="/#pricing" className="text-sm text-gray-400 hover:text-neural-cyan transition-colors">Pricing</Link>
              <Link href="/dashboard" className="text-sm text-neural-cyan hover:text-white transition-colors font-medium">View Demo</Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)" }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: "#00d4ff" }} />
        <div className="absolute top-40 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: "#7c3aed" }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm" style={{ backgroundColor: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff" }}>
            <Zap className="w-4 h-4" />
            <span>Built for the 2026 school — AI-native, WhatsApp-first, fully configurable</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="text-white">The School OS</span>
            <br />
            <span className="gradient-text">Built for 2026</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Stop managing schools on WhatsApp and Excel. EduFlow gives you configurable workflows, AI-powered report cards, and real-time analytics — all in one platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold text-white transition-all hover:scale-105 neural-glow-cyan"
              style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)" }}
            >
              Try Demo Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/workflows"
              className="flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105"
              style={{ backgroundColor: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)", color: "#7c3aed" }}
            >
              See Workflows <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 border-y border-neural-border" style={{ backgroundColor: "rgba(13,10,46,0.6)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500K+", label: "Schools still on Excel", color: "#f59e0b" },
              { value: "$400B", label: "Tuition managed via WhatsApp", color: "#ef4444" },
              { value: "95%", label: "Annual retention rate (EduFlow)", color: "#22c55e" },
              { value: "15%", label: "YoY market growth in India", color: "#00d4ff" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-black mb-2" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Why Schools Are Stuck</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Three problems killing school efficiency worldwide</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: AlertTriangle,
                title: "Rigid Legacy Software",
                color: "#ef4444",
                bgColor: "rgba(239,68,68,0.1)",
                borderColor: "rgba(239,68,68,0.3)",
                desc: "PowerSchool costs $50K/year, takes 6 months to implement, and can't be customised. Schools pay for features they don't need and lack the ones they do.",
              },
              {
                icon: Workflow,
                title: "Workflow Chaos",
                color: "#f59e0b",
                bgColor: "rgba(245,158,11,0.1)",
                borderColor: "rgba(245,158,11,0.3)",
                desc: "Admissions on email, fees on WhatsApp, attendance on paper, results on spreadsheets. No single system — just chaos, manual work, and human errors.",
              },
              {
                icon: Bot,
                title: "Zero AI Capability",
                color: "#ef4444",
                bgColor: "rgba(239,68,68,0.1)",
                borderColor: "rgba(239,68,68,0.3)",
                desc: "No school software uses AI to flag at-risk students, predict fee defaults, or write report card comments. They're all just digital filing cabinets.",
              },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl p-6 card-hover" style={{ backgroundColor: card.bgColor, border: `1px solid ${card.borderColor}` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${card.color}20` }}>
                  <card.icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                <p className="text-gray-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Builder Preview */}
      <section id="workflows" className="py-24 px-4" style={{ backgroundColor: "rgba(13,10,46,0.4)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Configure Any School Process in Minutes</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Visual workflow builder — no code, no IT team required. Just drag, drop, and automate.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Admissions Pipeline",
                nodes: [
                  { label: "Form Submitted", type: "trigger" },
                  { label: "Doc Verified?", type: "condition" },
                  { label: "Schedule Interview", type: "action" },
                ],
              },
              {
                name: "Fee Escalation",
                nodes: [
                  { label: "Fee Overdue", type: "trigger" },
                  { label: "Days > 7?", type: "condition" },
                  { label: "Add Late Fee", type: "action" },
                ],
              },
              {
                name: "Attendance Alert",
                nodes: [
                  { label: "Student Absent", type: "trigger" },
                  { label: "3rd Time?", type: "condition" },
                  { label: "WhatsApp Parent", type: "action" },
                ],
              },
            ].map((workflow) => (
              <div key={workflow.name} className="rounded-2xl p-6 card-hover" style={{ backgroundColor: "rgba(13,10,46,0.8)", border: "1px solid #1e1b4b" }}>
                <h3 className="text-lg font-bold text-white mb-6">{workflow.name}</h3>
                <div className="flex items-center gap-2">
                  {workflow.nodes.map((node, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-center flex-1"
                        style={{
                          backgroundColor:
                            node.type === "trigger" ? "rgba(0,212,255,0.15)" :
                            node.type === "condition" ? "rgba(245,158,11,0.15)" :
                            "rgba(34,197,94,0.15)",
                          border:
                            node.type === "trigger" ? "1px solid rgba(0,212,255,0.4)" :
                            node.type === "condition" ? "1px solid rgba(245,158,11,0.4)" :
                            "1px solid rgba(34,197,94,0.4)",
                          color:
                            node.type === "trigger" ? "#00d4ff" :
                            node.type === "condition" ? "#f59e0b" :
                            "#22c55e",
                        }}
                      >
                        {node.label}
                      </div>
                      {i < workflow.nodes.length - 1 && (
                        <span className="text-gray-600 animate-flow">→</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neural-green" />
                  <span className="text-xs text-gray-400">Active • 247 runs this month</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/workflows"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #7c3aed, #00d4ff)" }}
            >
              Explore All Workflows <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Everything Your School Needs</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">One platform to replace five legacy tools — and actually make your staff love their software.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Workflow,
                title: "Visual Workflow Builder",
                desc: "Drag-and-drop automation with 20+ triggers and 50+ actions. Automate admissions, fee reminders, exam notifications — anything.",
                color: "#00d4ff",
              },
              {
                icon: Bot,
                title: "AI Report Cards",
                desc: "Auto-generate personalised, warm teacher comments from marks using Gemini AI. 10 minutes of work becomes 10 seconds.",
                color: "#7c3aed",
              },
              {
                icon: MessageCircle,
                title: "WhatsApp-First",
                desc: "Attendance alerts, fee reminders, and results sent directly via WhatsApp. Meet parents where they already are.",
                color: "#22c55e",
              },
              {
                icon: DollarSign,
                title: "Fee Management",
                desc: "Razorpay & Stripe integration, instalment plans, automatic late fees, and real-time collection dashboards.",
                color: "#f59e0b",
              },
              {
                icon: Users,
                title: "Student SIS",
                desc: "Full Student Information System with parent portal, academic history, attendance tracking, and health records.",
                color: "#00d4ff",
              },
              {
                icon: BarChart3,
                title: "Predictive Analytics",
                desc: "AI detects at-risk students before they drop out and predicts fee defaults 30 days in advance. Act before it's too late.",
                color: "#7c3aed",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-2xl p-6 card-hover" style={{ backgroundColor: "rgba(13,10,46,0.6)", border: "1px solid #1e1b4b" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${feature.color}20` }}>
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4" style={{ backgroundColor: "rgba(13,10,46,0.4)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 text-lg">No setup fees. No long-term contracts. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Starter",
                price: "$99",
                priceINR: "₹8,299",
                period: "/month",
                desc: "Perfect for small schools getting started",
                features: [
                  "Up to 300 students",
                  "Core modules (SIS, Attendance, Fees)",
                  "5 pre-built workflows",
                  "Email support",
                  "Basic analytics",
                ],
                cta: "Start Free Trial",
                popular: false,
                color: "#00d4ff",
              },
              {
                name: "Growth",
                price: "$299",
                priceINR: "₹24,999",
                period: "/month",
                desc: "For growing schools that want AI superpowers",
                features: [
                  "Up to 1,500 students",
                  "All AI features (report cards, at-risk detection)",
                  "WhatsApp integration",
                  "Unlimited custom workflows",
                  "Priority support",
                  "Fee prediction AI",
                ],
                cta: "Start Free Trial",
                popular: true,
                color: "#7c3aed",
              },
              {
                name: "Enterprise",
                price: "$799",
                priceINR: "₹66,999",
                period: "/month",
                desc: "For large schools and multi-campus institutions",
                features: [
                  "Unlimited students",
                  "Custom workflow development",
                  "Dedicated Customer Success Manager",
                  "99.9% SLA guarantee",
                  "Custom integrations (ERP, Tally, etc.)",
                  "On-premise option available",
                ],
                cta: "Talk to Sales",
                popular: false,
                color: "#f59e0b",
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl p-8 relative card-hover"
                style={{
                  backgroundColor: plan.popular ? "rgba(124,58,237,0.15)" : "rgba(13,10,46,0.6)",
                  border: plan.popular ? "2px solid rgba(124,58,237,0.6)" : "1px solid #1e1b4b",
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #00d4ff)" }}>
                      <Star className="w-3 h-3" /> Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black" style={{ color: plan.color }}>{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{plan.priceINR}/month billed in INR</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className="block w-full py-3 rounded-xl text-center font-bold text-sm transition-all hover:scale-105"
                  style={
                    plan.popular
                      ? { background: "linear-gradient(135deg, #7c3aed, #00d4ff)", color: "white" }
                      : { backgroundColor: `${plan.color}20`, border: `1px solid ${plan.color}40`, color: plan.color }
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-3xl p-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.1), rgba(124,58,237,0.15), rgba(245,158,11,0.1))", border: "1px solid rgba(124,58,237,0.3)" }}>
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #00d4ff 1px, transparent 0)", backgroundSize: "40px 40px" }} />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-6">
                {["IIT Alumni School", "Delhi Public School", "Greenwood Academy", "St. Xavier's College"].map((school) => (
                  <span key={school} className="hidden sm:block px-3 py-1 rounded-full text-xs text-gray-400" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {school}
                  </span>
                ))}
              </div>
              <p className="text-sm text-neural-cyan font-semibold mb-4 tracking-wider uppercase">Trusted by forward-thinking schools</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Start Your Free<br /><span className="gradient-text">30-Day Trial</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                No credit card required. Full access to all features. Onboarding support included. See why modern schools choose EduFlow.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-bold text-white transition-all hover:scale-105 neural-glow-cyan"
                style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)" }}
              >
                Try Demo Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neural-border py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)" }}>
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">EduFlow by IntelliForge AI</div>
              <div className="text-xs text-gray-500">#BuildwithAiGiri MVP #15</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/dashboard" className="hover:text-neural-cyan transition-colors">Dashboard</Link>
            <Link href="/workflows" className="hover:text-neural-cyan transition-colors">Workflows</Link>
            <span>© 2026 IntelliForge AI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <TrendingUp className="w-3 h-3" />
            <span>Built with Gemini 2.0 Flash + Claude 3 Haiku</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
