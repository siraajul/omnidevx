import * as React from "react";
import { StoryViewer, type Story } from "@/components/ui/story-viewer";

const companyStories = [
  {
    username: "Team Offsite",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    stories: [
      { id: "offsite-1", type: "image" as const, src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=1200&fit=crop" },
      { id: "offsite-2", type: "image" as const, src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=1200&fit=crop" },
    ],
  },
  {
    username: "Hackathon '26",
    avatar: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200&h=200&fit=crop",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    stories: [
      { id: "hack-1", type: "image" as const, src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1200&fit=crop" },
      { id: "hack-2", type: "video" as const, src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
      { id: "hack-3", type: "image" as const, src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=1200&fit=crop" },
    ],
  },
  {
    username: "Office Dogs",
    avatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=200&h=200&fit=crop",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    stories: [
      { id: "dogs-1", type: "image" as const, src: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=1200&fit=crop" },
      { id: "dogs-2", type: "image" as const, src: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=1200&fit=crop" },
    ],
  },
  {
    username: "Launch Day",
    avatar: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    stories: [
      { id: "launch-1", type: "video" as const, src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
      { id: "launch-2", type: "image" as const, src: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=800&h=1200&fit=crop" },
    ],
  },
];

export default function CultureStoriesList() {
  return (
    <div className="w-full flex justify-center px-4 mt-8 mb-16">
      <div className="flex gap-6 overflow-x-auto py-4 px-2 max-w-4xl scrollbar-hide">
        {companyStories.map((user) => (
          <StoryViewer
            key={user.username}
            stories={user.stories}
            username={user.username}
            avatar={user.avatar}
            timestamp={user.timestamp}
          />
        ))}
      </div>
    </div>
  );
}
