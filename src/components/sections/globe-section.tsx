import React from "react"
import { Globe } from "./cobe-globe"

const markers = [
  { id: "us", location: [37.7595, -122.4367] as [number, number], label: "United States" },
  { id: "fr", location: [48.8566, 2.3522] as [number, number], label: "France" },
  { id: "uae", location: [25.2048, 55.2708] as [number, number], label: "UAE" },
  { id: "sa", location: [-33.9249, 18.4241] as [number, number], label: "South Africa" },
  { id: "bd", location: [23.8103, 90.4125] as [number, number], label: "Bangladesh" },
  { id: "nz", location: [-41.2865, 174.7762] as [number, number], label: "New Zealand" },
  { id: "cn", location: [39.9042, 116.4074] as [number, number], label: "China" },
  { id: "cl", location: [-33.4489, -70.6693] as [number, number], label: "Chile" },
]

const arcs = [
  {
    id: "us-fr",
    from: [37.7595, -122.4367] as [number, number],
    to: [48.8566, 2.3522] as [number, number],
  },
  {
    id: "fr-uae",
    from: [48.8566, 2.3522] as [number, number],
    to: [25.2048, 55.2708] as [number, number],
  },
  {
    id: "uae-sa",
    from: [25.2048, 55.2708] as [number, number],
    to: [-33.9249, 18.4241] as [number, number],
  },
  {
    id: "uae-bd",
    from: [25.2048, 55.2708] as [number, number],
    to: [23.8103, 90.4125] as [number, number],
  },
  {
    id: "fr-cl",
    from: [48.8566, 2.3522] as [number, number],
    to: [-33.4489, -70.6693] as [number, number],
  },
  {
    id: "bd-cn",
    from: [23.8103, 90.4125] as [number, number],
    to: [39.9042, 116.4074] as [number, number],
  },
  {
    id: "cn-nz",
    from: [39.9042, 116.4074] as [number, number],
    to: [-41.2865, 174.7762] as [number, number],
  },
]

export default function GlobeSection() {
  return (
    <section className="py-32 px-8 bg-white border-t border-[#e8e5db] relative overflow-hidden">
      {/* Background Glow (Performance Optimized: Radial Gradient) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(232,240,253,0.5)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left gsap-reveal">
          <h2 className="text-4xl md:text-6xl font-display text-[#161616] mb-6">
            Serve across the <span className="scribble-underline text-[#2A6FDB]">globe.</span>
          </h2>
          <p className="text-lg md:text-xl text-[#2A2A2A] mb-8 max-w-2xl mx-auto lg:mx-0">
            Our infrastructure scales dynamically. We build highly available, geographically distributed systems that guarantee millisecond latency for your users, no matter where they are.
          </p>
          
          <div className="grid grid-cols-2 gap-8 text-left max-w-md mx-auto lg:mx-0">
            <div>
              <h4 className="text-4xl font-display text-[#2A6FDB] mb-1">99.99%</h4>
              <p className="text-lg font-hand text-[#2A2A2A]">Uptime SLA</p>
            </div>
            <div>
              <h4 className="text-4xl font-display text-[#2A6FDB] mb-1">&lt;50ms</h4>
              <p className="text-lg font-hand text-[#2A2A2A]">Global Latency</p>
            </div>
          </div>
        </div>

        {/* Globe Container */}
        <div className="flex-1 w-full max-w-lg aspect-square relative gsap-reveal">
          {/* Decorative rings */}
          <div className="absolute inset-0 rounded-full border border-[#e8e5db]/50 scale-[1.1]"></div>
          <div className="absolute inset-0 rounded-full border border-blue-100 scale-[1.25]"></div>
          
          <Globe
            markers={markers}
            arcs={arcs}
            markerColor={[0.145, 0.388, 0.921]} // Blue-600
            baseColor={[1, 1, 1]}
            arcColor={[0.145, 0.388, 0.921]}
            glowColor={[0.94, 0.93, 0.91]}
            dark={0}
            mapBrightness={10}
            markerSize={0.03}
            markerElevation={0.01}
          />
        </div>

      </div>
    </section>
  )
}
