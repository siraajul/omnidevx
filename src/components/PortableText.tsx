import { PortableText as PortableTextReact } from '@portabletext/react';
import React from 'react';

const components = {
  types: {
    image: ({ value }: any) => {
      // For production, we would use @sanity/image-url to parse the asset reference.
      // We'll leave it as a simple img tag for now.
      return (
        <div className="my-8">
          {/* We assume url is passed or we'd resolve it */}
          <img className="rounded-xl w-full" src={value.asset?.url || value.imageUrl || ''} alt={value.alt || 'Blog image'} />
        </div>
      );
    },
    code: ({ value }: any) => {
      return (
        <div className="my-8 rounded-xl overflow-hidden bg-[#1e1e1e] text-sm shadow-lg font-mono">
          {value.filename && (
            <div className="bg-[#2d2d2d] px-4 py-2 text-[#cccccc] border-b border-[#404040]">
              {value.filename}
            </div>
          )}
          <pre className="p-4 overflow-x-auto text-[#d4d4d4]">
            <code>{value.code}</code>
          </pre>
        </div>
      );
    },
    animatedImage: ({ value }: any) => {
      if (!value.url) return null;
      if (value.url.endsWith('.mp4') || value.url.endsWith('.webm')) {
        return (
          <div className="my-8">
            <video src={value.url} autoPlay loop muted playsInline className="rounded-xl w-full shadow-lg" />
          </div>
        );
      }
      // If it's a JSON Lottie file, we'd normally mount a player here like @dotlottie/react-player
      return (
        <div className="my-8 p-8 bg-[#f8f7f4] rounded-xl text-center border border-[#e8e5db] shadow-sm">
           <p className="text-sm font-semibold text-[#161616]">Lottie Animation:</p>
           <a href={value.url} target="_blank" rel="noreferrer" className="text-xs text-[#2A6FDB] break-all">{value.url}</a>
        </div>
      );
    }
  },
  block: {
    h2: ({ children }: any) => <h2 className="text-2xl font-bold text-[#161616] mt-10 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold text-[#161616] mt-8 mb-4">{children}</h3>,
    normal: ({ children }: any) => <p className="mb-6 leading-relaxed text-[#2A2A2A]">{children}</p>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-6 space-y-2 text-[#2A2A2A]">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-[#2A2A2A]">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold text-[#161616]">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    link: ({ children, value }: any) => (
      <a href={value.href} target="_blank" rel="noreferrer" className="text-[#2A6FDB] hover:underline">
        {children}
      </a>
    ),
  }
};

export default function PortableText({ value }: { value: any }) {
  if (!value) return null;
  return <PortableTextReact value={value} components={components} />;
}
