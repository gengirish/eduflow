import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { tool, data } = await req.json().catch(() => ({}));
  const geminiKey = process.env.GOOGLE_AI_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  let prompt = "";
  if (tool === "report-card") {
    const { studentName, marks } = data;
    prompt = `You are a school teacher writing report card comments. Write 3-4 personalised, encouraging sentences for ${studentName} based on these marks: ${marks}. Be specific, mention subjects by name, encourage improvement where needed. Keep it warm and professional.`;
  } else if (tool === "at-risk") {
    prompt = `Based on school data, identify 3 at-risk students and explain why. Format as JSON array: [{"name": "Student Name", "grade": "10A", "riskFactors": ["Low attendance (62%)", "Failing Math"], "recommendation": "Schedule parent meeting"}]`;
  } else if (tool === "fee-prediction") {
    prompt = `Predict fee payment likelihood for 5 students based on historical patterns. Format as JSON array: [{"name": "Student Name", "grade": "8B", "defaultProbability": 78, "reason": "2 late payments last quarter", "recommendation": "Send reminder now"}]`;
  }

  // Try Gemini first (primary - free)
  if (geminiKey && prompt) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      if (res.ok) {
        const d = await res.json();
        const text = d.candidates?.[0]?.content?.parts?.[0]?.text || "";
        return NextResponse.json({ result: text, source: "gemini" });
      }
    } catch {}
  }

  // Fallback: OpenRouter
  if (openrouterKey && prompt) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openrouterKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
        }),
      });
      const d = await res.json();
      return NextResponse.json({
        result: d.choices?.[0]?.message?.content || "",
        source: "openrouter",
      });
    } catch {}
  }

  // Mock fallbacks
  const mocks: Record<string, string> = {
    "report-card":
      "Arjun has shown remarkable dedication this term, particularly excelling in Mathematics and Science. His analytical thinking and problem-solving skills are commendable. While there is room for improvement in Written English, his enthusiasm and classroom participation have been outstanding. With continued effort, Arjun is well on his way to achieving excellent results.",
    "at-risk": JSON.stringify([
      {
        name: "Riya Sharma",
        grade: "9A",
        riskFactors: ["Attendance: 61%", "Failing in 3 subjects"],
        recommendation: "Immediate parent-teacher meeting",
      },
      {
        name: "Karan Mehta",
        grade: "8B",
        riskFactors: ["Attendance: 69%", "Fee overdue 45 days"],
        recommendation: "Counselor intervention + fee plan",
      },
      {
        name: "Ananya Singh",
        grade: "10C",
        riskFactors: ["Grade drop: 78% → 52%", "Recent family issue reported"],
        recommendation: "Pastoral care support",
      },
    ]),
    "fee-prediction": JSON.stringify([
      {
        name: "Vikram Patel",
        grade: "7A",
        defaultProbability: 82,
        reason: "3 late payments, last payment 60 days ago",
        recommendation: "Call parent today",
      },
      {
        name: "Sunita Rao",
        grade: "9B",
        defaultProbability: 67,
        reason: "Payment plan requested twice",
        recommendation: "Offer EMI option",
      },
      {
        name: "Arun Kumar",
        grade: "6C",
        defaultProbability: 45,
        reason: "One missed payment last quarter",
        recommendation: "Send WhatsApp reminder",
      },
      {
        name: "Deepa Nair",
        grade: "11A",
        defaultProbability: 23,
        reason: "Slightly delayed this month",
        recommendation: "Standard reminder",
      },
      {
        name: "Rohit Joshi",
        grade: "8A",
        defaultProbability: 12,
        reason: "Minor pattern variation",
        recommendation: "No action needed",
      },
    ]),
  };

  return NextResponse.json({ result: mocks[tool] || "Analysis complete.", source: "mock" });
}
