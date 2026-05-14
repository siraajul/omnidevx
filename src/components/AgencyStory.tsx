import React from 'react';
import FlowArt, { FlowSection } from './sections/story-scroll';

export default function AgencyStory() {
  return (
    <FlowArt aria-label="Omnidevx Story">
      <FlowSection aria-label="Who we are" style={{ backgroundColor: '#FDFCF7', color: '#161616' }}>
        <p className="text-xl font-hand text-[#2A6FDB]">01 — who we are</p>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <div>
          <h1 className="text-[clamp(3.5rem,8vw,8rem)] font-display leading-[0.9] text-[#161616]">
            build
            <br />
            without
            <br />
            <span className="scribble-underline text-[#2A6FDB]">limits</span>
          </h1>
        </div>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <p className="mt-auto max-w-[60ch] text-[clamp(1.1rem,1.5vw,1.35rem)] font-medium text-[#2A2A2A] leading-relaxed">
          We believe every founder deserves a technical partner that puts innovation first. No boilerplate, no shortcuts — just elite engineering and the people who make it.
        </p>
      </FlowSection>

      <FlowSection aria-label="The mission" style={{ backgroundColor: '#ffffff', color: '#161616' }}>
        <p className="text-xl font-hand text-[#2A6FDB]">02 — the mission</p>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <div>
          <h2 className="text-[clamp(3.5rem,8vw,8rem)] font-display leading-[0.9] text-[#161616]">
            AI <span className="text-[#2A6FDB]">first</span>
            <br />
            always
          </h2>
        </div>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <p className="max-w-[60ch] text-[clamp(1.1rem,1.5vw,1.35rem)] font-medium text-[#2A2A2A] leading-relaxed">
          A global engineering collective built for startups. We're rewriting the rules of how software gets built, deployed, and scaled.
        </p>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <div className="flex flex-wrap gap-[2vw]">
          <div className="min-w-[160px] flex-1">
            <p className="mb-2 text-xl font-hand text-[#161616]">architecture</p>
            <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-[#444] leading-relaxed">
              Systems designed to scale from day one. No technical debt. No fragile foundations.
            </p>
          </div>
          <div className="min-w-[160px] flex-1">
            <p className="mb-2 text-xl font-hand text-[#161616]">intelligence</p>
            <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-[#444] leading-relaxed">
              Embedding generative AI natively into your workflows to outpace the competition.
            </p>
          </div>
          <div className="min-w-[160px] flex-1">
            <p className="mb-2 text-xl font-hand text-[#161616]">speed</p>
            <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-[#444] leading-relaxed">
              Rapid prototyping and CI/CD pipelines that get your product to market in weeks.
            </p>
          </div>
        </div>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <p className="mt-auto ml-auto max-w-[60ch] text-right text-[clamp(1.1rem,1.5vw,1.35rem)] font-medium text-[#2A2A2A] leading-relaxed">
          Every system we build starts with one question — does this scale the business?
        </p>
      </FlowSection>

      <FlowSection aria-label="How it works" style={{ backgroundColor: '#f5f3ea', color: '#161616' }}>
        <p className="text-xl font-hand text-[#2A6FDB]">03 — how it works</p>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <div>
          <h2 className="text-[clamp(3.5rem,8vw,8rem)] font-display leading-[0.9] text-[#161616]">
            show up.
            <br />
            <span className="scribble-underline text-[#2A6FDB]">stand out.</span>
          </h2>
        </div>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <p className="max-w-[60ch] text-[clamp(1.1rem,1.5vw,1.35rem)] font-medium text-[#2A2A2A] leading-relaxed">
          Three phases. Zero complexity. Your technical roadmap starts moving the moment we sync.
        </p>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <div className="flex flex-wrap gap-[2vw]">
          <div className="min-w-[160px] flex-1">
            <p className="mb-2 text-xl font-hand text-[#161616]">01 — discover</p>
            <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-[#444] leading-relaxed">
              We audit your architecture, define the MVP scope, and establish the precise data models required.
            </p>
          </div>
          <div className="min-w-[160px] flex-1">
            <p className="mb-2 text-xl font-hand text-[#161616]">02 — build</p>
            <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-[#444] leading-relaxed">
              Our engineers execute in rapid sprints, providing you with staging environments every step of the way.
            </p>
          </div>
          <div className="min-w-[160px] flex-1">
            <p className="mb-2 text-xl font-hand text-[#161616]">03 — scale</p>
            <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-[#444] leading-relaxed">
              We deploy to production, monitor infrastructure, and seamlessly scale your backend as users surge.
            </p>
          </div>
        </div>
      </FlowSection>

      <FlowSection aria-label="The vision" style={{ backgroundColor: '#ffffff', color: '#161616' }}>
        <p className="text-xl font-hand text-[#2A6FDB]">04 — the vision</p>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <div>
          <h2 className="text-[clamp(3.5rem,8vw,8rem)] font-display leading-[0.9] text-[#161616]">
            future
            <br />
            of <span className="text-[#2A6FDB]">software</span>
          </h2>
        </div>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <p className="max-w-[60ch] text-[clamp(1.1rem,1.5vw,1.35rem)] font-medium text-[#2A2A2A] leading-relaxed">
          We're not just building apps. We're building intelligent systems.
        </p>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <div className="flex flex-wrap gap-[2vw]">
          <div className="min-w-[160px] flex-1">
            <p className="mb-2 text-4xl font-display text-[#2A6FDB]">100M+</p>
            <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-[#444] leading-relaxed">
              API requests handled daily by the infrastructures we've designed.
            </p>
          </div>
          <div className="min-w-[160px] flex-1">
            <p className="mb-2 text-4xl font-display text-[#2A6FDB]">$50M+</p>
            <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-[#444] leading-relaxed">
              Venture capital raised by the startups we've engineered products for.
            </p>
          </div>
          <div className="min-w-[160px] flex-1">
            <p className="mb-2 text-4xl font-display text-[#2A6FDB]">100%</p>
            <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-[#444] leading-relaxed">
              Client IP ownership. You own every line of code we push to production.
            </p>
          </div>
        </div>
      </FlowSection>

      <FlowSection aria-label="Join us" style={{ backgroundColor: '#FDFCF7', color: '#161616' }}>
        <p className="text-xl font-hand text-[#2A6FDB]">05 — join us</p>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <div>
          <h2 className="text-[clamp(3.5rem,8vw,8rem)] font-display leading-[0.9] text-[#161616]">
            ready
            <br />
            to <span className="scribble-underline text-[#2A6FDB]">begin?</span>
          </h2>
        </div>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <p className="mt-auto max-w-[60ch] text-[clamp(1.1rem,1.5vw,1.35rem)] font-medium text-[#2A2A2A] leading-relaxed">
          Take control of your technical journey. Let's shape the future of your product together. Scroll down to get in touch.
        </p>
      </FlowSection>
    </FlowArt>
  );
}
