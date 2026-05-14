"use client";

import React, { useRef } from "react";
import { motion, useTransform, useSpring } from "motion/react";
import { QrCode, Building } from "lucide-react";

export default function CustomLanyard() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Spring physics for the badge (makes it snap back satisfyingly)
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });

  // Add subtle rotation based on drag X distance
  const rotate = useTransform(x, [-300, 300], [-25, 25]);
  // Add subtle 3D tilt based on drag Y distance
  const rotateX = useTransform(y, [-300, 300], [15, -15]);

  // Generate the SVG string path for the lanyard cord dynamically
  // The cord connects from a fixed point high above, down to the badge clip
  const pathD = useTransform([x, y], ([currentX, currentY]) => {
    // Top anchor point (fixed)
    const startX = 0;
    const startY = -400;

    // End point is attached to the top-center of the moving badge
    // The badge is offset by currentX, currentY.
    // The top of the badge is roughly at y = -140
    const endX = currentX as number;
    const endY = (currentY as number) - 130;

    // Control point for a hanging gravity curve (quadratic bezier)
    const controlX = (startX + endX) / 2;
    // The string droops down slightly lower than the anchor
    const droop = Math.abs(endX) * 0.5 + 50;
    const controlY = Math.max(startY, endY) + droop;

    return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
  });

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[600px] overflow-hidden bg-[#FDFCF7] rounded-3xl border border-[#e8e5db] flex items-center justify-center cursor-grab active:cursor-grabbing"
    >
      {/* Background Grid Pattern (Optional Aesthetic) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

      {/* SVG Canvas for the String */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 1 }}>
        <g transform="translate(50%, 50%)">
          <motion.path
            d={pathD}
            fill="none"
            stroke="#18181B" /* zinc-900 */
            strokeWidth="8"
            strokeLinecap="round"
            style={{
              // Add a subtle texture or dash to look like a woven lanyard
              strokeDasharray: "4 2"
            }}
          />
        </g>
      </svg>

      {/* The Draggable Badge */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.6}
        style={{ x, y, rotate, rotateX, zIndex: 10 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className="relative group"
      >
        {/* Metal Clip connecting string to badge */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-10 bg-gradient-to-b from-zinc-300 to-zinc-500 rounded-t-lg border-2 border-zinc-400 shadow-sm flex items-start justify-center z-20">
          <div className="w-3 h-3 rounded-full bg-zinc-800 mt-1 shadow-inner"></div>
        </div>

        {/* The Badge Card */}
        <div className="w-64 bg-white/90 backdrop-blur-md border border-[#e8e5db] rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center pt-8 pb-6 px-6 relative z-10 transition-shadow group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]">
          {/* Card Top Hole Punch */}
          <div className="absolute top-3 w-12 h-3 rounded-full bg-[#FDFCF7] shadow-inner border border-[#e8e5db]"></div>

          {/* Company Branding */}
          <div className="w-full flex items-center justify-between mb-6">
            <span className="font-display text-2xl text-[#161616] leading-none pb-1">
              omnidev<span className="text-[#2A6FDB]">X</span>
            </span>
            <span className="text-[10px] font-bold text-[#444] tracking-widest uppercase">Staff</span>
          </div>

          {/* Employee Photo */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#e8e5db] shadow-md mb-4 relative bg-[#f5f3ea]">
            <img 
              src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=200&q=80" 
              alt="Employee Avatar" 
              className="w-full h-full object-cover"
              draggable="false"
            />
          </div>

          {/* Employee Details */}
          <div className="text-center w-full border-b border-[#e8e5db] pb-4 mb-4">
            <h2 className="text-2xl font-display text-[#161616] tracking-tight">Alex Carter</h2>
            <p className="text-[#2A6FDB] font-medium text-sm mt-1">Lead Architect</p>
          </div>

          {/* Bottom Barcode / ID */}
          <div className="w-full flex flex-col items-center">
            <QrCode className="w-12 h-12 text-[#161616] opacity-80" strokeWidth={1.5} />
            <p className="text-[10px] text-[#444] font-mono mt-2 tracking-widest">ID: 8492-OMNI-DX</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
