"use client";
import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure GSAP registers the plugin only on the client side
if (globalThis.window !== undefined) {
  gsap.registerPlugin(ScrollTrigger);
}

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent?: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    // We need all refs to exist before initializing ScrollTrigger
    if (!containerRef.current || !headerRef.current || !cardRef.current) return;

    // Use gsap.context for easy cleanup
    const ctx = gsap.context(() => {
      // Define scale bounds based on mobile or desktop
      const scaleStart = isMobile ? 0.7 : 1.05;
      const scaleEnd = isMobile ? 0.9 : 1;

      // Ensure transform origins are set correctly
      gsap.set(cardRef.current, {
        transformOrigin: "center top",
        rotateX: 20,
        scale: scaleStart,
      });

      gsap.set(headerRef.current, {
        y: 0,
      });

      // Create a unified timeline mapped to the scroll progress
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom", // Animation starts when top of container hits bottom of viewport
          end: "bottom top", // Ends when bottom of container hits top of viewport
          scrub: 1, // Smooth scrubbing
        },
      });

      // Animate the header translating upwards
      tl.to(
        headerRef.current,
        {
          y: -100,
          ease: "none",
        },
        0 // Start at timeline zero
      );

      // Animate the 3D card rotating flat and scaling down/up
      tl.to(
        cardRef.current,
        {
          rotateX: 0,
          scale: scaleEnd,
          ease: "power2.out",
        },
        0 // Start concurrently with header
      );
    }, containerRef);

    // Cleanup ScrollTrigger on unmount
    return () => ctx.revert();
  }, [isMobile]);

  return (
    <div
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <div
          ref={headerRef}
          className="max-w-5xl mx-auto text-center"
        >
          {titleComponent}
        </div>
        <div
          ref={cardRef}
          style={{
            boxShadow:
              "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
          }}
          className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl origin-top"
        >
          <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
