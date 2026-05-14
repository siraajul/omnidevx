"use client";

import { CardStack, type CardStackItem } from "@/components/sections/card-stack";

const galleryItems: CardStackItem[] = [
  {
    id: 1,
    title: "The Collaboration Hub",
    description: "Where our cross-functional teams turn complex problems into elegant solutions.",
    imageSrc: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Deep Work Zones",
    description: "Quiet spaces designed for intense focus and uninterrupted engineering.",
    imageSrc: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Architecture Reviews",
    description: "Rigorous whiteboarding sessions to ensure scalable and secure systems.",
    imageSrc: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "Design Meets Code",
    description: "The intersection of pixel-perfect UI and robust backend systems.",
    imageSrc: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    title: "Celebrating Wins",
    description: "Taking time to reflect, learn, and celebrate successful product launches.",
    imageSrc: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function CulturePhotoGallery() {
  return (
    <div className="w-full flex justify-center py-16 mb-8 overflow-hidden">
      <div className="w-full max-w-5xl px-4 md:px-8">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Life at Omnidevx</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">A glimpse into our workspaces, our processes, and the moments that define our culture.</p>
        </div>
        <CardStack
          items={galleryItems}
          initialIndex={0}
          autoAdvance
          intervalMs={3000}
          pauseOnHover
          showDots
          cardWidth={600}
          cardHeight={400}
          className="mx-auto"
        />
      </div>
    </div>
  );
}
