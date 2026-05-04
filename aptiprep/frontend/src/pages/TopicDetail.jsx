// pages/TopicDetail.jsx — Full topic page with AI generation
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTopicBySlug } from "../data/topicsData";
import { useAI } from "../hooks/useAI";
import { markTopicComplete } from "../utils/progress";
import QuestionItem from "../components/QuestionItem";

function FormulaCard({ formula, index }) {
  return (
    <div
      className="flex items-start gap-3 p-3.5 rounded-xl"
      style={{
        background: "rgba(99,102,241,0.06)",
        border: "1px solid rgba(99,102,241,0.12)",
      }}
    >
      <span
        className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold"
        style={{ background: "rgba(99,102,241,0.20)", color: "#818cf8" }}
      >
        {index + 1}
      </span>
      <code className="text-sm text-slate-200 font-mono leading-relaxed break-all">
        {formula}
      </code>
    </div>
  );
}

function ShortcutRow({ shortcut, index }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
      <span
        className="shrink-0 text-xs mt-0.5"
        style={{ color: "#38bdf8" }}
      >
        ›
      </span>
      <p className="text-sm text-slate-300 leading-relaxed">{shortcut}</p>
    </div>
  );
}

export default function TopicDetail() {
  const { topicName } = useParams();
  const localTopic = getTopicBySlug(topicName);

  const [content, setContent] = useState(
    localTopic
      ? {
          explanation: localTopic.explanation,
          formulas:    localTopic.formulas,
          shortcuts:   localTopic.shortcuts,
          questions:   localTopic.questions,
        }
      : null
  );
  const [aiUsed, setAiUsed] = useState(false);

  const { generateTopicContent, loading, error } = useAI();

  useEffect(() => {
    if (localTopic) markTopicComplete(localTopic.slug);
  }, [localTopic]);

  const handleGenerate = async () => {
    const displayName = localTopic?.name || topicName;
   const aiData = await generateTopicContent(displayName);
if (aiData) {
  setContent({
    explanation: aiData.explanation,
    formulas:    aiData.formulas,
    shortcuts:   aiData.shortcuts,
    // backend returns "solvedExamples", page expects "questions"
    questions:   aiData.solvedExamples?.map((ex, i) => ({
      id:          i,
      question:    ex.question,
      options:     [],           // solved examples have no MCQ options
      answer:      ex.answer,
      explanation: ex.solution,
    })) ?? [],
  });
  setAiUsed(true);
}
  };

  if (!localTopic && !content) {
    return (
      <main className="max-w-3xl mx-auto px-5 py-12">
        <div className="glass p-8 text-center">
          <p className="text-slate-400 text-sm mb-3">Topic not found.</p>
          <Link to="/" className="btn-primary text-sm" style={{ display: "inline-block" }}>
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const displayName = localTopic?.name || topicName;

  return (
    <main className="max-w-3xl mx-auto px-5 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 animate-fade-in">
        <Link to="/" className="hover:text-slate-300 transition-colors no-underline">Home</Link>
        <span>/</span>
        <span className="text-slate-300">{displayName}</span>
        {aiUsed && <span className="badge badge-primary ml-2">⚡ AI</span>}
      </div>

      {/* Page title */}
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: "-0.01em" }}>
          {displayName}
        </h1>
        {localTopic && (
          <span className="section-label glow-dot">{localTopic.category}</span>
        )}
      </div>

      {content ? (
        <>
          {/* Explanation */}
          <section className="glass p-6 mb-5 animate-fade-up">
            <p className="section-label mb-3">Explanation</p>
            <p className="text-slate-300 text-sm leading-relaxed">{content.explanation}</p>
          </section>

          {/* Formulas */}
          <section className="glass p-6 mb-5 animate-fade-up-d1">
            <p className="section-label mb-4">Key Formulas</p>
            <div className="space-y-2.5">
              {content.formulas.map((f, i) => (
                <FormulaCard key={i} formula={f} index={i} />
              ))}
            </div>
          </section>

          {/* Shortcuts */}
          <section className="glass p-6 mb-5 animate-fade-up-d2">
            <p className="section-label mb-3">Shortcuts & Tips</p>
            <div>
              {content.shortcuts.map((s, i) => (
                <ShortcutRow key={i} shortcut={s} index={i} />
              ))}
            </div>
          </section>

          {/* Questions */}
          <section className="mb-5 animate-fade-up-d3">
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="section-label">Practice Questions</p>
              <span className="text-xs text-slate-500">
                {content.questions?.length ?? 0} questions — click to reveal
              </span>
            </div>
            <div className="space-y-3">
              {(content.questions ?? []).map((q, i) => (
                <QuestionItem key={q.id || i} question={q} index={i} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="glass p-8 text-center mb-5">
          <p className="text-slate-500 text-sm">No local data. Generate content with AI below.</p>
        </div>
      )}

      {/* AI Generate */}
      <div
        className="glass p-6 mt-6"
        style={{ border: "1px solid rgba(99,102,241,0.18)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium text-white mb-1">Generate with AI</p>
            <p className="text-xs text-slate-500">
              Powered by Gemini — richer explanations, more questions.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary shrink-0"
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span
                  className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                />
                Generating…
              </span>
            ) : (
              "⚡ Generate with AI"
            )}
          </button>
        </div>
        {error && (
          <p
            className="mt-3 text-xs px-3 py-2 rounded-lg"
            style={{ background: "rgba(239,68,68,0.10)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.20)" }}
          >
            Error: {error}
          </p>
        )}
      </div>

      <div className="mt-8">
        <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors no-underline">
          ← Back to all topics
        </Link>
      </div>
      <div className="h-16" />
    </main>
  );
}
