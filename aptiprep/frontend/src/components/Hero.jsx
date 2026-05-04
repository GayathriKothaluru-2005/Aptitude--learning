// components/Hero.jsx — Futuristic hero section (stats row removed)
import React from "react";

export default function Hero({ searchQuery, onSearchChange }) {
  return (
    <section className="relative py-20 px-5 text-center overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 50% at 50% -5%, rgba(99,102,241,0.22) 0%, transparent 65%)",
        }}
      />

      {/* Badge */}
      <div className="relative animate-fade-up">
        <span className="badge badge-primary">
          <span style={{ fontSize: "0.6rem" }}>⚡</span>
          AI-Powered Learning
        </span>
      </div>

      {/* Headline */}
      <h1
        className="relative mt-5 text-4xl sm:text-5xl font-bold leading-tight animate-fade-up-d1"
        style={{ letterSpacing: "-0.02em" }}
      >
        Crack Aptitude{" "}
        <span className="gradient-text">Easily 🚀</span>
      </h1>

      {/* Subtitle */}
      <p className="relative mt-4 text-slate-400 text-base sm:text-lg max-w-lg mx-auto animate-fade-up-d2 font-light">
        Master formulas, shortcuts, and AI-generated practice questions for every aptitude topic.
      </p>

      {/* Search bar */}
      <div className="relative mt-8 max-w-md mx-auto animate-fade-up-d3">
        <div
          className="flex gap-2 p-1.5 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 0 0 1px rgba(99,102,241,0.10), 0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search topics…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input-dark pl-9"
              style={{ background: "transparent", border: "none", boxShadow: "none" }}
            />
          </div>
          <button className="btn-primary shrink-0" style={{ padding: "8px 20px" }}>
            Search
          </button>
        </div>
      </div>

      {/* ── Stats row removed ── */}
    </section>
  );
}
