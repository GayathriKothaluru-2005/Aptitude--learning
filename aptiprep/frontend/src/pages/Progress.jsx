// pages/Progress.jsx — Beautiful learning dashboard
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getCompletedTopics, getQuizScores, clearProgress } from "../utils/progress";

const ALL_TOPICS = [
  { slug: "percentages",              name: "Percentages",           category: "Arithmetic" },
  { slug: "profit-and-loss",          name: "Profit & Loss",         category: "Arithmetic" },
  { slug: "simple-interest",          name: "Simple Interest",       category: "Arithmetic" },
  { slug: "compound-interest",        name: "Compound Interest",     category: "Arithmetic" },
  { slug: "averages",                 name: "Averages",              category: "Arithmetic" },
  { slug: "hcf-and-lcm",             name: "HCF and LCM",           category: "Arithmetic" },
  { slug: "discounts",                name: "Discounts",             category: "Arithmetic" },
  { slug: "mixture-and-alligation",   name: "Mixture & Alligation",  category: "Arithmetic" },
  { slug: "ratios-and-proportions",   name: "Ratios & Proportions",  category: "Arithmetic" },
  { slug: "number-systems",           name: "Number Systems",        category: "Algebra"    },
  { slug: "algebra",                  name: "Algebra",               category: "Algebra"    },
  { slug: "permutations-and-combinations", name: "Permutations & Combinations", category: "Algebra" },
  { slug: "probability",              name: "Probability",           category: "Algebra"    },
  { slug: "geometry",                 name: "Geometry",              category: "Geometry"   },
  { slug: "areas",                    name: "Areas",                 category: "Geometry"   },
  { slug: "time-and-work",            name: "Time & Work",           category: "Work & Speed" },
  { slug: "pipes-and-cisterns",       name: "Pipes & Cisterns",      category: "Work & Speed" },
  { slug: "time-speed-distance",      name: "Time, Speed & Distance", category: "Work & Speed" },
];

const CATEGORY_COLORS = {
  "Arithmetic":   "#6366f1",
  "Algebra":      "#8b5cf6",
  "Geometry":     "#38bdf8",
  "Work & Speed": "#10b981",
};

function CircleRing({ percent, size = 120, stroke = 8, color = "#6366f1", label, value }) {
  const safePct = isNaN(percent) || !isFinite(percent) ? 0 : Math.min(100, Math.max(0, percent));
  const [displayed, setDisplayed] = useState(0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayed / 100) * circumference;

  useEffect(() => {
    setDisplayed(0);
    if (safePct === 0) return;
    let start = null;
    const duration = 1000;
    const animate = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      setDisplayed(Math.round(safePct * (1 - Math.pow(1 - prog, 3))));
      if (prog < 1) requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [safePct]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          <circle
            cx={size/2} cy={size/2} r={radius}
            fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.05s linear", filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: 0 }}>
          <span className="font-bold text-white" style={{ fontSize: size * 0.18 }}>{value}</span>
          <span className="text-slate-500" style={{ fontSize: size * 0.1 }}>{displayed}%</span>
        </div>
      </div>
      <p className="text-xs text-slate-400 font-medium text-center">{label}</p>
    </div>
  );
}

function AnimatedNumber({ target, suffix = "" }) {
  const safeTarget = isNaN(target) ? 0 : target;
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (safeTarget === 0) { setVal(0); return; }
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / 800, 1);
      setVal(Math.round(safeTarget * (1 - Math.pow(1 - prog, 2))));
      if (prog < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [safeTarget]);
  return <>{val}{suffix}</>;
}

function Achievement({ icon, title, desc, unlocked }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200" style={{ background: unlocked ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${unlocked ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.05)"}`, opacity: unlocked ? 1 : 0.45 }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: unlocked ? "rgba(99,102,241,0.20)" : "rgba(255,255,255,0.04)", filter: unlocked ? "none" : "grayscale(1)" }}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-white">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      {unlocked && (
        <span className="ml-auto text-xs font-mono px-2 py-0.5 rounded-md shrink-0" style={{ background: "rgba(34,197,94,0.12)", color: "#86efac", border: "1px solid rgba(34,197,94,0.20)" }}>✓</span>
      )}
    </div>
  );
}

function ScoreBar({ pct, color }) {
  const safePct = isNaN(pct) ? 0 : pct;
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(safePct), 100);
    return () => clearTimeout(t);
  }, [safePct]);
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", flex: 1 }}>
      <div className="h-full rounded-full" style={{ width: `${width}%`, background: color, transition: "width 0.8s ease", boxShadow: `0 0 6px ${color}60` }} />
    </div>
  );
}

// ── Expandable history row with per-question breakdown ────────────────────────
function HistoryRow({ s, i }) {
  const [open, setOpen] = useState(false);

  // Safely extract primitives — never render raw objects
  const score = typeof s.score === "number" ? s.score : 0;
  const total = typeof s.total === "number" && s.total > 0 ? s.total : 1;
  const pct   = Math.round((score / total) * 100);
  const color = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
  const emoji = pct >= 80 ? "🏆" : pct >= 50 ? "📚" : "💪";

  const questions = Array.isArray(s.questions) ? s.questions : [];
  const answers   = Array.isArray(s.answers)   ? s.answers   : [];
  const hasDetail = questions.length > 0;

  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      {/* Summary row */}
      <div
        className="flex items-center gap-4 px-5 py-4"
        style={{ cursor: hasDetail ? "pointer" : "default" }}
        onClick={() => hasDetail && setOpen(o => !o)}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">{String(s.topic || "—")}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {s.date ? new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-20 hidden sm:block"><ScoreBar pct={pct} color={color} /></div>
          <div className="text-right">
            <p className="text-sm font-bold font-mono" style={{ color }}>{score}/{total}</p>
            <p className="text-xs font-mono" style={{ color }}>{pct}%</p>
          </div>
          {hasDetail && (
            <span style={{ fontSize: "0.65rem", color: "#475569", marginLeft: 4 }}>{open ? "▲" : "▼"}</span>
          )}
        </div>
      </div>

      {/* Expandable question breakdown */}
      {open && hasDetail && (
        <div style={{ padding: "0 20px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {questions.map((q, qi) => {
            // Guard: q must be an object with string fields
            if (!q || typeof q !== "object") return null;
            const questionText  = typeof q.question    === "string" ? q.question    : "";
            const correctAnswer = typeof q.answer      === "string" ? q.answer      : "";
            const explanation   = typeof q.explanation === "string" ? q.explanation : "";
            const userAnswer    = typeof answers[qi]   === "string" ? answers[qi]   : null;
            const isRight       = userAnswer === correctAnswer;
            const opts          = ["A", "B", "C", "D"];

            return (
              <div key={qi} style={{
                borderRadius: 10,
                border: `1px solid ${isRight ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)"}`,
                background: "rgba(255,255,255,0.02)",
                padding: "12px 14px",
              }}>
                {/* Question text + badge */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                  <span style={{
                    flexShrink: 0, width: 20, height: 20, borderRadius: 6,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.65rem", fontWeight: 700,
                    background: isRight ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                    color: isRight ? "#22c55e" : "#ef4444",
                  }}>
                    {isRight ? "✓" : "✗"}
                  </span>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.4, flex: 1 }}>
                    {`Q${qi + 1}. ${questionText}`}
                  </p>
                </div>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8, paddingLeft: 30 }}>
                  {Array.isArray(q.options) && q.options.map((opt, oi) => {
                    if (typeof opt !== "string") return null;
                    const letter     = opts[oi];
                    const isCorrect  = letter === correctAnswer;
                    const isUser     = letter === userAnswer;
                    const optColor   = isCorrect ? "#22c55e" : isUser && !isCorrect ? "#ef4444" : "#475569";
                    const optBg      = isCorrect ? "rgba(34,197,94,0.08)" : isUser && !isCorrect ? "rgba(239,68,68,0.08)" : "transparent";
                    return (
                      <div key={letter} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "4px 8px", borderRadius: 6, background: optBg,
                      }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: optColor, width: 14 }}>{letter}</span>
                        <span style={{ fontSize: "0.75rem", color: optColor }}>{opt}</span>
                        {isCorrect && <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "#22c55e" }}>✓ correct</span>}
                        {isUser && !isCorrect && <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "#ef4444" }}>✗ your ans</span>}
                      </div>
                    );
                  })}
                  {!userAnswer && (
                    <p style={{ margin: 0, fontSize: "0.7rem", color: "#475569", paddingLeft: 8 }}>Skipped</p>
                  )}
                </div>

                {/* Explanation */}
                {explanation && (
                  <div style={{ marginLeft: 30, padding: "8px 10px", borderRadius: 8, background: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.15)" }}>
                    <p style={{ margin: "0 0 2px", fontSize: "0.65rem", color: "#7dd3fc", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>💡 Explanation</p>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#bae6fd", lineHeight: 1.5 }}>{explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Progress() {
  const [completed,  setCompleted]  = useState(getCompletedTopics());
  const [quizScores, setQuizScores] = useState(getQuizScores());
  const [activeTab,  setActiveTab]  = useState("overview");

  const handleClear = () => {
    if (window.confirm("Clear all progress? This cannot be undone.")) {
      clearProgress();
      setCompleted([]);
      setQuizScores([]);
    }
  };

  const total        = ALL_TOPICS.length;
  const completedCnt = completed.length;
  const pctDone      = total > 0 ? Math.round((completedCnt / total) * 100) : 0;
  const quizTaken    = quizScores.length;

  const validScores  = quizScores.filter((q) => typeof q.total === "number" && q.total > 0 && !isNaN(q.score));
  const avgScore     = validScores.length > 0
    ? Math.round(validScores.reduce((s, q) => s + (q.score / q.total) * 100, 0) / validScores.length)
    : 0;
  const bestScore    = validScores.length > 0
    ? Math.max(...validScores.map((q) => Math.round((q.score / q.total) * 100)))
    : 0;
  const totalCorrect = validScores.reduce((s, q) => s + q.score, 0);

  const categories = [...new Set(ALL_TOPICS.map((t) => t.category))];
  const catStats   = categories.map((cat) => {
    const catTopics = ALL_TOPICS.filter((t) => t.category === cat);
    const done      = catTopics.filter((t) => completed.includes(t.slug)).length;
    return { cat, done, total: catTopics.length, pct: Math.round((done / catTopics.length) * 100) };
  });

  const achievements = [
    { icon: "🚀", title: "First Step",     desc: "Complete your first topic",    unlocked: completedCnt >= 1 },
    { icon: "🔥", title: "On Fire",        desc: "Complete 5 topics",            unlocked: completedCnt >= 5 },
    { icon: "⚡", title: "Half Way There", desc: "Complete 50% of all topics",   unlocked: pctDone >= 50 },
    { icon: "🏆", title: "Topic Master",   desc: "Complete all topics",          unlocked: completedCnt >= total },
    { icon: "🎯", title: "Quiz Starter",   desc: "Take your first quiz",         unlocked: quizTaken >= 1 },
    { icon: "💎", title: "Sharp Mind",     desc: "Score 80%+ on any quiz",       unlocked: bestScore >= 80 },
    { icon: "🌟", title: "Consistent",     desc: "Take 5 quizzes",               unlocked: quizTaken >= 5 },
    { icon: "👑", title: "Aptitude King",  desc: "Average score above 80%",      unlocked: avgScore >= 80 },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const getMotivation = () => {
    if (completedCnt === 0) return { msg: "Start your journey!", sub: "Pick any topic below to begin." };
    if (pctDone < 30)       return { msg: "Great start!", sub: "Keep going, you're building momentum." };
    if (pctDone < 60)       return { msg: "Making progress!", sub: "You're past the halfway mark almost." };
    if (pctDone < 90)       return { msg: "Almost there!", sub: "Just a few more topics to go." };
    return { msg: "Outstanding!", sub: "You've mastered the full syllabus." };
  };
  const { msg, sub } = getMotivation();

  const tabs = ["overview", "topics", "history"];

  return (
    <main className="max-w-4xl mx-auto px-5 py-10">

      <div className="mb-8 animate-fade-up">
        <span className="section-label" style={{ color: "#6366f1" }}>📊 Dashboard</span>
        <h1 className="text-2xl font-bold text-white mt-2 mb-1" style={{ letterSpacing: "-0.01em" }}>Your Progress</h1>
        <p className="text-slate-400 text-sm">{sub}</p>
      </div>

      <div className="glass p-5 mb-6 flex items-center gap-4 animate-fade-up" style={{ border: "1px solid rgba(99,102,241,0.20)", background: "rgba(99,102,241,0.06)" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
          {pctDone === 100 ? "👑" : pctDone >= 50 ? "🔥" : pctDone >= 1 ? "⚡" : "🚀"}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white text-sm">{msg}</p>
          <p className="text-xs text-slate-400 mt-0.5">{completedCnt} of {total} topics completed • {unlockedCount} of {achievements.length} achievements unlocked</p>
        </div>
        <div className="text-right shrink-0" style={{ color: "#6366f1" }}>
          <p className="text-3xl font-bold" style={{ lineHeight: 1 }}>{pctDone}%</p>
          <p className="text-xs text-slate-500 mt-0.5">done</p>
        </div>
      </div>

      <div className="glass p-6 mb-5 animate-fade-up-d1">
        <div className="flex items-center justify-around gap-4 flex-wrap">
          <CircleRing percent={pctDone}    color="#6366f1" label="Topics Done"    value={`${completedCnt}/${total}`} />
          <CircleRing percent={avgScore}   color="#38bdf8" label="Avg Quiz Score" value={quizTaken > 0 ? `${avgScore}%` : "—"} />
          <CircleRing percent={Math.round((unlockedCount / achievements.length) * 100)} color="#8b5cf6" label="Achievements" value={`${unlockedCount}/${achievements.length}`} />
          <CircleRing percent={bestScore}  color="#10b981" label="Best Score"     value={bestScore > 0 ? `${bestScore}%` : "—"} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 animate-fade-up-d1">
        {[
          { label: "Topics Done",     value: completedCnt,  color: "#6366f1", icon: "📚" },
          { label: "Quizzes Taken",   value: quizTaken,     color: "#38bdf8", icon: "🎯" },
          { label: "Correct Answers", value: totalCorrect,  color: "#10b981", icon: "✅" },
          { label: "Best Score",      value: bestScore,     color: "#f59e0b", icon: "🏆", suffix: "%" },
        ].map(({ label, value, color, icon, suffix = "" }) => (
          <div key={label} className="glass-md p-4 text-center" style={{ border: `1px solid ${color}20` }}>
            <p className="text-lg mb-1">{icon}</p>
            <p className="text-xl font-bold" style={{ color }}><AnimatedNumber target={value} suffix={suffix} /></p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 p-1 rounded-xl mb-5 animate-fade-up-d2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className="flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all duration-200" style={{ background: activeTab === tab ? "rgba(99,102,241,0.20)" : "transparent", color: activeTab === tab ? "#a5b4fc" : "#64748b", border: activeTab === tab ? "1px solid rgba(99,102,241,0.30)" : "1px solid transparent" }}>
            {tab === "overview" ? "📊 Overview" : tab === "topics" ? "📚 Topics" : "📝 History"}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-5 animate-fade-in">
          <div className="glass overflow-hidden">
            <div className="px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="section-label">Category Breakdown</p>
            </div>
            <div className="p-5 space-y-4">
              {catStats.map(({ cat, done, total: catTotal, pct }) => (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[cat] || "#6366f1" }} />
                      <span className="text-xs font-medium text-slate-300">{cat}</span>
                    </div>
                    <span className="text-xs font-mono" style={{ color: CATEGORY_COLORS[cat] || "#6366f1" }}>{done}/{catTotal}</span>
                  </div>
                  <ScoreBar pct={pct} color={CATEGORY_COLORS[cat] || "#6366f1"} />
                </div>
              ))}
            </div>
          </div>

          <div className="glass overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="section-label">Achievements</p>
              <span className="text-xs font-mono" style={{ color: "#475569" }}>{unlockedCount}/{achievements.length} unlocked</span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {achievements.map((a) => <Achievement key={a.title} {...a} />)}
            </div>
          </div>
        </div>
      )}

      {activeTab === "topics" && (
        <div className="glass overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="section-label">All Topics</p>
            <span className="text-xs font-mono" style={{ color: "#475569" }}>{completedCnt}/{total} completed</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ALL_TOPICS.map((t) => {
              const done  = completed.includes(t.slug);
              const color = CATEGORY_COLORS[t.category] || "#6366f1";
              return (
                <Link key={t.slug} to={`/topic/${t.slug}`} className="flex items-center gap-3 px-4 py-3 rounded-xl no-underline group transition-all duration-200" style={{ background: done ? `${color}10` : "rgba(255,255,255,0.02)", border: `1px solid ${done ? `${color}25` : "rgba(255,255,255,0.05)"}` }}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: done ? color : "rgba(255,255,255,0.15)", boxShadow: done ? `0 0 6px ${color}` : "none" }} />
                  <span className="text-sm font-medium flex-1" style={{ color: done ? "#e2e8f0" : "#64748b" }}>{t.name}</span>
                  {done ? <span className="text-xs font-mono" style={{ color }}>✓</span> : <span className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors">→</span>}
                </Link>
              );
            })}
          </div>
          {completedCnt === 0 && (
            <div className="px-5 pb-8 text-center">
              <p className="text-slate-500 text-sm mb-3">No topics completed yet.</p>
              <Link to="/" className="btn-primary text-xs no-underline" style={{ padding: "8px 20px", display: "inline-block" }}>Start Learning →</Link>
            </div>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="glass overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="section-label">Quiz History</p>
            <span className="text-xs font-mono" style={{ color: "#475569" }}>{quizTaken} taken</span>
          </div>
          {quizTaken === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-4xl mb-3">🎯</p>
              <p className="text-slate-400 text-sm mb-1">No practice sessions yet.</p>
              <p className="text-slate-600 text-xs mb-4">Take a quiz to see your scores here.</p>
              <Link to="/practice" className="btn-primary text-xs no-underline" style={{ padding: "8px 20px", display: "inline-block" }}>Start Practice →</Link>
            </div>
          ) : (
            <div>
              {[...quizScores].reverse().map((s, i) => (
                <HistoryRow key={i} s={s} i={i} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors no-underline">← Back to Home</Link>
        <button onClick={handleClear} className="text-xs text-slate-600 hover:text-red-400 transition-colors">Reset progress</button>
      </div>
      <div className="h-16" />
    </main>
  );
}
