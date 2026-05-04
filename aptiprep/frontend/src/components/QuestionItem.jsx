// components/QuestionItem.jsx — Styled MCQ with option buttons
import React, { useState } from "react";

export default function QuestionItem({ question, index }) {
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (letter) => {
    if (revealed) return;
    setSelected(letter);
    setRevealed(true);
  };

  return (
    <div
      className="glass-md p-5 animate-fade-up"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Question */}
      <p className="text-sm text-slate-200 mb-4 leading-relaxed">
        <span className="font-mono text-xs text-primary mr-2">Q{index + 1}.</span>
        {question.question}
      </p>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((opt) => {
          const letter = opt.charAt(0);
          const isAnswer  = letter === question.answer;
          const isSelected = letter === selected;

          let cls = "option-btn";
          if (revealed) {
            if (isAnswer)                        cls += " correct";
            else if (isSelected && !isAnswer)    cls += " wrong";
          } else if (isSelected) {
            cls += " selected";
          }

          return (
            <button
              key={letter}
              className={cls}
              onClick={() => handleSelect(letter)}
              disabled={revealed}
            >
              <span
                className="inline-block w-5 h-5 rounded-md text-center text-xs font-mono font-bold mr-2 leading-5"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "#64748b",
                }}
              >
                {letter}
              </span>
              {opt.slice(3)}
            </button>
          );
        })}
      </div>

      {/* Reveal / explanation */}
      {!revealed && selected === null && (
        <button
          onClick={() => setRevealed(true)}
          className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Show answer ↓
        </button>
      )}

      {revealed && (
        <div
          className="mt-4 p-3 rounded-xl"
          style={{
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.15)",
          }}
        >
          <p className="text-xs font-mono text-indigo-400 mb-1">
            Answer: <span className="text-emerald-400 font-bold">{question.answer}</span>
          </p>
          {question.explanation && (
            <p className="text-xs text-slate-400 leading-relaxed">{question.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
