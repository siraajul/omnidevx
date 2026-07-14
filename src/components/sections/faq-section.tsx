import React, { useEffect, useMemo, useRef, useState } from "react";

export default function FAQWithSpiral() {
  const spiralRef = useRef<HTMLDivElement | null>(null);

  // Spiral configuration - Brand Theme defaults
  const [cfg] = useState({
    points: 250,
    dotRadius: 2.2,
    duration: 3,
    color: "#2A6FDB", // Brand Blue
    gradient: "ocean" as
      | "none"
      | "rainbow"
      | "sunset"
      | "ocean"
      | "fire"
      | "neon"
      | "pastel"
      | "grayscale",
    pulseEffect: false,
    opacityMin: 0.1,
    opacityMax: 0.8,
    sizeMin: 0.5,
    sizeMax: 1.4,
    background: "#FDFCF7", // Brand Background
  });

  // Gradient presets
  const gradients: Record<string, string[]> = useMemo(
    () => ({
      none: [],
      rainbow: ["#ff0000", "#ff9900", "#ffff00", "#00ff00", "#0099ff", "#6633ff"],
      sunset: ["#ff0000", "#ff9900", "#ffcc00"],
      ocean: ["#2A6FDB", "#06b6d4", "#38bdf8"], // Brand Blue to Cyan
      fire: ["#ff0000", "#ff6600", "#ffcc00"],
      neon: ["#ff00ff", "#00ffff", "#ffff00"],
      pastel: ["#ffcccc", "#ccffcc", "#ccccff"],
      grayscale: ["#000000", "#666666", "#cccccc"],
    }),
    []
  );

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

  // Blunt/Engineering FAQ copy
  const faqs = [
    {
      q: "What exactly do you build?",
      a: "We build enterprise-grade software and platforms. We handle the entire engineering lifecycle: architecture, UX/UI, backend infrastructure, and production deployment.",
    },
    {
      q: "How do you manage projects?",
      a: "No bloated project management or agile theater. We map the requirements, prototype rapidly, and push to staging on day one. You get direct access to our Slack and GitHub.",
    },
    {
      q: "What is your tech stack?",
      a: "We use boring, proven technologies. React/Next.js for the frontend, Node.js or Python for the backend, PostgreSQL for data, and strict CI/CD pipelines via GitHub Actions.",
    },
    {
      q: "Do we own the code?",
      a: "100%. You own every single line of code we push to your repository. There is no vendor lock-in or proprietary frameworks.",
    },
    {
      q: "How do you price projects?",
      a: "We evaluate the technical complexity and provide firm estimates. No endless hourly billing surprises. We lock in sprints and deliver checkpoints.",
    },
    {
      q: "Do you rescue legacy codebases?",
      a: "Yes. We audit your existing architecture, eliminate technical debt, set up proper monitoring, and take over the infrastructure under SLA.",
    },
  ];

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
      <div className="relative mx-auto max-w-4xl px-6 py-32 z-10">
        {/* Header */}
        <header className="mb-16 text-center pb-8 gap-6">
          <h2 className="text-4xl md:text-6xl font-display text-[#161616]">
            Frequently <span className="scribble-underline text-[#2A6FDB]">Asked</span>
          </h2>
          <p className="mt-6 text-xl text-[#444] max-w-2xl mx-auto">
            Everything you need to know about partnering with Omnidevx.
          </p>
        </header>

        {/* Content - 1 Column Accordion */}
        <div className="relative">
          <div className="flex flex-col gap-4">
            {faqs.map((item, i) => (
              <FAQItem key={item.q} q={item.q} a={item.a} index={i + 1} />
            ))}
          </div>
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
          <p className="text-base md:text-lg text-[#2A2A2A] leading-relaxed pr-12">{a}</p>
        </div>
      </div>
    </div>
  );
}
