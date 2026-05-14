'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (globalThis.window !== undefined) {
  gsap.registerPlugin(ScrollTrigger);
}

const INDUSTRIES = [
  { name: 'AI', value: 100 },
  { name: 'FINTECH', value: 85 },
  { name: 'EDTECH', value: 65 },
  { name: 'LOGISTICS', value: 75 },
  { name: 'SAAS', value: 95 },
  { name: 'PROPTECH', value: 60 },
  { name: 'HEALTHTECH', value: 85 },
  { name: 'CRM', value: 70 },
];

const NUM_AXES = INDUSTRIES.length;
const NUM_LEVELS = 5;
const RADIUS = 160;
const CENTER = RADIUS + 100; // Extra padding for the long labels
const SIZE = CENTER * 2;

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

export default function IndustryRadar() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        }
      });

      tl.fromTo('.radar-path', 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
      );

      tl.fromTo('.radar-dot',
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' },
        "-=0.7"
      );

      tl.fromTo('.radar-label',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'power2.out' },
        "-=0.4"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Generate axes lines (from center to max radius)
  const axes = INDUSTRIES.map((_, i) => {
    const angle = (360 / NUM_AXES) * i;
    return polarToCartesian(CENTER, CENTER, RADIUS, angle);
  });

  // Generate concentric octagons
  const levels = Array.from({ length: NUM_LEVELS }).map((_, levelIdx) => {
    const levelRadius = (RADIUS / NUM_LEVELS) * (levelIdx + 1);
    return INDUSTRIES.map((_, i) => {
      const angle = (360 / NUM_AXES) * i;
      return polarToCartesian(CENTER, CENTER, levelRadius, angle);
    });
  });

  // Generate data polygon points
  const dataPoints = INDUSTRIES.map((ind, i) => {
    const angle = (360 / NUM_AXES) * i;
    // Min value of 20% so it doesn't collapse to the center completely
    const valueRadius = Math.max((ind.value / 100) * RADIUS, RADIUS * 0.2);
    return polarToCartesian(CENTER, CENTER, valueRadius, angle);
  });

  const pathData = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-[700px] aspect-square flex items-center justify-center">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#2A6FDB]/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full overflow-visible font-sans">
          
          {/* Draw Concentric Grids */}
          {levels.map((level, i) => (
            <polygon
              // eslint-disable-next-line react/no-array-index-key
              key={`level-${i}`}
              points={level.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="currentColor"
              className="text-zinc-200 stroke-[1px]"
            />
          ))}

          {/* Draw Axes Lines */}
          {INDUSTRIES.map((ind, i) => {
            const p = axes[i];
            return (
              <line
                key={`axis-${ind.name}`}
                x1={CENTER}
                y1={CENTER}
                x2={p.x}
                y2={p.y}
                stroke="currentColor"
                className="text-zinc-200 stroke-[1px]"
              />
            );
          })}

          {/* Draw Filled Data Polygon */}
          <path
            className="radar-path opacity-0"
            d={pathData}
            fill="url(#blueGradient)"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinejoin="round"
            style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
          />

          {/* Draw Dots at Vertices */}
          {INDUSTRIES.map((ind, i) => {
            const p = dataPoints[i];
            return (
              <g
                key={`dot-group-${ind.name}`}
                className="radar-dot opacity-0"
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              >
                {/* Pulse effect */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={12}
                  fill="#06B6D4"
                  className="opacity-20 animate-ping"
                  style={{ animationDuration: '3s', animationDelay: `${i * 0.2}s` }}
                />
                {/* Solid dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={5}
                  fill="#FFFFFF"
                  stroke="#0891B2"
                  strokeWidth="2.5"
                />
              </g>
            );
          })}

          {/* Draw Labels */}
          {INDUSTRIES.map((ind, i) => {
            const angle = (360 / NUM_AXES) * i;
            const labelPos = polarToCartesian(CENTER, CENTER, RADIUS + 40, angle);
            
            let textAnchor: "middle" | "start" | "end" = "middle";
            let dx = 0;
            let dy = 0;

            if (angle > 10 && angle < 170) {
              textAnchor = "start";
              dx = 10;
            } else if (angle > 190 && angle < 350) {
              textAnchor = "end";
              dx = -10;
            }

            if (angle === 0) dy = -10;
            if (angle === 180) dy = 10;

            return (
              <text
                key={`label-${ind.name}`}
                x={labelPos.x + dx}
                y={labelPos.y + dy}
                textAnchor={textAnchor}
                alignmentBaseline="middle"
                className="radar-label opacity-0 text-[11px] sm:text-[13px] font-bold fill-zinc-600 tracking-[0.2em] uppercase"
              >
                [ {ind.name} ]
              </text>
            );
          })}

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
