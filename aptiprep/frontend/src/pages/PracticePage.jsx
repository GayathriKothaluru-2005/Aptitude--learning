// pages/PracticePage.jsx
// AI-powered MCQ practice. Route: /practice/:topicSlug
// Fetches 5 questions from POST /api/practice
// Fixes: removed locked logic, removed navigate import, clean score tracking

import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { usePractice } from "../hooks/usePractice";
import { saveQuizScore } from "../utils/progress";

const TOPIC_NAMES = {
  "percentages":            "Percentages",
  "profit-and-loss":        "Profit and Loss",
  "ratios-and-proportions": "Ratios and Proportions",
  "time-and-work":          "Time and Work",
  "simple-interest":        "Simple Interest",
  "compound-interest":      "Compound Interest",
  "time-speed-distance":    "Time, Speed & Distance",
};

// ── Loading skeleton ─────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="rounded-2xl"
          style={{
            height: 160,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        />
      ))}
    </div>
  );
}

// ── Single MCQ question ───────────────────────────────────────
// FIX: No "locked" prop — all questions answerable independently.
// FIX: onAnswer called once per question when revealed.
function MCQQuestion({ item, index, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (key) => {
    if (revealed) return;   // locked after checking
    setSelected(key);
  };

  const handleCheck = () => {
    if (!selected || revealed) return;
    setRevealed(true);
    onAnswer(selected === item.correctAnswer);
  };

  const handleReset = () => {
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div
      className="glass-md p-5 animate-fade-up"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Question */}
      <div className="flex items-start gap-3 mb-4">
        <span
          className="shrink-0 text-xs font-mono font-bold px-2 py-0.5 rounded-md mt-0.5"
          style={{
            background: "rgba(99,102,241,0.12)",
            color: "#a5b4fc",
            border: "1px solid rgba(99,102,241,0.20)",
          }}
        >
          Q{index + 1}
        </span>
        <p className="text-sm text-slate-200 font-medium leading-relaxed">
          {item.question}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2 mb-4 ml-8">
        {Object.entries(item.options).map(([key, value]) => {
          const isCorrect  = key === item.correctAnswer;
          const isSelected = key === selected;

          let bg     = "rgba(255,255,255,0.03)";
          let border = "rgba(255,255,255,0.07)";
          let color  = "#94a3b8";

          if (revealed) {
            if (isCorrect)       { bg = "rgba(52,211,153,0.12)"; border = "rgba(52,211,153,0.35)"; color = "#6ee7b7"; }
            else if (isSelected) { bg = "rgba(239,68,68,0.10)";  border = "rgba(239,68,68,0.30)";  color = "#fca5a5"; }
          } else if (isSelected) {
            bg = "rgba(99,102,241,0.16)"; border = "rgba(99,102,241,0.40)"; color = "#c7d2fe";
          }

          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              disabled={revealed}
              className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{ background: bg, border: `1px solid ${border}`, color, cursor: revealed ? "default" : "pointer" }}
            >
              <span
                className="shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-xs font-mono font-bold"
                style={{ background: "rgba(255,255,255,0.07)", color }}
              >
                {key}
              </span>
              <span className="leading-relaxed">{value}</span>
              {revealed && isCorrect  && <span className="ml-auto text-xs font-bold" style={{ color: "#6ee7b7" }}>✓ Correct</span>}
              {revealed && isSelected && !isCorrect && <span className="ml-auto text-xs font-bold" style={{ color: "#fca5a5" }}>✗ Wrong</span>}
            </button>
          );
        })}
      </div>

      {/* Action row */}
      <div className="ml-8 flex items-center gap-2">
        {!revealed ? (
          <button
            onClick={handleCheck}
            disabled={!selected}
            className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
            style={{
              background: selected ? "rgba(99,102,241,0.20)" : "rgba(255,255,255,0.04)",
              color:      selected ? "#a5b4fc" : "#475569",
              border:     selected ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.07)",
              cursor:     selected ? "pointer" : "not-allowed",
            }}
          >
            {selected ? "Check Answer" : "Select an option first"}
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#64748b",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
            }}
          >
            ↺ Try Again
          </button>
        )}
      </div>

      {/* Explanation */}
      {revealed && item.explanation && (
        <div
          className="ml-8 mt-3 px-4 py-3 rounded-xl text-xs text-slate-400 leading-relaxed animate-fade-in"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          💡 {item.explanation}
        </div>
      )}
    </div>
  );
}

// ── Score summary ─────────────────────────────────────────────
function ScoreSummary({ score, total, topicSlug, onRetry }) {
  const pct   = Math.round((score / total) * 100);
  const color = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
  const msg   = pct >= 80
    ? "🎉 Excellent work!"
    : pct >= 50
    ? "📚 Good effort, keep going!"
    : "💪 Review the topic and try again.";

  return (
    <div
      className="glass p-7 text-center mt-6 animate-fade-up"
      style={{ border: `1px solid ${color}30` }}
    >
      <p className="text-xs font-mono text-slate-500 mb-3 uppercase tracking-widest">
        Final Score
      </p>
      <p
        className="text-6xl font-bold mb-1"
        style={{ color, textShadow: `0 0 24px ${color}40` }}
      >
        {score}
        <span className="text-3xl text-slate-500">/{total}</span>
      </p>
      <p className="text-lg font-semibold mb-1" style={{ color }}>{pct}%</p>
      <p className="text-slate-400 text-sm mb-6">{msg}</p>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={onRetry}
          className="btn-ghost"
          style={{ fontSize: "0.8rem", padding: "9px 18px" }}
        >
          ↺ New Questions
        </button>
        <Link
          to={`/topic/${topicSlug}`}
          className="btn-primary no-underline"
          style={{ fontSize: "0.8rem", padding: "9px 18px", display: "inline-block" }}
        >
          ← Back to Learn
        </Link>
      </div>
    </div>
  );
}

// ── Main PracticePage ─────────────────────────────────────────
export default function PracticePage() {
  const { topicSlug } = useParams();
  const topicName     = TOPIC_NAMES[topicSlug] || topicSlug?.replace(/-/g, " ");

  const { fetchPracticeQuestions, clearCache, loading, error } = usePractice();

  const [questions,  setQuestions]  = useState([]);
  // answeredMap: { questionIndex: boolean } — tracks which questions are checked
  const [answeredMap, setAnsweredMap] = useState({});
  const [finished,    setFinished]    = useState(false);

  // Load questions on mount and when slug changes
  const loadQuestions = useCallback(async () => {
    if (!topicName) return;
    setQuestions([]);
    setAnsweredMap({});
    setFinished(false);
    const data = await fetchPracticeQuestions(topicName);
    if (data) setQuestions(data);
  }, [topicName]); // eslint-disable-line

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadQuestions();
  }, [topicSlug]); // eslint-disable-line

  // Called once per question when user clicks "Check Answer"
  const handleAnswer = useCallback((index, isCorrect) => {
    setAnsweredMap((prev) => {
      const updated = { ...prev, [index]: isCorrect };
      // Show score when all 5 are answered
      if (Object.keys(updated).length === questions.length) {
        const finalScore = Object.values(updated).filter(Boolean).length;
        saveQuizScore(topicName, topicSlug, finalScore, questions.length); // ✅ persist score
        setTimeout(() => setFinished(true), 500);
      }
      return updated;
    });
  }, [questions.length]);

  const handleRetry = () => {
    clearCache(topicName);
    loadQuestions();
  };

  const answeredCount = Object.keys(answeredMap).length;
  const score         = Object.values(answeredMap).filter(Boolean).length;

  return (
    <main className="max-w-3xl mx-auto px-5 py-10">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 animate-fade-in">
        <Link to="/" className="hover:text-slate-300 transition-colors no-underline">
          Home
        </Link>
        <span>/</span>
        <Link
          to={`/topic/${topicSlug}`}
          className="hover:text-slate-300 transition-colors no-underline"
        >
          {topicName}
        </Link>
        <span>/</span>
        <span className="text-slate-300">Practice</span>
      </div>

      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <span className="section-label" style={{ color: "#38bdf8" }}>
          ⚡ AI Practice
        </span>
        <h1
          className="text-2xl font-bold text-white mt-2 mb-1"
          style={{ letterSpacing: "-0.01em" }}
        >
          {topicName}
        </h1>
        <p className="text-slate-400 text-sm">
          5 AI-generated MCQ questions. Select an option, then click{" "}
          <em>Check Answer</em>.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-4 font-mono animate-pulse">
            ⚡ Generating questions with AI…
          </p>
          <Skeleton />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          className="glass p-6 text-center"
          style={{ border: "1px solid rgba(239,68,68,0.20)" }}
        >
          <p className="text-sm text-red-300 mb-2">Failed to generate questions</p>
          <p
            className="text-xs mb-5 px-3 py-2 rounded-lg inline-block"
            style={{ background: "rgba(239,68,68,0.08)", color: "#fca5a5" }}
          >
            {error}
          </p>
          <br />
          <button
            onClick={loadQuestions}
            className="btn-primary"
            style={{ fontSize: "0.8rem", padding: "8px 20px" }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Questions */}
      {!loading && !error && questions.length > 0 && (
        <>
          {/* Progress bar */}
          <div
            className="glass p-4 mb-6 animate-fade-in"
            style={{ border: "1px solid rgba(99,102,241,0.15)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-500">Progress</span>
              <span className="text-xs font-mono" style={{ color: "#6366f1" }}>
                {answeredCount} / {questions.length} answered
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* All 5 questions — all unlocked, answer in any order */}
          <div className="space-y-4">
            {questions.map((q, i) => (
              <MCQQuestion
                key={i}
                item={q}
                index={i}
                onAnswer={(isCorrect) => handleAnswer(i, isCorrect)}
              />
            ))}
          </div>

          {/* Score card — appears after all answered */}
          {finished && (
            <ScoreSummary
              score={score}
              total={questions.length}
              topicSlug={topicSlug}
              onRetry={handleRetry}
            />
          )}
        </>
      )}

      <div className="h-16" />
    </main>
  );
}
