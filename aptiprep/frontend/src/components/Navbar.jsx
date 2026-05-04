// components/Navbar.jsx — Glassmorphism sticky navbar
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Home",     to: "/" },
  { label: "Learn",    to: "/topic/percentages" },
  { label: "Practice", to: "/practice" },
  { label: "Quiz",     to: "/quiz" },
  { label: "Progress", to: "/progress" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(15,23,42,0.85)" : "rgba(15,23,42,0.60)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">

        {/* ── Logo: changed to "Aptitude" ── */}
        <NavLink to="/" className="flex items-center gap-2.5 no-underline group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #6366f1, #38bdf8)",
              boxShadow: "0 0 14px rgba(99,102,241,0.5)",
            }}
          >
            A
          </div>
          <span
            className="font-semibold text-base tracking-tight gradient-text"
            style={{ fontFamily: "Poppins" }}
          >
            Aptitude
          </span>
        </NavLink>

        {/* Desktop nav */}
        <ul className="hidden sm:flex items-center gap-1 list-none m-0 p-0">
          {NAV_ITEMS.map(({ label, to }) => (
            <li key={label}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `text-sm px-3.5 py-1.5 rounded-lg transition-all duration-200 no-underline font-medium ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        background: "rgba(99,102,241,0.15)",
                        border: "1px solid rgba(99,102,241,0.25)",
                        color: "#a5b4fc",
                      }
                    : {}
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-lg transition-colors hover:bg-white/5"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block h-px w-5 bg-slate-400 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`block h-px w-5 bg-slate-400 transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block h-px w-5 bg-slate-400 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-64" : "max-h-0"}`}
        style={{ borderTop: menuOpen ? "1px solid rgba(255,255,255,0.06)" : "none" }}
      >
        <div className="px-5 py-3 flex flex-col gap-1">
          {NAV_ITEMS.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm px-3 py-2 rounded-lg no-underline transition-colors font-medium ${
                  isActive ? "text-primary-light bg-white/5" : "text-slate-400"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
