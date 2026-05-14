import React from 'react';
import FlowArt, { FlowSection } from './sections/story-scroll';

export default function AgencyStory() {
  return (
    <FlowArt aria-label="Omnidevx Story">
      <FlowSection aria-label="Who we are" style={{ backgroundColor: '#0891B2', color: '#fff' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">01 — Who we are</p>
        <hr className="my-[1.5vw] border-none border-t border-white/40 opacity-100" />
        <div>
          <h1
            className="text-[clamp(2.5rem,8vw,7rem)] font-black leading-[0.9] uppercase tracking-tight"
          >
            Build
            <br />
            Without
            <br />
            Limits
          </h1>
        </div>
        <hr className="my-[1.5vw] border-none border-t border-white/40 opacity-100" />
        <p className="mt-auto max-w-[60ch] text-[clamp(1rem,1.5vw,1.25rem)] font-medium leading-relaxed">
          We believe every founder deserves a technical partner that puts innovation first. No boilerplate, no shortcuts — just elite engineering and the people who make it.
        </p>
      </FlowSection>

      <FlowSection aria-label="The mission" style={{ backgroundColor: '#FFFFFF', color: '#000' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">02 — The mission</p>
        <hr className="my-[1.5vw] border-none border-t border-black/10" />
        <div>
          <h2
            className="text-[clamp(2.5rem,8vw,7rem)] font-black leading-[0.9] uppercase tracking-tight"
          >
            AI
            <br />
            First
            <br />
            Always
          </h2>
        </div>
        <hr className="my-[1.5vw] border-none border-t border-black/10" />
        <p className="max-w-[60ch] text-[clamp(1rem,1.5vw,1.25rem)] font-medium leading-relaxed">
          A global engineering collective built for startups. We're rewriting the rules of how software gets built, deployed, and scaled.
        </p>
        <hr className="my-[1.5vw] border-none border-t border-black/10" />
        <div className="flex flex-wrap gap-[2vw]">
          <div className="min-w-[160px] flex-1">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-600">Architecture</p>
            <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed opacity-75">
              Systems designed to scale from day one. No technical debt. No fragile foundations.
            </p>
          </div>
          <div className="min-w-[160px] flex-1">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-600">Intelligence</p>
            <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed opacity-75">
              Embedding generative AI natively into your workflows to outpace the competition.
            </p>
          </div>
          <div className="min-w-[160px] flex-1">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-600">Speed</p>
            <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed opacity-75">
              Rapid prototyping and CI/CD pipelines that get your product to market in weeks.
            </p>
          </div>
        </div>
        <hr className="my-[1.5vw] border-none border-t border-black/10" />
        <p className="mt-auto ml-auto max-w-[60ch] text-right text-[clamp(1rem,1.5vw,1.25rem)] font-medium leading-relaxed">
          Every system we build starts with one question — does this scale the business?
        </p>
      </FlowSection>

      <FlowSection aria-label="How it works" style={{ backgroundColor: '#F5F0E8', color: '#000' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">03 — How it works</p>
        <hr className="my-[1.5vw] border-none border-t border-black/60" />
        <div>
          <h2
            className="text-[clamp(2.5rem,8vw,7rem)] font-black leading-[0.9] uppercase tracking-tight"
          >
            Show
            <br />
            Up.
            <br />
            Stand
            <br />
            Out.
          </h2>
        </div>
        <hr className="my-[1.5vw] border-none border-t border-black/60" />
        <p className="max-w-[60ch] text-[clamp(1rem,1.5vw,1.25rem)] font-medium leading-relaxed">
          Three phases. Zero complexity. Your technical roadmap starts moving the moment we sync.
        </p>
        <hr className="my-[1.5vw] border-none border-t border-black/60" />
        <div className="flex flex-wrap gap-[2vw]">
          <div className="min-w-[160px] flex-1">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-600">01 — Discover</p>
            <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed opacity-75">
              We audit your architecture, define the MVP scope, and establish the precise data models required.
            </p>
          </div>
          <div className="min-w-[160px] flex-1">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-600">02 — Build</p>
            <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed opacity-75">
              Our engineers execute in rapid sprints, providing you with staging environments every step of the way.
            </p>
          </div>
          <div className="min-w-[160px] flex-1">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-600">03 — Scale</p>
            <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed opacity-75">
              We deploy to production, monitor infrastructure, and seamlessly scale your backend as users surge.
            </p>
          </div>
        </div>
      </FlowSection>

      <FlowSection aria-label="The vision" style={{ backgroundColor: '#3B82F6', color: '#fff' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">04 — The vision</p>
        <hr className="my-[1.5vw] border-none border-t border-white/50" />
        <div>
          <h2
            className="text-[clamp(2.5rem,8vw,7rem)] font-black leading-[0.9] uppercase tracking-tight"
          >
            Future
            <br />
            Of
            <br />
            Software
          </h2>
        </div>
        <hr className="my-[1.5vw] border-none border-t border-white/50" />
        <p className="max-w-[60ch] text-[clamp(1rem,1.5vw,1.25rem)] font-medium leading-relaxed">
          We're not just building apps. We're building intelligent systems.
        </p>
        <hr className="my-[1.5vw] border-none border-t border-white/50" />
        <div className="flex flex-wrap gap-[2vw]">
          <div className="min-w-[160px] flex-1">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-200">100M+</p>
            <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed opacity-75">
              API requests handled daily by the infrastructures we've designed.
            </p>
          </div>
          <div className="min-w-[160px] flex-1">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-200">$50M+</p>
            <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed opacity-75">
              Venture capital raised by the startups we've engineered products for.
            </p>
          </div>
          <div className="min-w-[160px] flex-1">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-200">100%</p>
            <p className="text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed opacity-75">
              Client IP ownership. You own every line of code we push to production.
            </p>
          </div>
        </div>
      </FlowSection>

      <FlowSection aria-label="Join us" style={{ backgroundColor: '#F9F9F7', color: '#000' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">05 — Join us</p>
        <hr className="my-[1.5vw] border-none border-t border-black/20" />
        <div>
          <h2
            className="text-[clamp(2.5rem,8vw,7rem)] font-black leading-[0.9] uppercase tracking-tight"
          >
            Ready
            <br />
            To
            <br />
            Begin?
          </h2>
        </div>
        <hr className="my-[1.5vw] border-none border-t border-black/20" />
        <p className="mt-auto max-w-[60ch] text-[clamp(1rem,1.5vw,1.25rem)] font-medium leading-relaxed text-zinc-600">
          Take control of your technical journey. Let's shape the future of your product together. Scroll down to get in touch.
        </p>
      </FlowSection>
    </FlowArt>
  );
}
