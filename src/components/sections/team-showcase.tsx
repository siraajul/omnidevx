"use client";

import { useState } from 'react';

// Simple class merger
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// Inline SVGs
const TwitterIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const LinkedInIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);
const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
const BehanceIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 14H2v-4h5c2.2 0 4 1.8 4 4s-1.8 4-4 4Z"/><path d="M15 14h6"/><path d="M21 14v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2"/></svg>
);
const ArrowUpRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
);

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
  highlights?: { title: string; description: string }[];
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
  };
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'CEO & FOUNDER',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    bio: 'Principal leader pairing narrative strategy with premium software execution. Sarah leads founders and product teams through scaling operations that convert curiosity into momentum.',
    highlights: [
      { title: "Collaborations", description: "Linear, Framer, Gamma, Clearbit, and early-stage founders crafting premium launches." },
      { title: "Availability", description: "2 advisory spots for Q1 · Remote friendly across EU & US time zones." }
    ],
    social: { twitter: '#', linkedin: '#', behance: '#' },
  },
  {
    id: '2',
    name: 'Michael Chang',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
    bio: 'Engineering mastermind behind scalable infrastructure. Michael architects robust backend systems and oversees technical direction across all major client accounts.',
    highlights: [
      { title: "Expertise", description: "Distributed Systems, Cloud Architecture, Next.js, and PostgreSQL." },
      { title: "Latest Open Source", description: "Created an advanced ORM wrapper handling 10M+ operations daily." }
    ],
    social: { twitter: '#', linkedin: '#' },
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'VP OF ENGINEERING',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
    bio: 'Bridging the gap between design and technical execution. Elena ensures every pixel is mathematically perfect and every animation hits 60fps.',
    highlights: [
      { title: "Focus Areas", description: "Frontend Architecture, WebGL, GSAP, and Performance Optimization." },
      { title: "Speaking", description: "Keynote speaker at React Conf 2025." }
    ],
    social: { twitter: '#', linkedin: '#' },
  },
  {
    id: '4',
    name: 'David Chen',
    role: 'HEAD OF AI',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    bio: 'Pioneering intelligent agent integration. David trains bespoke LLMs and constructs RAG pipelines to give software human-like cognitive abilities.',
    highlights: [
      { title: "Focus Areas", description: "OpenAI, LangChain, Pinecone, and Machine Learning." },
      { title: "Research", description: "Published papers on reducing hallucination in context-heavy vector searches." }
    ],
    social: { linkedin: '#' },
  },
  {
    id: '5',
    name: 'Marcus Thorne',
    role: 'LEAD PRODUCT DESIGNER',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    bio: 'Crafting interfaces that feel cinematic yet effortless. Marcus is obsessed with typography, micro-interactions, and establishing premium brand identities.',
    highlights: [
      { title: "Collaborations", description: "Stripe, Apple, Vercel, and numerous YC-backed startups." },
      { title: "Latest drop", description: "Aurora OS motion system · 47 reusable blueprints." }
    ],
    social: { twitter: '#', linkedin: '#', behance: '#' },
  },
  {
    id: '6',
    name: 'Aisha Patel',
    role: 'DEV OPS LEAD',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    bio: 'The guardian of uptime. Aisha automates deployments, secures infrastructure, and builds bulletproof CI/CD pipelines so developers can sleep at night.',
    highlights: [
      { title: "Infrastructure", description: "AWS, Docker, Kubernetes, and Terraform master." },
      { title: "Certifications", description: "AWS Certified Solutions Architect Professional." }
    ],
    social: { instagram: '#', linkedin: '#' },
  },
];

interface TeamShowcaseProps {
  readonly members?: TeamMember[];
}

export default function TeamShowcase({ members = DEFAULT_MEMBERS }: TeamShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);

  const col1 = members.filter((_, i) => i % 3 === 0);
  const col2 = members.filter((_, i) => i % 3 === 1);
  const col3 = members.filter((_, i) => i % 3 === 2);

  return (
    <>
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-16 select-none w-full max-w-6xl mx-auto py-12 px-4 md:px-8 font-sans">
        {/* ── Left: photo grid ── */}
        <div className="flex gap-4 md:gap-6 flex-shrink-0 overflow-x-auto pb-4 md:pb-0 hide-scrollbar justify-center">
          {/* Column 1 */}
          <div className="flex flex-col gap-4 md:gap-6">
            {col1.map((member) => (
              <PhotoCard
                key={member.id}
                member={member}
                className="w-[140px] h-[160px] sm:w-[160px] sm:h-[180px] md:w-[200px] md:h-[240px]"
                hoveredId={hoveredId}
                onHover={setHoveredId}
                onClick={() => setActiveMember(member)}
              />
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4 md:gap-6 mt-[60px] sm:mt-[70px] md:mt-[100px]">
            {col2.map((member) => (
              <PhotoCard
                key={member.id}
                member={member}
                className="w-[150px] h-[170px] sm:w-[180px] sm:h-[200px] md:w-[220px] md:h-[260px]"
                hoveredId={hoveredId}
                onHover={setHoveredId}
                onClick={() => setActiveMember(member)}
              />
            ))}
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4 md:gap-6 mt-[30px] sm:mt-[40px] md:mt-[60px]">
            {col3.map((member) => (
              <PhotoCard
                key={member.id}
                member={member}
                className="w-[145px] h-[165px] sm:w-[170px] sm:h-[190px] md:w-[210px] md:h-[250px]"
                hoveredId={hoveredId}
                onHover={setHoveredId}
                onClick={() => setActiveMember(member)}
              />
            ))}
          </div>
        </div>

        {/* ── Right: member name list*/}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:flex md:flex-col gap-6 md:gap-8 pt-8 md:pt-12 flex-1 w-full max-w-md">
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              onClick={() => setActiveMember(member)}
            />
          ))}
        </div>
      </div>

      {/* Portfolio Modal Popup */}
      {activeMember && (
        <PortfolioModal member={activeMember} onClose={() => setActiveMember(null)} />
      )}
    </>
  );
}

/* ─────────────────────────────────────────
   Portfolio Modal Popup
───────────────────────────────────────── */

function PortfolioModal({ member, onClose }: Readonly<{ member: TeamMember, onClose: () => void }>) {
  const getSocialIcon = (network: string) => {
    switch(network) {
      case 'twitter': return <TwitterIcon size={16} />;
      case 'linkedin': return <LinkedInIcon size={16} />;
      case 'instagram': return <InstagramIcon size={16} />;
      case 'behance': return <BehanceIcon size={16} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-zinc-900/40 backdrop-blur-md overflow-y-auto">
      <button 
        type="button"
        className="absolute inset-0 w-full h-full cursor-default bg-transparent border-none outline-none"
        onClick={onClose}
        aria-label="Close modal"
      />
      <dialog 
        open
        className="relative w-full max-w-5xl rounded-[32px] border border-[#e8e5db] bg-white/95 p-8 md:p-12 shadow-2xl m-auto z-10 block"
        aria-modal="true"
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-[#2A2A2A] hover:text-[#161616] bg-[#f5f3ea] rounded-full p-2 transition-colors z-20"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        {/* Glass gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-transparent pointer-events-none rounded-[32px]" />

        <div className="relative grid gap-12 lg:grid-cols-2">
          {/* Left column - Main content */}
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e8e5db] bg-[#f5f3ea] px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-[#2A2A2A] backdrop-blur">
              Portfolio Insight
            </span>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-[#161616] md:text-4xl">
                {member.name}, {member.role}
              </h2>
              <p className="max-w-xl text-lg leading-relaxed text-[#2A2A2A]">
                {member.bio}
              </p>
            </div>

            {/* Highlights grid */}
            <div className="grid gap-4 sm:grid-cols-1">
              {member.highlights?.map((item) => (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-[#e8e5db] bg-[#f5f3ea] p-6 transition-all hover:border-zinc-300 hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10" />
                  <div className="relative space-y-2">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#444]">
                      {item.title}
                    </p>
                    <p className="text-sm leading-relaxed text-zinc-700">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="pt-4">
              <button
                className="h-12 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 text-white px-8 text-sm font-bold uppercase tracking-[0.25em] transition-all hover:bg-black shadow-lg shadow-zinc-200"
              >
                View case studies
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          {/* Right column - Profile card */}
          <div className="relative">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-blue-500/10 via-transparent to-transparent blur-3xl" />
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-[#e8e5db] bg-white/80 p-8 backdrop-blur-xl">
              <div className="flex flex-col items-center text-center">
                {/* Avatar with glow */}
                <div className="relative mb-6">
                  <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2A6FDB]/20 blur-2xl" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative h-32 w-32 rounded-full border border-[#e8e5db] object-cover shadow-xl"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-bold tracking-tight text-[#161616]">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#444]">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-8 flex flex-col gap-3">
                {Object.entries(member.social || {}).map(([network, url]) => (
                  <a
                    key={network}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-[#e8e5db] bg-white px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-[#f5f3ea]"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8e5db] bg-[#f5f3ea] text-[#2A2A2A] transition-all group-hover:text-[#161616] group-hover:border-zinc-300">
                        {getSocialIcon(network)}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-[#161616] capitalize">
                          {network}
                        </p>
                        <p className="text-xs text-[#444]">
                          @{member.name.toLowerCase().replace(' ', '')}
                        </p>
                      </div>
                    </div>
                    <span className="text-[#444] transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#161616]">
                      <ArrowUpRight size={18} />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

/* ─────────────────────────────────────────
   Photo card 
───────────────────────────────────────── */

function PhotoCard({
  member,
  className,
  hoveredId,
  onHover,
  onClick,
}: Readonly<{
  member: TeamMember;
  className: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onClick: () => void;
}>) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;

  return (
    <button
      type="button"
      className={cn(
        'overflow-hidden rounded-2xl cursor-pointer flex-shrink-0 transition-opacity duration-500 block border-none outline-none p-0 bg-transparent text-left focus:ring-2 focus:ring-[#2A6FDB]',
        className,
        isDimmed ? 'opacity-40' : 'opacity-100',
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(member.id)}
      onBlur={() => onHover(null)}
      onClick={onClick}
    >
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover transition-[filter,transform] duration-700 ease-out hover:scale-105"
        style={{
          filter: isActive ? 'grayscale(0) brightness(1.1)' : 'grayscale(1) brightness(0.6)',
        }}
        draggable={false}
      />
    </button>
  );
}

/* ─────────────────────────────────────────
   Member name section
───────────────────────────────────────── */

function MemberRow({
  member,
  hoveredId,
  onHover,
  onClick,
}: Readonly<{
  member: TeamMember;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onClick: () => void;
}>) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;
  return (
    <button
      type="button"
      className={cn(
        'cursor-pointer transition-opacity duration-300 block w-full border-none outline-none p-0 bg-transparent text-left focus:ring-2 focus:ring-[#2A6FDB] rounded-lg',
        isDimmed ? 'opacity-30' : 'opacity-100',
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(member.id)}
      onBlur={() => onHover(null)}
      onClick={onClick}
    >
      {/* Name + social*/}
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'h-3 rounded-[5px] flex-shrink-0 transition-all duration-300',
            isActive ? 'bg-[#111] w-8' : 'bg-zinc-300 w-4',
          )}
        />
        <span
          className={cn(
            'text-lg md:text-2xl font-bold leading-none tracking-tight transition-colors duration-300',
            isActive ? 'text-[#161616]' : 'text-[#444]',
          )}
        >
          {member.name}
        </span>
      </div>

      {/* Role */}
      <p className="mt-2 pl-[44px] text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-[#2A6FDB]">
        {member.role}
      </p>
    </button>
  );
}
