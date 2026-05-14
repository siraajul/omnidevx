import React, { useEffect, useMemo, useRef, useState } from "react";

export default function FAQWithSpiral() {
  const spiralRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Spiral configuration - Light Theme defaults
  const [cfg] = useState({
    points: 700,
    dotRadius: 1.8,
    duration: 3,
    color: "#2563EB", // Blue-600
    gradient: "ocean" as
      | "none"
      | "rainbow"
      | "sunset"
      | "ocean"
      | "fire"
      | "neon"
      | "pastel"
      | "grayscale",
    pulseEffect: true,
    opacityMin: 0.1,
    opacityMax: 0.8,
    sizeMin: 0.5,
    sizeMax: 1.4,
    background: "#F9F9F7", // Light theme bg
  });

  // Gradient presets
  const gradients: Record<string, string[]> = useMemo(
    () => ({
      none: [],
      rainbow: ["#ff0000", "#ff9900", "#ffff00", "#00ff00", "#0099ff", "#6633ff"],
      sunset: ["#ff0000", "#ff9900", "#ffcc00"],
      ocean: ["#2563EB", "#06b6d4", "#38bdf8"], // Blue to Cyan
      fire: ["#ff0000", "#ff6600", "#ffcc00"],
      neon: ["#ff00ff", "#00ffff", "#ffff00"],
      pastel: ["#ffcccc", "#ccffcc", "#ccccff"],
      grayscale: ["#000000", "#666666", "#cccccc"],
    }),
    []
  );

  // Keyboard shortcuts removed as they were unused

  // Generate spiral SVG and mount
  useEffect(() => {
    if (!spiralRef.current) return;

    const SIZE = 560; // larger presence
    const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
    const N = cfg.points;
    const DOT = cfg.dotRadius;
    const CENTER = SIZE / 2;
    const PADDING = 4;
    const MAX_R = CENTER - PADDING - DOT;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", String(SIZE));
    svg.setAttribute("height", String(SIZE));
    svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);

    // Gradient
    if (cfg.gradient !== "none") {
      const defs = document.createElementNS(svgNS, "defs");
      const g = document.createElementNS(svgNS, "linearGradient");
      g.setAttribute("id", "spiralGradient");
      g.setAttribute("gradientUnits", "userSpaceOnUse");
      g.setAttribute("x1", "0%");
      g.setAttribute("y1", "0%");
      g.setAttribute("x2", "100%");
      g.setAttribute("y2", "100%");
      gradients[cfg.gradient].forEach((color, idx, arr) => {
        const stop = document.createElementNS(svgNS, "stop");
        stop.setAttribute("offset", `${(idx * 100) / (arr.length - 1)}%`);
        stop.setAttribute("stop-color", color);
        g.appendChild(stop);
      });
      defs.appendChild(g);
      svg.appendChild(defs);
    }

    for (let i = 0; i < N; i++) {
      const idx = i + 0.5;
      const frac = idx / N;
      const r = Math.sqrt(frac) * MAX_R;
      const theta = idx * GOLDEN_ANGLE;
      const x = CENTER + r * Math.cos(theta);
      const y = CENTER + r * Math.sin(theta);

      const c = document.createElementNS(svgNS, "circle");
      c.setAttribute("cx", x.toFixed(3));
      c.setAttribute("cy", y.toFixed(3));
      c.setAttribute("r", String(DOT));
      c.setAttribute("fill", cfg.gradient === "none" ? cfg.color : "url(#spiralGradient)");
      c.setAttribute("opacity", "0.6");

      if (cfg.pulseEffect) {
        const animR = document.createElementNS(svgNS, "animate");
        animR.setAttribute("attributeName", "r");
        animR.setAttribute("values", `${DOT * cfg.sizeMin};${DOT * cfg.sizeMax};${DOT * cfg.sizeMin}`);
        animR.setAttribute("dur", `${cfg.duration}s`);
        animR.setAttribute("begin", `${(frac * cfg.duration).toFixed(3)}s`);
        animR.setAttribute("repeatCount", "indefinite");
        animR.setAttribute("calcMode", "spline");
        animR.setAttribute("keySplines", "0.4 0 0.6 1;0.4 0 0.6 1");
        c.appendChild(animR);

        const animO = document.createElementNS(svgNS, "animate");
        animO.setAttribute("attributeName", "opacity");
        animO.setAttribute("values", `${cfg.opacityMin};${cfg.opacityMax};${cfg.opacityMin}`);
        animO.setAttribute("dur", `${cfg.duration}s`);
        animO.setAttribute("begin", `${(frac * cfg.duration).toFixed(3)}s`);
        animO.setAttribute("repeatCount", "indefinite");
        animO.setAttribute("calcMode", "spline");
        animO.setAttribute("keySplines", "0.4 0 0.6 1;0.4 0 0.6 1");
        c.appendChild(animO);
      }

      svg.appendChild(c);
    }

    spiralRef.current.innerHTML = "";
    spiralRef.current.appendChild(svg);
  }, [cfg, gradients]);

  // FAQ content (edit freely)
  const faqs = [
    {
      q: "What does your team do?",
      a: "We design and build digital products end‑to‑end: research, UX/UI, front‑end/back‑end, infrastructure, and release support.",
    },
    {
      q: "How is your workflow structured?",
      a: "Iteratively. Solution storyboards → quick prototypes → user testing → prioritization → production integration. Transparent at every stage.",
    },
    {
      q: "Which stack and tools do you use?",
      a: "TypeScript/React/Next.js, Node.js, Python, Postgres, Redis, Tailwind, Playwright, CI/CD on GitHub Actions. Deployment — containers and clouds.",
    },
    {
      q: "Can we see code or a demo?",
      a: "Yes. We prepare private demo environments, give repository access and supply documented examples.",
    },
    {
      q: "How do you estimate timelines and budgets?",
      a: "We evaluate MVPs by impact metrics — value/complexity. We provide T‑shirt sizing bounds, then lock sprints with checkpoints.",
    },
    {
      q: "Do you take over existing products?",
      a: "Yes. We audit, clean up architecture/CI, eliminate debts, set up monitoring and take over under SLA.",
    },
  ];

  const filtered = debouncedQuery
    ? faqs.filter(({ q, a }) => (q + a).toLowerCase().includes(debouncedQuery.toLowerCase()))
    : faqs;

  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden text-[#161616] border-t border-[#e8e5db]"
      style={{ backgroundColor: cfg.background }}
    >
      {/* Background Spiral */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40 [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,1),rgba(0,0,0,0.1)_60%,transparent_75%)]"
        style={{ mixBlendMode: "multiply" }}
      >
        <div ref={spiralRef} />
      </div>

      {/* Layout */}
      <div className="relative mx-auto max-w-5xl px-6 py-32 z-10">
        {/* Header */}
        <header className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between border-b border-[#e8e5db] pb-8 gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-display text-[#161616]">
              Frequently Asked
            </h2>
            <p className="mt-4 text-lg text-[#444]">
              Everything you need to know about partnering with Omnidevx.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions…"
              className="h-12 w-full md:w-64 rounded-xl border border-[#e8e5db] bg-white/80 backdrop-blur px-4 text-sm outline-none transition focus:border-[#2A6FDB] focus:ring-2 focus:ring-blue-100 shadow-sm text-[#161616]"
            />
          </div>
        </header>

        {/* Content */}
        <div className="relative">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filtered.map((item, i) => (
              <FAQItem key={item.q} q={item.q} a={item.a} index={i + 1} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-[#444] text-center py-12">No questions found matching "{query}"</p>
          )}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a, index }: { readonly q: string; readonly a: string; readonly index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#e8e5db] bg-white/70 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[#2A6FDB] hover:shadow-md">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <div className="flex items-baseline gap-4 pr-4">
          <span className="text-sm font-bold text-[#2A6FDB]/50">{String(index).padStart(2, "0")}</span>
          <h3 className="text-lg md:text-xl font-bold leading-tight text-[#161616]">{q}</h3>
        </div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 shrink-0 ${open ? 'bg-zinc-900 border-zinc-900 text-white rotate-180' : 'bg-white border-[#e8e5db] text-[#444] group-hover:border-[#2A6FDB] group-hover:text-[#2A6FDB]'}`}>
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={open ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path></svg>
        </div>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${open ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="text-base text-[#2A2A2A] leading-relaxed pr-12">{a}</p>
        </div>
      </div>
    </div>
  );
}
