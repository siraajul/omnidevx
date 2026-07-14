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
          Most agencies hand you a bloated Wordpress site and call it an app. We don't. We write clean code, we test it relentlessly, and we actually pick up the phone when you call.
        </p>
      </FlowSection>

      <FlowSection aria-label="The mission" style={{ backgroundColor: '#ffffff', color: '#161616' }}>
        <p className="text-xl font-hand text-[#2A6FDB]">02 — the mission</p>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <div>
          <h2 className="text-[clamp(3.5rem,8vw,8rem)] font-display leading-[0.9] text-[#161616]">
            code <span className="text-[#2A6FDB]">that</span>
            <br />
            works
          </h2>
        </div>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <p className="max-w-[60ch] text-[clamp(1.1rem,1.5vw,1.35rem)] font-medium text-[#2A2A2A] leading-relaxed">
          No buzzwords. We build software that handles real traffic, doesn't crash on weekends, and makes sense to the next developer who has to read it.
        </p>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <div className="flex flex-wrap gap-[2vw]">
          <div className="min-w-[160px] flex-1">
            <p className="mb-2 text-xl font-hand text-[#161616]">architecture</p>
            <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-[#444] leading-relaxed">
              We don't over-engineer. We pick boring, proven technologies that won't wake you up at 3 AM.
            </p>
          </div>
          <div className="min-w-[160px] flex-1">
            <p className="mb-2 text-xl font-hand text-[#161616]">testing</p>
            <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-[#444] leading-relaxed">
              We write tests. Real tests that actually catch bugs, not just tests to hit an arbitrary coverage number.
            </p>
          </div>
          <div className="min-w-[160px] flex-1">
            <p className="mb-2 text-xl font-hand text-[#161616]">transparency</p>
            <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-[#444] leading-relaxed">
              You get access to our GitHub, our Slack, and our staging servers. You see the code exactly as it's written.
            </p>
          </div>
        </div>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <p className="mt-auto ml-auto max-w-[60ch] text-right text-[clamp(1.1rem,1.5vw,1.35rem)] font-medium text-[#2A2A2A] leading-relaxed">
          Every system we build starts with one question — does this actually solve a problem?
        </p>
      </FlowSection>

      <FlowSection aria-label="How it works" style={{ backgroundColor: '#f5f3ea', color: '#161616' }}>
        <p className="text-xl font-hand text-[#2A6FDB]">03 — how it works</p>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <div>
          <h2 className="text-[clamp(3.5rem,8vw,8rem)] font-display leading-[0.9] text-[#161616]">
            how we
            <br />
            <span className="scribble-underline text-[#2A6FDB]">do it</span>
          </h2>
        </div>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <p className="max-w-[60ch] text-[clamp(1.1rem,1.5vw,1.35rem)] font-medium text-[#2A2A2A] leading-relaxed">
          We keep it simple. We talk, we build, and we ship. No bloated project management overhead.
        </p>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <div className="flex flex-wrap gap-[2vw]">
          <div className="min-w-[160px] flex-1">
            <p className="mb-2 text-xl font-hand text-[#161616]">01 — discover</p>
            <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-[#444] leading-relaxed">
              We figure out what you actually need, not just what's on the spec sheet. We cut the fluff.
            </p>
          </div>
          <div className="min-w-[160px] flex-1">
            <p className="mb-2 text-xl font-hand text-[#161616]">02 — build</p>
            <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-[#444] leading-relaxed">
              We write the code. You get a link to staging on day one. You watch the product come to life in real-time.
            </p>
          </div>
          <div className="min-w-[160px] flex-1">
            <p className="mb-2 text-xl font-hand text-[#161616]">03 — ship</p>
            <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-[#444] leading-relaxed">
              We push it to production. We set up the monitoring. If it breaks, we fix it.
            </p>
          </div>
        </div>
      </FlowSection>

      <FlowSection aria-label="The vision" style={{ backgroundColor: '#ffffff', color: '#161616' }}>
        <p className="text-xl font-hand text-[#2A6FDB]">04 — the vision</p>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <div>
          <h2 className="text-[clamp(3.5rem,8vw,8rem)] font-display leading-[0.9] text-[#161616]">
            no
            <br />
            <span className="text-[#2A6FDB]">nonsense</span>
          </h2>
        </div>
        <hr className="my-[1.5vw] border-none border-t border-[#e8e5db]" />
        <p className="max-w-[60ch] text-[clamp(1.1rem,1.5vw,1.35rem)] font-medium text-[#2A2A2A] leading-relaxed">
          We don't try to impress you with technical jargon. We let the results speak for themselves.
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
