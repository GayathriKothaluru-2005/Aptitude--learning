// pages/PracticeHome.jsx
// Landing page for /practice — shows all topics so user can pick one.
// Clicking a topic navigates to /practice/:topicSlug (AI MCQ page).

import React from "react";
import { useNavigate } from "react-router-dom";

const TOPICS = [
  // ── Arithmetic ──────────────────────────────────────────────
  { slug: "percentages",            name: "Percentages",              category: "Arithmetic",        icon: "%" },
  { slug: "profit-and-loss",        name: "Profit and Loss",          category: "Arithmetic",        icon: "₹" },
  { slug: "simple-interest",        name: "Simple Interest",          category: "Arithmetic",        icon: "SI" },
  { slug: "compound-interest",      name: "Compound Interest",        category: "Arithmetic",        icon: "CI" },
  { slug: "ratios-and-proportions", name: "Ratios & Proportions",     category: "Arithmetic",        icon: "∶" },
  { slug: "discounts",              name: "Discounts",                category: "Arithmetic",        icon: "🏷" },
  { slug: "averages",               name: "Averages",                 category: "Arithmetic",        icon: "x̄" },
  { slug: "mixture-and-alligation", name: "Mixture & Alligation",     category: "Arithmetic",       icon: "⚗" },

  // ── Number Theory ────────────────────────────────────────────
  { slug: "number-systems",         name: "Number Systems",           category: "Number Theory",     icon: "N" },
  { slug: "hcf-and-lcm",           name: "HCF & LCM",               category: "Number Theory",     icon: "∩" },

  // ── Algebra & Geometry ───────────────────────────────────────
  { slug: "algebra",                name: "Algebra",                  category: "Algebra & Geometry", icon: "x²" },
  { slug: "geometry",               name: "Geometry",                 category: "Algebra & Geometry", icon: "△" },
  { slug: "areas",                  name: "Areas",                    category: "Algebra & Geometry", icon: "▭" },

  // ── Probability & Combinatorics ──────────────────────────────
  { slug: "permutations-and-combinations", name: "Permutations & Combinations", category: "P&C / Probability", icon: "nCr" },
  { slug: "probability",            name: "Probability",              category: "P&C / Probability", icon: "P" },

  // ── Work & Speed ─────────────────────────────────────────────
  { slug: "time-and-work",          name: "Time and Work",            category: "Work & Speed",      icon: "⚙" },
  { slug: "time-speed-distance",    name: "Time, Speed & Distance",   category: "Work & Speed",      icon: "→" },
  { slug: "pipes-and-cisterns",     name: "Pipes & Cisterns",         category: "Work & Speed",      icon: "🚰" },
];

const CATEGORY_COLORS = {
  "Arithmetic":          { bg: "rgba(99,102,241,0.10)",  border: "rgba(99,102,241,0.22)",  text: "#818cf8" },
  "Work & Speed":        { bg: "rgba(56,189,248,0.10)",  border: "rgba(56,189,248,0.22)",  text: "#38bdf8" },
  "Number Theory":       { bg: "rgba(251,146,60,0.10)",  border: "rgba(251,146,60,0.22)",  text: "#fb923c" },
  "Algebra & Geometry":  { bg: "rgba(52,211,153,0.10)",  border: "rgba(52,211,153,0.22)",  text: "#34d399" },
  "P&C / Probability":   { bg: "rgba(244,114,182,0.10)", border: "rgba(244,114,182,0.22)", text: "#f472b4" },
};

// Group topics by category for rendering
const CATEGORY_ORDER = [
  "Arithmetic",
  "Number Theory",
  "Algebra & Geometry",
  "P&C / Probability",
  "Work & Speed",
];

export default function PracticeHome() {
  const navigate = useNavigate();

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    topics: TOPICS.filter((t) => t.category === cat),
  }));

  return (
    <main className="max-w-4xl mx-auto px-5 py-10">

      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <span className="section-label" style={{ color: "#38bdf8" }}>
          ⚡ AI Practice
        </span>
        <h1
          className="text-2xl font-bold text-white mt-2 mb-2"
          style={{ letterSpacing: "-0.01em" }}
        >
          Choose a Topic to Practice
        </h1>
        <p className="text-slate-400 text-sm max-w-lg">
          Select any topic below. We'll generate 5 fresh AI-powered MCQ questions
          just for you — instantly.
        </p>
      </div>

      {/* Topics grouped by category */}
      <div className="space-y-8 animate-fade-up-d1">
        {grouped.map(({ category, topics }) => {
          const colors = CATEGORY_COLORS[category];
          return (
            <div key={category}>
              {/* Category header */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                  style={{
                    background: colors.bg,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    fontFamily: "JetBrains Mono, monospace",
                    letterSpacing: "0.04em",
                  }}
                >
                  {category}
                </span>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
              </div>

              {/* Topic grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topics.map((topic) => {
                  return (
                    <button
                      key={topic.slug}
                      onClick={() => navigate(`/practice/${topic.slug}`)}
                      className="group text-left w-full transition-all duration-200"
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                      onMouseEnter={(e) => {
                        const card = e.currentTarget.querySelector(".card");
                        card.style.borderColor = colors.border;
                        card.style.background  = "rgba(255,255,255,0.07)";
                        card.style.transform   = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        const card = e.currentTarget.querySelector(".card");
                        card.style.borderColor = "rgba(255,255,255,0.07)";
                        card.style.background  = "rgba(255,255,255,0.03)";
                        card.style.transform   = "none";
                      }}
                    >
                      <div
                        className="card flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200"
                        style={{
                          background:   "rgba(255,255,255,0.03)",
                          border:       "1px solid rgba(255,255,255,0.07)",
                          borderRadius: "14px",
                        }}
                      >
                        {/* Icon */}
                        <div
                          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-mono"
                          style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                        >
                          {topic.icon}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-200 mb-0.5">
                            {topic.name}
                          </p>
                          <p className="text-xs" style={{ color: colors.text }}>
                            {topic.category}
                          </p>
                        </div>

                        {/* Arrow */}
                        <span className="shrink-0 text-slate-600 group-hover:text-primary transition-colors text-sm">
                          →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info note */}
      <div
        className="mt-10 px-5 py-4 rounded-2xl animate-fade-up"
        style={{
          background: "rgba(56,189,248,0.05)",
          border: "1px solid rgba(56,189,248,0.12)",
        }}
      >
        <p className="text-xs text-slate-400 leading-relaxed">
          <span style={{ color: "#38bdf8" }}>💡 How it works:</span> Each topic generates
          5 unique MCQ questions using AI. Questions are cached — clicking the same topic
          again loads instantly. Use <strong className="text-slate-300">New Questions</strong> on
          the practice page to regenerate.
        </p>
      </div>

      <div className="h-16" />
    </main>
  );
}
