/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg:        "#0f172a",
        "bg-deep": "#080d1a",
        surface:   "rgba(255,255,255,0.04)",
        "surface-md": "rgba(255,255,255,0.07)",
        "surface-hi": "rgba(255,255,255,0.10)",
        border:    "rgba(255,255,255,0.08)",
        "border-hi":"rgba(99,102,241,0.45)",
        primary:   "#6366f1",
        "primary-light": "#818cf8",
        "primary-dark":  "#4f46e5",
        accent:    "#38bdf8",
        "accent-glow":   "#38bdf840",
        muted:     "#94a3b8",
        subtle:    "#1e293b",
        text:      "#e5e7eb",
        "text-dim":"#94a3b8",
      },
      fontFamily: {
        sans: ["'Poppins'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        xl:  "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
      boxShadow: {
        glow:       "0 0 20px rgba(99,102,241,0.35), 0 0 60px rgba(99,102,241,0.10)",
        "glow-accent":"0 0 20px rgba(56,189,248,0.40)",
        "glow-sm":  "0 0 10px rgba(99,102,241,0.25)",
        glass:      "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)",
        "hero-gradient":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.20) 0%, transparent 60%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(56,189,248,0.04) 100%)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pulse-glow": {
          "0%,100%": { boxShadow: "0 0 12px rgba(99,102,241,0.3)" },
          "50%":     { boxShadow: "0 0 28px rgba(99,102,241,0.6)" },
        },
      },
      animation: {
        "fade-up":    "fade-up 0.5s ease both",
        "fade-up-d1": "fade-up 0.5s 0.1s ease both",
        "fade-up-d2": "fade-up 0.5s 0.2s ease both",
        "fade-up-d3": "fade-up 0.5s 0.3s ease both",
        "fade-in":    "fade-in 0.4s ease both",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
