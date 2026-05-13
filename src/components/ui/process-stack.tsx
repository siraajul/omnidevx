"use client";
import React, { useRef } from "react";
import MagnifiedBento from "./magnified-bento";
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
  step: { title: string; description: string; color: string };
  i: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

function ProcessCard({ step, i, progress, range, targetScale }: ProcessCardProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="h-screen flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="flex flex-col relative -top-[25%] w-[95%] md:w-[95%] max-w-[1400px] rounded-[2.5rem] origin-top"
      >
        <MagnifiedBento
          title={step.title}
          description={step.description}
          className="w-full !p-0"
        />
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
