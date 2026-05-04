// pages/Practice.jsx — Topic-wise practice questions
import React, { useState } from "react";
import { TOPICS } from "../data/topicsData";
import QuestionItem from "../components/QuestionItem";

export default function Practice() {
  const [selectedSlug, setSelectedSlug] = useState(TOPICS[0].slug);

  const topic = TOPICS.find((t) => t.slug === selectedSlug);

  return (
    <main className="max-w-3xl mx-auto px-5 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <span className="section-label glow-dot">Practice Mode</span>
        <h1 className="text-2xl font-bold text-white mt-2 mb-1" style={{ letterSpacing: "-0.01em" }}>
          Practice Questions
        </h1>
        <p className="text-slate-400 text-sm">Select a topic and work through the questions at your own pace.</p>
      </div>

      {/* Topic selector */}
      <div
        className="glass p-5 mb-6 animate-fade-up-d1"
        style={{ border: "1px solid rgba(99,102,241,0.15)" }}
      >
        <label className="section-label block mb-3">Select Topic</label>
        <select
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          className="input-dark select"
          style={{ maxWidth: "360px" }}
        >
          {TOPICS.map((t) => (
            <option key={t.slug} value={t.slug} style={{ background: "#0f172a" }}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5 animate-fade-in">
        <span className="text-xs font-mono text-slate-500">
          {topic?.questions.length || 0} question{topic?.questions.length !== 1 ? "s" : ""}
        </span>
        <hr className="divider flex-1" />
      </div>

      {/* Questions */}
      {topic?.questions.length > 0 ? (
        <div className="space-y-3">
          {topic.questions.map((q, i) => (
            <QuestionItem key={q.id || i} question={q} index={i} />
          ))}
        </div>
      ) : (
        <div className="glass p-8 text-center">
          <p className="text-slate-500 text-sm">No questions available for this topic.</p>
        </div>
      )}

      <div className="h-16" />
    </main>
  );
}
