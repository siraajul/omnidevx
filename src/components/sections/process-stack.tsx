"use client";
import React, { useRef } from "react";
import { useTransform, motion, useScroll, type MotionValue } from "motion/react";

const PROCESS_STEPS = [
  {
    title: "1. Discovery & Strategy",
    description:
      "We dive deep into your business goals, target audience, and technical constraints to architect the perfect solution.",
    color: "#5196fd",
  },
  {
    title: "2. Design & Architecture",
    description:
      "Creating intuitive UX/UI designs and planning the scalable database schemas and API infrastructure.",
    color: "#8f89ff",
  },
  {
    title: "3. Agile Development",
    description:
      "Iterative coding sprints with continuous integration, ensuring transparent progress and rapid feedback loops.",
    color: "#ed649e",
  },
  {
    title: "4. Launch & Scale",
    description:
      "Deployment, performance monitoring via Datadog, and ongoing support to ensure maximum uptime.",
    color: "#fd521a",
  },
];

interface ProcessCardProps {
  readonly step: { readonly title: string; readonly description: string; readonly color: string };
  readonly i: number;
  readonly progress: MotionValue<number>;
  readonly range: [number, number];
  readonly targetScale: number;
}

function ProcessCardContent({ step, i }: Readonly<{ step: Readonly<{ title: string; description: string; color: string }>; i: number }>) {
  const cleanTitle = step.title.replace(/^\d+\.\s*/, '');
  
  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-[2.5rem] bg-white border border-zinc-200 p-8 md:p-16 flex flex-col justify-center overflow-hidden shadow-2xl transition-all duration-500 group">
      
      {/* Background Gradients using step.color */}
      <div 
        className="absolute -top-32 -right-32 w-96 h-96 opacity-10 blur-[80px] rounded-full transition-transform duration-1000 group-hover:scale-125" 
        style={{ backgroundColor: step.color }} 
      />
      <div 
        className="absolute -bottom-32 -left-32 w-96 h-96 opacity-10 blur-[80px] rounded-full transition-transform duration-1000 group-hover:scale-125" 
        style={{ backgroundColor: step.color }} 
      />
      
      {/* Number Watermark */}
      <div className="absolute -right-4 -bottom-10 text-[200px] md:text-[250px] font-black text-zinc-900/5 select-none pointer-events-none tracking-tighter">
        0{i + 1}
      </div>

      <div className="relative z-10 max-w-4xl">
        {/* Step Badge */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-200 shadow-sm mb-6 md:mb-8"
        >
          <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: step.color }}></div>
          <span className="text-sm font-bold tracking-widest text-zinc-600 uppercase">Phase 0{i + 1}</span>
        </div>

        <h3 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 mb-4 md:mb-6">
          {cleanTitle}
        </h3>
        <p className="text-lg md:text-2xl leading-relaxed text-zinc-500">
          {step.description}
        </p>
      </div>
    </div>
  );
}

function ProcessCard({ step, i, progress, range, targetScale }: ProcessCardProps) {
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      className="h-screen flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        } as any}
        className="flex flex-col relative -top-[15%] w-[95%] md:w-[90%] max-w-[1200px] rounded-[2.5rem] origin-top will-change-transform"
      >
        <ProcessCardContent step={step} i={i} />
      </motion.div>
    </div>
  );
}

export const ProcessStack = () => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={container} className="relative w-full">
      {PROCESS_STEPS.map((step, i) => {
        const targetScale = 1 - (PROCESS_STEPS.length - i) * 0.05;
        return (
          <ProcessCard
            key={step.title}
            step={step}
            i={i}
            progress={scrollYProgress}
            range={[i * 0.25, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </div>
  );
};
