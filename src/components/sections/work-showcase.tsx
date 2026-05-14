"use client";
import React, { useState } from "react";

const PROJECTS = [
  {
    name: "PayLab Pro",
    category: "FinTech",
    tagline: "Modernizing Contractor Financial Tools",
    description: "A comprehensive FinTech-as-a-Service platform enabling contractors to manage invoicing, payments, and client financing from one unified dashboard.",
    gradient: "from-blue-600 to-indigo-700",
    stats: [
      { value: "3x", label: "Faster invoicing" },
      { value: "40%", label: "Cost reduction" },
    ],
    tags: ["React", "Node.js", "Stripe API", "PostgreSQL"],
  },
  {
    name: "NexusAI",
    category: "AI / ML",
    tagline: "Intelligent Document Processing Pipeline",
    description: "An enterprise RAG platform that ingests, understands, and answers questions across millions of unstructured documents with citation-level accuracy.",
    gradient: "from-purple-600 to-pink-600",
    stats: [
      { value: "95%", label: "Accuracy rate" },
      { value: "10x", label: "Faster search" },
    ],
    tags: ["Python", "LangChain", "Pinecone", "Next.js"],
  },
  {
    name: "FieldSync",
    category: "SaaS",
    tagline: "Real-Time Workforce Management",
    description: "A cross-platform mobile + web app for managing field teams, scheduling, GPS tracking, and automated reporting — built for scale from day one.",
    gradient: "from-emerald-500 to-teal-600",
    stats: [
      { value: "50%", label: "Faster response" },
      { value: "24/7", label: "Live tracking" },
    ],
    tags: ["React Native", "Firebase", "Mapbox", "TypeScript"],
  },
];

export function WorkShowcase() {
  const [active, setActive] = useState(0);
  const project = PROJECTS[active];

  return (
    <section className="py-32 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6 tracking-tight">
            Our <span className="text-blue-600">Work</span>
          </h2>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
            Turning ambitious ideas into production-grade software.
          </p>
        </div>

        {/* Project Tabs */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {PROJECTS.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                active === i
                  ? "bg-zinc-900 text-white shadow-lg"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Project Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual */}
          <div className="lg:col-span-2 relative group">
            <div
              className={`relative aspect-[16/10] rounded-3xl bg-gradient-to-br ${project.gradient} overflow-hidden shadow-2xl transition-all duration-500`}
            >
              {/* Decorative grid overlay */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />

              {/* Floating UI mockup shapes */}
              <div className="absolute top-8 left-8 right-8 bottom-8 flex flex-col gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                </div>
                <div className="flex-1 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 p-6">
                  <div className="h-4 w-1/3 bg-white/20 rounded mb-4" />
                  <div className="h-3 w-2/3 bg-white/15 rounded mb-3" />
                  <div className="h-3 w-1/2 bg-white/10 rounded mb-6" />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-16 bg-white/10 rounded-xl" />
                    <div className="h-16 bg-white/15 rounded-xl" />
                    <div className="h-16 bg-white/10 rounded-xl" />
                  </div>
                </div>
              </div>

              {/* Bottom overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-8 pt-16">
                <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full backdrop-blur-sm mb-3 inline-block tracking-wider uppercase">
                  {project.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                  {project.tagline}
                </h3>
                <p className="text-white/70 text-sm max-w-lg">
                  {project.description}
                </p>
              </div>

              {/* Arrow link */}
              <a
                href="/portfolio"
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors border border-white/30"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </div>
          </div>

          {/* Side Stats */}
          <div className="flex flex-col gap-6">
            {project.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex-1 rounded-3xl bg-zinc-900 p-8 flex flex-col justify-center shadow-xl"
              >
                <span className="text-5xl md:text-6xl font-black text-blue-400 mb-2">
                  {stat.value}
                </span>
                <span className="text-zinc-400 text-lg font-medium">
                  {stat.label}
                </span>
              </div>
            ))}

            {/* Tech tags */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 block">
                Tech Stack
              </span>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <a
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white font-bold rounded-full hover:bg-zinc-800 transition-colors text-sm tracking-wide"
          >
            View All Projects
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
