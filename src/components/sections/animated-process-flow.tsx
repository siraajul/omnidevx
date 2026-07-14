"use client";

import React, { useRef } from "react";
import { motion, useScroll } from "motion/react";
import { 
  Terminal, TestTube, GitMerge, Activity, 
  Lightbulb, Code, Rocket, BarChart, 
  Database, Brain, MessageSquare, 
  Smartphone, Layers, UploadCloud,
  LayoutTemplate, Server, Gauge
} from "lucide-react";

export type ServiceType = "web" | "mobile" | "ai" | "genai" | "devops" | "standard";

const PROCESS_DATA = {
  devops: {
    colorHex: "#ea580c", // orange-600
    colorClass: "text-orange-600",
    borderClass: "group-hover:border-orange-500",
    bgHoverClass: "bg-orange-500/10",
    labelClass: "text-orange-600",
    steps: [
      { id: 1, title: "Infrastructure as Code", description: "We provision environments using Terraform and Docker, eliminating 'it works on my machine' issues entirely.", icon: Terminal },
      { id: 2, title: "Automated Testing (SQA)", description: "We write comprehensive unit, integration, and end-to-end testing suites using Playwright to catch regressions before they ship.", icon: TestTube },
      { id: 3, title: "CI/CD Pipelines", description: "GitHub Actions automatically run tests, build the code, and deploy to staging environments with every pull request.", icon: GitMerge },
      { id: 4, title: "Monitoring & Alerting", description: "We install Datadog and Sentry to track performance bottlenecks and alert engineers the second an error occurs in production.", icon: Activity },
    ]
  },
  web: {
    colorHex: "#2563eb", // blue-600
    colorClass: "text-[#2A6FDB]",
    borderClass: "group-hover:border-[#2A6FDB]",
    bgHoverClass: "bg-[#2A6FDB]/10",
    labelClass: "text-[#2A6FDB]",
    steps: [
      { id: 1, title: "Systems Design", description: "We architect the database schemas, API contracts, and component libraries required for a scalable frontend and backend.", icon: LayoutTemplate },
      { id: 2, title: "Frontend Execution", description: "Translating high-fidelity designs into pixel-perfect React code, emphasizing web core vitals and accessibility.", icon: Code },
      { id: 3, title: "Backend Integration", description: "Connecting the interface to robust REST or GraphQL APIs, ensuring secure authentication and data fetching.", icon: Server },
      { id: 4, title: "Performance Audit", description: "Before launch, we rigorously test load times, SEO metrics, and edge-caching strategies to guarantee sub-second rendering.", icon: Gauge },
    ]
  },
  mobile: {
    colorHex: "#16a34a", // green-600
    colorClass: "text-green-600",
    borderClass: "group-hover:border-green-500",
    bgHoverClass: "bg-green-500/10",
    labelClass: "text-green-600",
    steps: [
      { id: 1, title: "Native Planning", description: "We map out device-specific UI patterns and hardware requirements (camera, GPS, biometrics) before writing any code.", icon: Smartphone },
      { id: 2, title: "React Native Architecture", description: "We leverage React Native and Expo to write 90% shared code, reducing development time while maintaining 60fps performance.", icon: Layers },
      { id: 3, title: "App Store Deployment", description: "We handle the grueling Apple App Store and Google Play Store review processes, ensuring a smooth, compliant launch.", icon: UploadCloud },
    ]
  },
  ai: {
    colorHex: "#4f46e5", // indigo-600
    colorClass: "text-[#2A6FDB]",
    borderClass: "group-hover:border-indigo-500",
    bgHoverClass: "bg-[#e8f0fd]0/10",
    labelClass: "text-[#2A6FDB]",
    steps: [
      { id: 1, title: "Discovery & Scoping", description: "We identify the core problem your MVP solves and map out the absolute minimum features required to validate it.", icon: Lightbulb },
      { id: 2, title: "Rapid Development", description: "We utilize modern stacks (Next.js, Supabase) and AI generation to build the core product 3x faster than traditional agencies.", icon: Code },
      { id: 3, title: "Beta Testing", description: "We put the MVP in the hands of real users through TestFlight or Vercel preview links to gather qualitative data.", icon: TestTube },
      { id: 4, title: "Launch & Iterate", description: "We deploy to scalable cloud infrastructure (Vercel/AWS) and install analytics to capture immediate user feedback.", icon: Rocket },
    ]
  },
  genai: {
    colorHex: "#9333ea", // purple-600
    colorClass: "text-purple-600",
    borderClass: "group-hover:border-purple-500",
    bgHoverClass: "bg-purple-500/10",
    labelClass: "text-purple-600",
    steps: [
      { id: 1, title: "Data Strategy", description: "We analyze your proprietary data and prepare it for embedding, ensuring the AI model has deep, accurate context specific to your business.", icon: Database },
      { id: 2, title: "Model Selection & RAG", description: "We select the right LLM (OpenAI, Claude, open-source) and build Retrieval-Augmented Generation pipelines to minimize hallucinations.", icon: Brain },
      { id: 3, title: "UI/UX Implementation", description: "We design seamless conversational interfaces or predictive UI elements that make interacting with the AI feel natural to the end user.", icon: MessageSquare },
    ]
  },
  standard: {
    colorHex: "#2563eb", // blue-600
    colorClass: "text-[#2A6FDB]",
    borderClass: "group-hover:border-[#2A6FDB]",
    bgHoverClass: "bg-[#2A6FDB]/10",
    labelClass: "text-[#2A6FDB]",
    steps: [
      { id: 1, title: "Discovery", description: "We sit down with you to figure out exactly what needs to be built and, more importantly, what doesn't.", icon: Lightbulb },
      { id: 2, title: "Development", description: "We write the code. You get access to a staging environment on day one so you can see progress in real-time.", icon: Code },
      { id: 3, title: "Testing", description: "We try to break it. If our automated test suites and manual QA can't crash it, it's ready.", icon: TestTube },
      { id: 4, title: "Deployment", description: "We ship it to production, set up the monitoring alerts, and make sure it stays online.", icon: Rocket },
    ]
  }
};

export function AnimatedProcessFlow({ type = "devops" }: { type?: ServiceType }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"],
  });

  const data = PROCESS_DATA[type];
  const steps = data.steps;
  const isThreeSteps = steps.length === 3;
  const gridClass = isThreeSteps ? "md:grid-cols-3" : "md:grid-cols-4";

  return (
    <div ref={containerRef} className="relative w-full max-w-6xl mx-auto py-12">
      {/* Desktop Horizontal Line */}
      <div className="hidden md:block absolute top-[4.5rem] left-[10%] right-[10%] h-1 z-0">
        <svg width="100%" height="100%" preserveAspectRatio="none" className="absolute inset-0">
          {/* Background dashed line */}
          <line
            x1="0"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke="#e4e4e7" /* zinc-200 */
            strokeWidth="2"
            strokeDasharray="8 8"
          />
          {/* Scroll-based filled line */}
          <motion.line
            x1="0"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke={data.colorHex}
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              pathLength: scrollYProgress,
              transformOrigin: "left",
            }}
          />
          {/* Infinite pulsing dot traveling along the line */}
          <motion.circle
            cx="0"
            cy="50%"
            r="4"
            fill={data.colorHex}
            animate={{
              cx: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </svg>
      </div>

      {/* Nodes */}
      <div className={`relative z-10 grid grid-cols-2 ${gridClass} gap-8`}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="relative flex flex-col items-center text-center px-2 md:px-4 group">
              {/* Icon Circle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative w-12 h-12 md:w-16 md:h-16 bg-white border-2 border-[#e8e5db] rounded-2xl flex items-center justify-center shadow-sm mb-4 md:mb-6 z-10 ${data.borderClass} group-hover:shadow-md transition-all duration-300`}
              >
                <div className={`absolute inset-0 ${data.bgHoverClass} rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300`} />
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${data.colorClass} relative z-10`} />
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.1 }}
                className="pt-2 md:pt-0"
              >
                <div className={`text-xs md:text-sm font-bold ${data.labelClass} mb-1 md:mb-2 uppercase tracking-wider`}>Step 0{step.id}</div>
                <h3 className="text-sm md:text-xl font-bold text-[#161616] mb-2 md:mb-3">{step.title}</h3>
                <p className="hidden md:block text-[#444] text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
