"use client";

import { CardStack, type CardStackItem } from "@/components/ui/card-stack";

const galleryItems: CardStackItem[] = [
  {
    id: 1,
    title: "The Collaboration Hub",
    description: "Where our cross-functional teams turn complex problems into elegant solutions.",
    imageSrc: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Deep Work Zones",
    description: "Quiet spaces designed for intense focus and uninterrupted engineering.",
    imageSrc: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Architecture Reviews",
    description: "Rigorous whiteboarding sessions to ensure scalable and secure systems.",
    imageSrc: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "Design Meets Code",
    description: "The intersection of pixel-perfect UI and robust backend systems.",
    imageSrc: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    title: "Celebrating Wins",
    description: "Taking time to reflect, learn, and celebrate successful product launches.",
    imageSrc: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80",
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
