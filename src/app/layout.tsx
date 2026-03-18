import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduFlow — AI School OS with Configurable Workflows",
  description:
    "The school management platform built for 2026. Configurable workflows, AI report cards, WhatsApp-first communication, and online fee collection.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#030014" }}>{children}</body>
    </html>
  );
}
