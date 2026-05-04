// pages/LearnPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLearn } from "../hooks/useLearn";
import { markTopicComplete, getCompletedTopics } from "../utils/progress";

const TOPIC_SLUGS = [
  "percentages","profit-and-loss","simple-interest","compound-interest",
  "averages","number-systems","permutations-and-combinations","algebra",
  "geometry","pipes-and-cisterns","areas","hcf-and-lcm","discounts",
  "mixture-and-alligation","ratio-and-proportion","time-speed-distance","time-and-work",
];

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[160, 120, 100, 200].map((h, i) => (
        <div key={i} className="rounded-2xl" style={{ height: h, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
      ))}
    </div>
  );
}

function Section({ label, icon, children, delay = 0 }) {
  return (
    <section className="glass animate-fade-up mb-5" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center gap-2.5 px-6 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ fontSize: "0.85rem" }}>{icon}</span>
        <span className="section-label">{label}</span>
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function ConceptSection({ explanation }) {
  return (
    <Section label="Concept" icon="📖" delay={0.05}>
      <p className="text-slate-300 text-sm leading-relaxed">{explanation}</p>
    </Section>
  );
}

function FormulasSection({ formulas }) {
  return (
    <Section label="Key Formulas" icon="📐" delay={0.10}>
      <div className="space-y-2.5">
        {formulas.map((formula, i) => (
          <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl" style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.14)" }}>
            <span className="shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-xs font-mono font-bold" style={{ background: "rgba(99,102,241,0.25)", color: "#818cf8" }}>{i + 1}</span>
            <code className="text-sm text-indigo-200 font-mono leading-relaxed">{formula}</code>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ShortcutsSection({ shortcuts }) {
  return (
    <Section label="Shortcuts & Tricks" icon="⚡" delay={0.15}>
      <ul className="list-none m-0 p-0">
        {shortcuts.map((tip, i) => (
          <li key={i} className="flex items-start gap-3 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span className="shrink-0 mt-0.5" style={{ color: "#38bdf8" }}>›</span>
            <p className="text-sm text-slate-300 leading-relaxed">{tip}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ExamplesSection({ examples }) {
  return (
    <Section label="Solved Examples" icon="✏️" delay={0.20}>
      <div className="space-y-7">
        {examples.map((ex, i) => (
          <div key={i}>
            <div className="flex items-start gap-3 mb-4">
              <span className="shrink-0 text-xs font-mono font-bold px-2 py-0.5 rounded-md mt-0.5" style={{ background: "rgba(56,189,248,0.12)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.20)" }}>Ex {i + 1}</span>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">{ex.question}</p>
            </div>
            <div className="ml-8 space-y-2 mb-3">
              {ex.steps.map((step, si) => (
                <div key={si} className="px-4 py-2.5 rounded-xl text-sm text-slate-300 leading-relaxed" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>{step}</div>
              ))}
            </div>
            <div className="ml-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.25)", color: "#6ee7b7" }}>
              ✅ Answer: {ex.answer}
            </div>
            {i < examples.length - 1 && <hr className="mt-6 border-t border-white/5" />}
          </div>
        ))}
      </div>
    </Section>
  );
}

function ErrorPanel({ message, onRetry }) {
  return (
    <div className="glass p-8 text-center" style={{ border: "1px solid rgba(239,68,68,0.20)" }}>
      <p className="text-sm text-red-300 mb-2">Failed to load topic content</p>
      <p className="text-xs mb-5 px-3 py-2 rounded-lg inline-block" style={{ background: "rgba(239,68,68,0.08)", color: "#fca5a5" }}>{message}</p>
      <br />
      <button onClick={onRetry} className="btn-primary" style={{ fontSize: "0.8rem", padding: "8px 20px" }}>Try Again</button>
    </div>
  );
}

function BottomBar({ slug, currentIndex, onNavigate, isDone, onMarkDone }) {
  const isFirst = currentIndex === 0;
  const isLast  = currentIndex === TOPIC_SLUGS.length - 1;

  const base = {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "9px 18px", borderRadius: "10px", border: "none",
    fontSize: "0.82rem", fontWeight: 500, fontFamily: "Poppins, sans-serif",
    cursor: "pointer", transition: "transform 0.15s ease",
  };
  const activeBtn    = { ...base, background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", boxShadow: "0 0 16px rgba(99,102,241,0.30)" };
  const disabledBtn  = { ...base, background: "rgba(255,255,255,0.03)", color: "#2d3748", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "none", cursor: "not-allowed" };
  const accentBtn    = { ...base, background: "linear-gradient(135deg, #0ea5e9, #38bdf8)", color: "#fff", boxShadow: "0 0 16px rgba(56,189,248,0.30)" };
  const doneBtn      = { ...base, background: "linear-gradient(135deg, #16a34a, #22c55e)", color: "#fff", boxShadow: "0 0 16px rgba(34,197,94,0.35)" };
  const completedBtn = { ...base, background: "rgba(34,197,94,0.10)", color: "#86efac", border: "1px solid rgba(34,197,94,0.25)", boxShadow: "none", cursor: "default", pointerEvents: "none" };

  return (
    <div className="mt-8 pt-6 space-y-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>

      {/* ── Mark as Done + Start Practice ── */}
      <div className="glass p-5 flex items-center justify-between gap-4 flex-wrap" style={{ border: "1px solid rgba(56,189,248,0.15)" }}>
        <div>
          <p className="text-sm font-semibold text-white mb-0.5">Ready to test yourself?</p>
          <p className="text-xs text-slate-400">5 AI-generated MCQ questions on this topic.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>

          {/* Mark as Done */}
          {isDone ? (
            <button style={completedBtn}>✓ Done</button>
          ) : (
            <button
              style={doneBtn}
              onClick={onMarkDone}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
            >
              ✓ Mark as Done
            </button>
          )}

          {/* Start Practice */}
          <button
            style={accentBtn}
            onClick={() => window.location.href = `/practice/${slug}`}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
          >
            Start Practice →
          </button>
        </div>
      </div>

      {/* Prev / Next */}
      {currentIndex !== -1 && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button
            disabled={isFirst}
            onClick={() => !isFirst && onNavigate(currentIndex - 1)}
            style={isFirst ? disabledBtn : activeBtn}
            onMouseEnter={(e) => { if (!isFirst) e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
          >
            ← Previous Topic
          </button>

          <span style={{ fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace", color: "#334155" }}>
            {currentIndex + 1} / {TOPIC_SLUGS.length}
          </span>

          {isLast ? (
            <span style={{ fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace", padding: "8px 14px", borderRadius: "10px", background: "rgba(34,197,94,0.08)", color: "#86efac", border: "1px solid rgba(34,197,94,0.18)" }}>
              ✓ All topics complete
            </span>
          ) : (
            <button
              onClick={() => onNavigate(currentIndex + 1)}
              style={activeBtn}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
            >
              Next Topic →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main LearnPage ────────────────────────────────────────────
export default function LearnPage() {
  const { topicSlug } = useParams();
  const navigate      = useNavigate();
  const currentIndex  = TOPIC_SLUGS.indexOf(topicSlug);

  const { fetchLearnContent, loading, error } = useLearn();
  const [content,  setContent]  = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const [isDone,   setIsDone]   = useState(false);
  const [toast,    setToast]    = useState(false);

  // Sync done state when slug changes
  useEffect(() => {
    setIsDone(getCompletedTopics().includes(topicSlug));
  }, [topicSlug]);

  useEffect(() => {
    if (!topicSlug) return;
    setContent(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchLearnContent(topicSlug).then((data) => {
      if (data) setContent(data);
    });
  }, [topicSlug, retryKey]); // eslint-disable-line

  const handleRetry    = () => setRetryKey((k) => k + 1);
  const handleNavigate = (index) => navigate(`/topic/${TOPIC_SLUGS[index]}`);

  const handleMarkDone = () => {
    markTopicComplete(topicSlug);
    setIsDone(true);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const displayName = content?.name || topicSlug?.replace(/-/g, " ");

  return (
    <main className="max-w-3xl mx-auto px-5 py-10">

      {/* Toast */}
      <div style={{
        position: "fixed", bottom: 28, left: "50%",
        transform: `translateX(-50%) translateY(${toast ? 0 : 80}px)`,
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        zIndex: 999,
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 20px", borderRadius: 14,
        background: "linear-gradient(135deg, rgba(34,197,94,0.18), rgba(16,185,129,0.12))",
        border: "1px solid rgba(34,197,94,0.35)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}>
        <span style={{ fontSize: 18 }}>✅</span>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#86efac" }}>
          {displayName} marked as complete!
        </span>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 animate-fade-in">
        <Link to="/" className="hover:text-slate-300 transition-colors no-underline">Home</Link>
        <span>/</span>
        <span className="text-slate-300 capitalize">{displayName}</span>
      </div>

      {/* Title */}
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: "-0.01em" }}>{displayName}</h1>
        {content?.category && (
          <span className="section-label" style={{ color: "#6366f1" }}>{content.category}</span>
        )}
      </div>

      {loading && <Skeleton />}
      {!loading && error && <ErrorPanel message={error} onRetry={handleRetry} />}

      {!loading && !error && content && (
        <>
          <ConceptSection   explanation={content.explanation} />
          <FormulasSection  formulas={content.formulas} />
          <ShortcutsSection shortcuts={content.shortcuts} />
          <ExamplesSection  examples={content.examples} />
          <BottomBar
            slug={topicSlug}
            currentIndex={currentIndex}
            onNavigate={handleNavigate}
            isDone={isDone}
            onMarkDone={handleMarkDone}
          />
        </>
      )}

      <div className="mt-6">
        <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors no-underline">
          ← Back to all topics
        </Link>
      </div>
      <div className="h-16" />
    </main>
  );
}