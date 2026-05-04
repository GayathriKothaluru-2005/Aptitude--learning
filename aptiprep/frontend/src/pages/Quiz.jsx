// pages/Quiz.jsx — Submit + Previous flow, no mid-quiz feedback
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { saveQuizScore } from "../utils/progress";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const TOPICS = [
  "Percentages", "Profit & Loss", "Simple Interest", "Compound Interest",
  "Time & Work", "Time & Distance", "Ratio & Proportion", "Averages",
  "Mixtures & Alligation", "Number System", "HCF & LCM", "Pipes & Cisterns",
  "Permutation & Combination", "Probability", "Algebra", "Geometry", "Areas", "Boats & Streams",
];

const DIFFICULTY_LABELS = { 5: "Quick", 10: "Standard", 15: "Deep Dive" };

// Total time for the whole quiz (seconds)
const QUIZ_TOTAL_TIME = { 5: 4 * 60, 10: 8 * 60, 15: 13 * 60 };

function fmt(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function scoreGrade(pct) {
  if (pct >= 90) return { label: "Excellent!", color: "#22c55e", emoji: "🏆" };
  if (pct >= 70) return { label: "Great Job!", color: "#38bdf8", emoji: "🎯" };
  if (pct >= 50) return { label: "Good Effort", color: "#f59e0b", emoji: "👍" };
  return { label: "Keep Practicing", color: "#f87171", emoji: "📚" };
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width, y: -20,
      vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 3,
      color: ["#6366f1","#38bdf8","#22c55e","#f59e0b","#f472b6","#a78bfa"][Math.floor(Math.random()*6)],
      size: 6 + Math.random() * 8, rot: Math.random() * 360, rotV: (Math.random()-0.5)*5,
    }));
    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
        if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color; ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.restore();
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:100, opacity:0.7 }} />;
}

function Card({ children, delay = 0 }) {
  return (
    <div style={{ padding:"18px 20px", borderRadius:16, marginBottom:14, background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", animation:`fadeUp 0.4s ${delay}s ease both` }}>
      {children}
    </div>
  );
}
function Label({ children }) {
  return <p style={{ margin:0, fontSize:"0.75rem", color:"#64748b", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em" }}>{children}</p>;
}

// ── Setup Screen ──────────────────────────────────────────────────────────────
function SetupScreen({ onStart }) {
  const [topic, setTopic] = useState("");
  const [custom, setCustom] = useState("");
  const [count, setCount] = useState(10);
  const finalTopic = topic === "__custom__" ? custom.trim() : topic;

  return (
    <div style={{ maxWidth:560, margin:"0 auto", padding:"40px 20px" }}>
      <div style={{ marginBottom:36, animation:"fadeUp 0.4s ease both" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <div style={{ width:44, height:44, borderRadius:14, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:"0 8px 24px rgba(99,102,241,0.4)" }}>🎯</div>
          <div>
            <h1 style={{ margin:0, fontSize:"1.5rem", fontWeight:700, color:"#f8fafc", letterSpacing:"-0.02em" }}>Quiz Mode</h1>
            <p style={{ margin:0, fontSize:"0.78rem", color:"#64748b" }}>Test your aptitude skills</p>
          </div>
        </div>
        <div style={{ height:1, background:"linear-gradient(90deg,rgba(99,102,241,0.4),transparent)" }} />
      </div>

      <Card delay={0.05}>
        <Label>📚 Choose Topic</Label>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, marginTop:12 }}>
          {TOPICS.map(t => (
            <button key={t} onClick={() => setTopic(t)} style={{
              padding:"10px 12px", borderRadius:10, border:"1px solid", textAlign:"left",
              fontSize:"0.78rem", fontWeight:500, cursor:"pointer", transition:"all 0.15s",
              background: topic===t ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.03)",
              borderColor: topic===t ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.07)",
              color: topic===t ? "#a5b4fc" : "#94a3b8",
            }}>{t}</button>
          ))}
          <button onClick={() => setTopic("__custom__")} style={{
            padding:"10px 12px", borderRadius:10, border:"1px dashed", textAlign:"left",
            fontSize:"0.78rem", fontWeight:500, cursor:"pointer", gridColumn:"span 2", transition:"all 0.15s",
            background: topic==="__custom__" ? "rgba(56,189,248,0.1)" : "rgba(255,255,255,0.02)",
            borderColor: topic==="__custom__" ? "rgba(56,189,248,0.4)" : "rgba(255,255,255,0.07)",
            color: topic==="__custom__" ? "#38bdf8" : "#475569",
          }}>✏️ Custom topic…</button>
        </div>
        {topic === "__custom__" && (
          <input autoFocus placeholder="e.g. Logarithms, Data Interpretation…" value={custom}
            onChange={e => setCustom(e.target.value)}
            style={{ marginTop:10, width:"100%", padding:"10px 14px", borderRadius:10, border:"1px solid rgba(56,189,248,0.3)", background:"rgba(56,189,248,0.06)", color:"#e2e8f0", fontSize:"0.85rem", outline:"none", boxSizing:"border-box" }} />
        )}
      </Card>

      <Card delay={0.1}>
        <Label>⚡ Number of Questions</Label>
        <div style={{ display:"flex", gap:10, marginTop:12 }}>
          {Object.entries(DIFFICULTY_LABELS).map(([n, lbl]) => (
            <button key={n} onClick={() => setCount(Number(n))} style={{
              flex:1, padding:"12px 8px", borderRadius:12, border:"1px solid",
              cursor:"pointer", fontSize:"0.8rem", fontWeight:600, transition:"all 0.15s",
              background: count===Number(n) ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
              borderColor: count===Number(n) ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.07)",
              color: count===Number(n) ? "#a5b4fc" : "#64748b",
            }}>
              <div style={{ fontSize:"1.1rem", marginBottom:2 }}>{n}</div>
              <div style={{ fontWeight:400 }}>{lbl}</div>
            </button>
          ))}
        </div>
        {/* Show total quiz time, not per-question */}
        <p style={{ margin:"10px 0 0", fontSize:"0.72rem", color:"#475569" }}>
          ⏱ Total quiz time: <span style={{ color:"#a5b4fc", fontWeight:600 }}>{fmt(QUIZ_TOTAL_TIME[count])}</span> for all {count} questions
        </p>
      </Card>

      <button disabled={!finalTopic} onClick={() => onStart(finalTopic, count)} style={{
        width:"100%", padding:"15px", borderRadius:14, border:"none", cursor:"pointer",
        marginTop:8, fontSize:"0.95rem", fontWeight:700, letterSpacing:"0.02em", transition:"all 0.2s",
        background: finalTopic ? "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)" : "rgba(255,255,255,0.04)",
        color: finalTopic ? "#fff" : "#334155",
        boxShadow: finalTopic ? "0 8px 32px rgba(99,102,241,0.4)" : "none",
        animation:"fadeUp 0.5s 0.2s ease both",
      }}>
        {finalTopic ? `Start Quiz →` : "Select a topic to begin"}
      </button>
    </div>
  );
}

// ── Loading Screen ────────────────────────────────────────────────────────────
function LoadingScreen({ topic }) {
  const steps = ["Crafting questions…", "Varying difficulty…", "Adding explanations…", "Almost ready!"];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep(s => Math.min(s+1, steps.length-1)), 800);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ maxWidth:400, margin:"80px auto", textAlign:"center", padding:"0 20px" }}>
      <div style={{ width:72, height:72, borderRadius:20, margin:"0 auto 24px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, animation:"pulse 1.5s ease-in-out infinite", boxShadow:"0 12px 40px rgba(99,102,241,0.4)" }}>🎯</div>
      <h2 style={{ color:"#f8fafc", fontWeight:700, margin:"0 0 6px", fontSize:"1.2rem" }}>Generating Quiz</h2>
      <p style={{ color:"#64748b", fontSize:"0.85rem", margin:"0 0 28px" }}>on <span style={{ color:"#a5b4fc" }}>{topic}</span></p>
      <div style={{ height:4, borderRadius:4, background:"rgba(255,255,255,0.06)", marginBottom:16, overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:4, transition:"width 0.8s ease", width:`${((step+1)/steps.length)*100}%`, background:"linear-gradient(90deg,#6366f1,#8b5cf6)" }} />
      </div>
      <p style={{ color:"#94a3b8", fontSize:"0.8rem" }}>{steps[step]}</p>
    </div>
  );
}

// ── Sticky Overall Timer Bar ──────────────────────────────────────────────────
function TimerBar({ timeLeft, totalTime, qIndex, total }) {
  const pct = (timeLeft / totalTime) * 100;
  const color = pct > 40 ? "#6366f1" : pct > 20 ? "#f59e0b" : "#ef4444";
  const urgent = pct <= 20;

  return (
    <div style={{
      position:"sticky", top:0, zIndex:20,
      background:"rgba(10,14,26,0.92)", backdropFilter:"blur(12px)",
      borderBottom:"1px solid rgba(255,255,255,0.06)",
      padding:"10px 20px",
    }}>
      <div style={{ maxWidth:640, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
          {/* Question count */}
          <span style={{ fontSize:"0.75rem", color:"#64748b", fontWeight:600 }}>
            Question <span style={{ color:"#a5b4fc" }}>{qIndex + 1}</span> / {total}
          </span>

          {/* Overall countdown */}
          <div style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"5px 14px", borderRadius:20,
            border:`1.5px solid ${color}50`,
            background:`${color}12`,
            animation: urgent ? "pulse 0.9s ease-in-out infinite" : "none",
          }}>
            <span style={{ fontSize:"0.78rem" }}>⏱</span>
            <span style={{ fontSize:"0.92rem", fontWeight:800, fontFamily:"monospace", color, letterSpacing:"0.04em" }}>
              {fmt(timeLeft)}
            </span>
            <span style={{ fontSize:"0.65rem", color:"#475569" }}>left</span>
          </div>
        </div>

        {/* Two progress bars: time (top) and question progress (bottom) */}
        {/* Time bar */}
        <div style={{ height:2, borderRadius:2, background:"rgba(255,255,255,0.05)", marginBottom:4, overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:2, transition:"width 1s linear", width:`${pct}%`, background:`linear-gradient(90deg,${color},${color}99)` }} />
        </div>
        {/* Question progress bar */}
        <div style={{ height:2, borderRadius:2, background:"rgba(255,255,255,0.05)", overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:2, transition:"width 0.4s ease", width:`${((qIndex) / total) * 100}%`, background:"linear-gradient(90deg,#6366f1,#8b5cf6)" }} />
        </div>
      </div>
    </div>
  );
}

// ── Question Card (Submit + Previous, no mid-quiz feedback) ───────────────────
function QuestionCard({ q, index, total, onSubmit, onPrev, savedAnswer, canGoBack }) {
  const opts = ["A","B","C","D"];
  // local selection — only committed on Submit
  const [selected, setSelected] = useState(savedAnswer || null);

  // sync when navigating back to a previously answered question
  useEffect(() => {
    setSelected(savedAnswer || null);
  }, [index, savedAnswer]);

  return (
    <div style={{ maxWidth:640, margin:"0 auto", padding:"24px 20px", animation:"slideIn 0.3s ease both" }}>
      {/* Question */}
      <div style={{ padding:"20px 22px", borderRadius:16, marginBottom:20, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
        <p style={{ margin:0, color:"#e2e8f0", fontSize:"0.95rem", lineHeight:1.65, fontWeight:500 }}>{q.question}</p>
      </div>

      {/* Options — only highlight the selected choice, no correct/wrong colors */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {q.options.map((opt, i) => {
          const letter = opts[i];
          const isSelected = selected === letter;

          const bg     = isSelected ? "rgba(99,102,241,0.1)"  : "rgba(255,255,255,0.03)";
          const border = isSelected ? "rgba(99,102,241,0.4)"  : "rgba(255,255,255,0.07)";
          const color  = isSelected ? "#c7d2fe"               : "#e2e8f0";
          const pillBg = isSelected ? "rgba(99,102,241,0.2)"  : "rgba(255,255,255,0.05)";
          const pillCl = isSelected ? "#818cf8"               : "#e2e8f0";

          return (
            <button key={letter} onClick={() => setSelected(letter)} style={{
              display:"flex", alignItems:"center", gap:14, padding:"13px 16px", borderRadius:12,
              border:`1px solid ${border}`, background:bg,
              cursor:"pointer", textAlign:"left", transition:"all 0.2s", color,
            }}>
              <span style={{ flexShrink:0, width:28, height:28, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:700, background:pillBg, color:pillCl }}>{letter}</span>
              <span style={{ fontSize:"0.87rem", lineHeight:1.5 }}>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Action row: Previous + Submit */}
      <div style={{ display:"flex", gap:12, marginTop:24 }}>
        {/* Previous button — only shown when not on first question */}
        {canGoBack && (
          <button onClick={onPrev} style={{
            flex:"0 0 auto", padding:"12px 20px", borderRadius:12,
            border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)",
            color:"#b8babe", fontSize:"0.85rem", fontWeight:600, cursor:"pointer",
            transition:"all 0.18s",
          }}>
            ← Prev
          </button>
        )}

        <button
          disabled={!selected}
          onClick={() => selected && onSubmit(selected)}
          style={{
            flex:1, padding:"13px", borderRadius:12, border:"none",
            cursor: selected ? "pointer" : "not-allowed",
            fontSize:"0.9rem", fontWeight:700, letterSpacing:"0.02em", transition:"all 0.2s",
            background: selected
              ? "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)"
              : "rgba(255,255,255,0.04)",
            color: selected ? "#fff" : "#334155",
            boxShadow: selected ? "0 6px 20px rgba(99,102,241,0.35)" : "none",
          }}
        >
          {index === total - 1 ? "Submit & Finish →" : "Submit & Next →"}
        </button>
      </div>

      {/* Keyboard hint */}
      <p style={{ margin:"12px 0 0", fontSize:"0.68rem", color:"#a435b1", textAlign:"center" }}>
        Press A / B / C / D to select, Enter to submit
      </p>
    </div>
  );
}

// ── Result Screen ─────────────────────────────────────────────────────────────
function ResultScreen({ questions, answers, topic, timeTaken, totalTime, onRetry, onNew }) {
  const correct = questions.filter((q,i) => answers[i] === q.answer).length;
  const pct = Math.round((correct / questions.length) * 100);
  const grade = scoreGrade(pct);
  const showConfetti = pct >= 70;
  const [visible, setVisible] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState(null);

  const hasSaved = useRef(false);
useEffect(() => {
  if (hasSaved.current) return;
  hasSaved.current = true;
  const safeAnswers = Array.isArray(answers) ? answers : [];
  saveQuizScore(topic, correct, questions.length, questions, safeAnswers);
}, []); // eslint-disable-line

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{ maxWidth:580, margin:"0 auto", padding:"40px 20px" }}>
      {showConfetti && <Confetti />}

      {/* Score card */}
      <div style={{ textAlign:"center", padding:"36px 24px", borderRadius:20, marginBottom:20, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", animation:"fadeUp 0.5s ease both", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 50% 0%,${grade.color}15,transparent 65%)`, pointerEvents:"none" }} />
        <div style={{ fontSize:"2.5rem", marginBottom:12 }}>{grade.emoji}</div>
        <h2 style={{ margin:"0 0 4px", fontSize:"1.4rem", fontWeight:800, color:"#f8fafc" }}>{grade.label}</h2>
        <p style={{ margin:"0 0 24px", fontSize:"0.8rem", color:"#64748b" }}>{topic}</p>

        <div style={{ display:"inline-flex", alignItems:"baseline", gap:4, marginBottom:20 }}>
          <span style={{ fontSize:visible?"3.5rem":"0", fontWeight:800, color:grade.color, transition:"font-size 0.8s cubic-bezier(0.34,1.56,0.64,1)", lineHeight:1 }}>{pct}</span>
          <span style={{ fontSize:"1.2rem", color:"#475569", fontWeight:600 }}>%</span>
        </div>

        <div style={{ display:"flex", justifyContent:"center", gap:24, flexWrap:"wrap", marginBottom:20 }}>
          {[
            { lbl:"Correct",   val:correct,                    color:"#22c55e" },
            { lbl:"Wrong",     val:questions.length - correct, color:"#f87171" },
            { lbl:"Total",     val:questions.length,           color:"#94a3b8" },
            { lbl:"Time Used", val:fmt(timeTaken),             color:"#38bdf8" },
          ].map(s => (
            <div key={s.lbl} style={{ textAlign:"center" }}>
              <div style={{ fontSize:"1.3rem", fontWeight:700, color:s.color }}>{s.val}</div>
              <div style={{ fontSize:"0.68rem", color:"#475569", marginTop:2 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Time used bar */}
        <div style={{ textAlign:"left" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <span style={{ fontSize:"0.68rem", color:"#475569" }}>Time used</span>
            <span style={{ fontSize:"0.68rem", color:"#38bdf8", fontFamily:"monospace" }}>{fmt(timeTaken)} / {fmt(totalTime)}</span>
          </div>
          <div style={{ height:4, borderRadius:4, background:"rgba(255,255,255,0.06)" }}>
            <div style={{ height:"100%", borderRadius:4, width:`${Math.min((timeTaken/totalTime)*100,100)}%`, background:"linear-gradient(90deg,#38bdf8,#6366f1)", transition:"width 1s ease" }} />
          </div>
        </div>
      </div>

      {/* Review with expandable explanations */}
      <div style={{ marginBottom:20, animation:"fadeUp 0.5s 0.1s ease both" }}>
        <p style={{ fontSize:"0.75rem", color:"#475569", fontWeight:600, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.08em" }}>
          Review Answers
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {questions.map((q, i) => {
            const isRight = answers[i] === q.answer;
            const isOpen = expandedIdx === i;
            return (
              <div key={i} style={{ borderRadius:12, border:`1px solid ${isRight?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)"}`, background:"rgba(255,255,255,0.02)", overflow:"hidden" }}>
                <button onClick={() => setExpandedIdx(isOpen ? null : i)} style={{ width:"100%", display:"flex", alignItems:"flex-start", gap:12, padding:"12px 16px", background:"transparent", border:"none", cursor:"pointer", textAlign:"left" }}>
                  <span style={{ flexShrink:0, width:22, height:22, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem", fontWeight:700, background:isRight?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)", color:isRight?"#22c55e":"#ef4444", marginTop:1 }}>
                    {isRight ? "✓" : "✗"}
                  </span>
                  <div style={{ flex:1 }}>
                    <p style={{ margin:"0 0 4px", fontSize:"0.8rem", color:"#cbd5e1", lineHeight:1.4 }}>{q.question}</p>
                    {!isRight && (
                      <p style={{ margin:0, fontSize:"0.72rem", color:"#dee1e6" }}>
                        Your answer: <span style={{ color:"#f87171" }}>{answers[i] || "Skipped"}</span>
                        {" · "}Correct: <span style={{ color:"#22c55e" }}>{q.answer}</span>
                      </p>
                    )}
                  </div>
                  {q.explanation && <span style={{ fontSize:"0.65rem", color:"#e7eaef", flexShrink:0, marginTop:3 }}>{isOpen?"▲":"▼"} explain</span>}
                </button>
                {isOpen && q.explanation && (
                  <div style={{ margin:"0 16px 14px", padding:"12px 14px", borderRadius:10, background:"rgba(56,189,248,0.07)", border:"1px solid rgba(56,189,248,0.15)", animation:"fadeUp 0.2s ease both" }}>
                    <p style={{ margin:"0 0 3px", fontSize:"0.68rem", color:"#7dd3fc", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>💡 Explanation</p>
                    <p style={{ margin:0, fontSize:"0.8rem", color:"#bae6fd", lineHeight:1.6 }}>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom:12, textAlign:"center" }}>
        <Link to="/progress" style={{ fontSize:"0.78rem", color:"#6366f1", textDecoration:"none", fontWeight:600 }}>📊 View Progress Dashboard →</Link>
      </div>

      <div style={{ display:"flex", gap:12, animation:"fadeUp 0.5s 0.2s ease both" }}>
        <button onClick={onRetry} style={{ flex:1, padding:"13px", borderRadius:12, border:"1px solid rgba(99,102,241,0.3)", background:"rgba(99,102,241,0.1)", color:"#a5b4fc", fontSize:"0.85rem", fontWeight:600, cursor:"pointer" }}>🔄 Retry Same</button>
        <button onClick={onNew} style={{ flex:1, padding:"13px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", fontSize:"0.85rem", fontWeight:600, cursor:"pointer", boxShadow:"0 6px 20px rgba(99,102,241,0.35)" }}>✨ New Quiz</button>
      </div>
      <div style={{ marginTop:16, textAlign:"center" }}>
        <Link to="/" style={{ fontSize:"0.75rem", color:"#475569", textDecoration:"none" }}>← Back to topics</Link>
      </div>
    </div>
  );
}

function ErrorPanel({ msg, onBack }) {
  return (
    <div style={{ maxWidth:440, margin:"80px auto", textAlign:"center", padding:"0 20px" }}>
      <div style={{ fontSize:"2.5rem", marginBottom:16 }}>⚠️</div>
      <h3 style={{ color:"#f87171", margin:"0 0 8px", fontWeight:700 }}>Failed to generate quiz</h3>
      <p style={{ color:"#64748b", fontSize:"0.83rem", marginBottom:24 }}>{msg}</p>
      <button onClick={onBack} style={{ padding:"11px 28px", borderRadius:12, border:"1px solid rgba(239,68,68,0.3)", background:"rgba(239,68,68,0.08)", color:"#f87171", fontSize:"0.85rem", fontWeight:600, cursor:"pointer" }}>← Try Again</button>
    </div>
  );
}

// ── Main Quiz Component ───────────────────────────────────────────────────────
export default function Quiz() {
  const [phase, setPhase] = useState("setup");
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [quizTopic, setQuizTopic] = useState("");
  const [quizCount, setQuizCount] = useState(10);

  // ── Overall timer state ────────────────────────────────────────────────────
  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const timerRef = useRef(null);

  const stopTimer = () => clearInterval(timerRef.current);

  // Start the overall countdown once quiz begins
  useEffect(() => {
    if (phase !== "quiz") { stopTimer(); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          setPhase("result");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return stopTimer;
  }, [phase]); // eslint-disable-line

  // Capture timeTaken when moving to result
  useEffect(() => {
    if (phase === "result") {
      setTimeTaken(t => totalTime - timeLeft);
    }
  }, [phase]); // eslint-disable-line

  // Submit the current answer and advance (or finish)
  const handleSubmit = useCallback((chosenAnswer) => {
    const nextAnswers = [...answers];
    nextAnswers[qIndex] = chosenAnswer;
    setAnswers(nextAnswers);

    const nextIdx = qIndex + 1;
    if (nextIdx >= questions.length) {
      stopTimer();
      setPhase("result");
    } else {
      setQIndex(nextIdx);
    }
  }, [qIndex, questions.length, answers]);

  // Go back to previous question
  const handlePrev = useCallback(() => {
    if (qIndex > 0) setQIndex(qIndex - 1);
  }, [qIndex]);

  const startQuiz = async (topic, count) => {
    setQuizTopic(topic);
    setQuizCount(count);
    setPhase("loading");
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/quiz`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ topic, count }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.details || json.error || "Server error");

      const tt = QUIZ_TOTAL_TIME[count] || count * 50;
      setTotalTime(tt);
      setTimeLeft(tt);
      setTimeTaken(0);
      setQuestions(json.questions);
      setAnswers(Array(json.questions.length).fill(null));
      setQIndex(0);
      setPhase("quiz");
    } catch (err) {
      setError(err.message);
      setPhase("error");
    }
  };

  // Keyboard A/B/C/D selection is handled inside QuestionCard via local state.
  // Enter key submits when an option is already selected — handled below.
  // We pass a ref-based bridge so QuestionCard can expose its local selected state.
  const submitBridgeRef = useRef(null);

  useEffect(() => {
    if (phase !== "quiz") return;
    const handler = (e) => {
      if (e.key === "Enter" && submitBridgeRef.current) {
        submitBridgeRef.current();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase]);

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
      `}</style>

      {phase==="setup"   && <SetupScreen onStart={startQuiz} />}
      {phase==="loading" && <LoadingScreen topic={quizTopic} />}
      {phase==="error"   && <ErrorPanel msg={error} onBack={() => setPhase("setup")} />}

      {phase==="quiz" && questions[qIndex] && (
        <>
          <TimerBar
            timeLeft={timeLeft}
            totalTime={totalTime}
            qIndex={qIndex}
            total={questions.length}
          />
          <QuestionCardWithBridge
            key={qIndex}
            q={questions[qIndex]}
            index={qIndex}
            total={questions.length}
            onSubmit={handleSubmit}
            onPrev={handlePrev}
            savedAnswer={answers[qIndex]}
            canGoBack={qIndex > 0}
            submitBridgeRef={submitBridgeRef}
          />
        </>
      )}

      {phase==="result" && (
        <ResultScreen
          questions={questions}
          answers={answers}
          topic={quizTopic}
          timeTaken={timeTaken}
          totalTime={totalTime}
          onRetry={() => startQuiz(quizTopic, quizCount)}
          onNew={() => setPhase("setup")}
        />
      )}
    </>
  );
}

// Thin wrapper that exposes a submit bridge for the Enter-key handler
function QuestionCardWithBridge({ submitBridgeRef, onSubmit, savedAnswer, ...props }) {
  const opts = ["A","B","C","D"];
  const [selected, setSelected] = useState(savedAnswer || null);

  useEffect(() => {
    setSelected(savedAnswer || null);
  }, [props.index, savedAnswer]);

  // Wire the Enter-key bridge
  useEffect(() => {
    submitBridgeRef.current = () => { if (selected) onSubmit(selected); };
    return () => { submitBridgeRef.current = null; };
  }, [selected, onSubmit, submitBridgeRef]);

  // Keyboard A/B/C/D selection
  useEffect(() => {
    const handler = (e) => {
      const k = e.key.toUpperCase();
      if (opts.includes(k)) setSelected(k);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [props.index]);

  const q = props.q;

  return (
    <div style={{ maxWidth:640, margin:"0 auto", padding:"24px 20px", animation:"slideIn 0.3s ease both" }}>
      {/* Question */}
      <div style={{ padding:"20px 22px", borderRadius:16, marginBottom:20, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
        <p style={{ margin:0, color:"#e2e8f0", fontSize:"0.95rem", lineHeight:1.65, fontWeight:500 }}>{q.question}</p>
      </div>

      {/* Options */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {q.options.map((opt, i) => {
          const letter = opts[i];
          const isSelected = selected === letter;
          const bg     = isSelected ? "rgba(99,102,241,0.1)"  : "rgba(255,255,255,0.03)";
          const border = isSelected ? "rgba(99,102,241,0.4)"  : "rgba(255,255,255,0.07)";
          const color  = isSelected ? "#c7d2fe"               : "#94a3b8";
          const pillBg = isSelected ? "rgba(99,102,241,0.2)"  : "rgba(255,255,255,0.05)";
          const pillCl = isSelected ? "#818cf8"               : "#475569";

          return (
            <button key={letter} onClick={() => setSelected(letter)} style={{
              display:"flex", alignItems:"center", gap:14, padding:"13px 16px", borderRadius:12,
              border:`1px solid ${border}`, background:bg,
              cursor:"pointer", textAlign:"left", transition:"all 0.2s", color,
            }}>
              <span style={{ flexShrink:0, width:28, height:28, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:700, background:pillBg, color:pillCl }}>{letter}</span>
              <span style={{ fontSize:"0.87rem", lineHeight:1.5 }}>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Action row */}
      <div style={{ display:"flex", gap:12, marginTop:24 }}>
        {props.canGoBack && (
          <button onClick={props.onPrev} style={{
            flex:"0 0 auto", padding:"12px 20px", borderRadius:12,
            border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)",
            color:"#64748b", fontSize:"0.85rem", fontWeight:600, cursor:"pointer",
            transition:"all 0.18s",
          }}>
            ← Prev
          </button>
        )}

        <button
          disabled={!selected}
          onClick={() => selected && onSubmit(selected)}
          style={{
            flex:1, padding:"13px", borderRadius:12, border:"none",
            cursor: selected ? "pointer" : "not-allowed",
            fontSize:"0.9rem", fontWeight:700, letterSpacing:"0.02em", transition:"all 0.2s",
            background: selected
              ? "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)"
              : "rgba(255,255,255,0.04)",
            color: selected ? "#fff" : "#334155",
            boxShadow: selected ? "0 6px 20px rgba(99,102,241,0.35)" : "none",
          }}
        >
          {props.index === props.total - 1 ? "Submit & Finish →" : "Submit & Next →"}
        </button>
      </div>

      <p style={{ margin:"12px 0 0", fontSize:"0.68rem", color:"#2d3748", textAlign:"center" }}>
        A / B / C / D to select · Enter to submit
      </p>
    </div>
  );
}
