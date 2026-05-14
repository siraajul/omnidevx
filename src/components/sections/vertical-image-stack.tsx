"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import gsap from "gsap"

const images = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop",
    alt: "Our engineering team collaborating",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop",
    alt: "omnidevx office space",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop",
    alt: "Leadership team meeting",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop",
    alt: "Strategy and planning",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop",
    alt: "Remote work culture",
  },
]

export function VerticalImageStack() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const lastNavigationTime = useRef(0)
  const navigationCooldown = 500 // ms between navigations
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  const navigate = useCallback((newDirection: number) => {
    const now = Date.now()
    if (now - lastNavigationTime.current < navigationCooldown) return
    lastNavigationTime.current = now

    setCurrentIndex((prev) => {
      if (newDirection > 0) {
        return prev === images.length - 1 ? 0 : prev + 1
      }
      return prev === 0 ? images.length - 1 : prev - 1
    })
  }, [])

  // Drag handling using native pointer events
  const dragStartY = useRef<number | null>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartY.current = e.clientY
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartY.current === null) return
    const deltaY = e.clientY - dragStartY.current
    const threshold = 50
    if (deltaY < -threshold) {
      navigate(1)
    } else if (deltaY > threshold) {
      navigate(-1)
    }
    dragStartY.current = null
  }

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 30) {
        if (e.deltaY > 0) {
          navigate(1)
        } else {
          navigate(-1)
        }
      }
    },
    [navigate],
  )

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: true })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [handleWheel])

  // GSAP Animation Engine
  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return

      const total = images.length
      let diff = index - currentIndex
      if (diff > total / 2) diff -= total
      if (diff < -total / 2) diff += total

      let targetProps = {}
      if (diff === 0) {
        targetProps = { y: 0, scale: 1, opacity: 1, zIndex: 5, rotationX: 0 }
      } else if (diff === -1) {
        targetProps = { y: -120, scale: 0.85, opacity: 0.6, zIndex: 4, rotationX: 8 }
      } else if (diff === -2) {
        targetProps = { y: -220, scale: 0.75, opacity: 0.3, zIndex: 3, rotationX: 15 }
      } else if (diff === 1) {
        targetProps = { y: 120, scale: 0.85, opacity: 0.6, zIndex: 4, rotationX: -8 }
      } else if (diff === 2) {
        targetProps = { y: 220, scale: 0.75, opacity: 0.3, zIndex: 3, rotationX: -15 }
      } else {
        targetProps = { y: diff > 0 ? 300 : -300, scale: 0.6, opacity: 0, zIndex: 0, rotationX: diff > 0 ? -20 : 20 }
      }

      gsap.to(card, {
        ...targetProps,
        duration: 0.8,
        ease: "power3.out",
        transformOrigin: "center center"
      })
    })
  }, [currentIndex])

  return (
    <div className="relative flex h-full min-h-[500px] w-full items-center justify-center overflow-hidden bg-black">
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      {/* Card Stack */}
      <div 
        className="relative flex h-[400px] w-[300px] items-center justify-center touch-none" 
        style={{ perspective: "1200px" }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { dragStartY.current = null }}
      >
        {images.map((image, index) => {
          const isCurrent = index === currentIndex

          return (
            <div
              key={image.id}
              ref={(el) => { cardsRef.current[index] = el }}
              className={`absolute cursor-grab active:cursor-grabbing ${!isCurrent && 'pointer-events-none'}`}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="relative h-[360px] w-[260px] overflow-hidden rounded-3xl bg-zinc-900 ring-1 ring-zinc-800/50"
                style={{
                  boxShadow: isCurrent
                    ? "0 25px 50px -12px rgba(255,255,255, 0.15), 0 0 0 1px rgba(255,255,255, 0.05)"
                    : "0 10px 30px -10px rgba(255,255,255, 0.1)",
                }}
              >
                {/* Card inner glow - uses white with low opacity */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 via-transparent to-transparent z-10 pointer-events-none" />

                <img
                  src={image.src}
                  alt={image.alt}
                  className="object-cover w-full h-full absolute inset-0 select-none"
                  draggable={false}
                />

                {/* Bottom gradient overlay - uses background color */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation dots */}
      <div className="absolute right-8 top-1/2 flex -translate-y-1/2 flex-col gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (index !== currentIndex) {
                setCurrentIndex(index)
              }
            }}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "h-6 bg-white" : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Instruction hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce">
        <div className="flex flex-col items-center gap-2 text-[#444]">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7-7 7 7" />
          </svg>
          <span className="text-xs font-medium tracking-widest uppercase">Scroll or drag</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Counter */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-light text-white tabular-nums">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <div className="my-2 h-px w-8 bg-white/20" />
          <span className="text-sm text-[#444] tabular-nums">{String(images.length).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  )
}
