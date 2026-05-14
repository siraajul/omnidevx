import React, { useState, useEffect } from 'react';
import { Users, Lightbulb, BookOpen, MessageSquare, Shield } from 'lucide-react';

const InteractiveSelector = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);
  
  const options = [
    {
      title: "Collaboration & Empathy",
      description: "We build together, placing humans at the center.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      icon: <Users size={24} className="text-white" />
    },
    {
      title: "Relentless Innovation",
      description: "Pushing boundaries with cutting-edge technology.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      icon: <Lightbulb size={24} className="text-white" />
    },
    {
      title: "Continuous Learning",
      description: "Always curious, always evolving.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
      icon: <BookOpen size={24} className="text-white" />
    },
    {
      title: "Radical Candor",
      description: "Honest feedback delivered with care.",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80",
      icon: <MessageSquare size={24} className="text-white" />
    },
    {
      title: "Extreme Ownership",
      description: "Taking full responsibility for outcomes.",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
      icon: <Shield size={24} className="text-white" />
    }
  ];

  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    for (let i = 0; i < options.length; i++) {
      timers.push(
        setTimeout(() => {
          setAnimatedOptions(prev => [...prev, i]);
        }, 180 * i)
      );
    }
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center py-24 bg-zinc-950 font-sans text-white w-full rounded-3xl overflow-hidden my-12 border border-zinc-800"> 
      {/* Header Section */}
      <div className="w-full max-w-2xl px-6 mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg opacity-0 animate-[fadeInFromTop_0.8s_ease-in-out_0.3s_forwards]">Our Core Principles</h2>
        <p className="text-lg md:text-xl text-[#444] font-medium max-w-xl mx-auto opacity-0 animate-[fadeInFromTop_0.8s_ease-in-out_0.6s_forwards]">The foundational values that drive how we build, interact, and succeed.</p>
      </div>

      {/* Options Container */}
      <div className="options flex flex-col md:flex-row w-full max-w-[1000px] h-[600px] md:h-[500px] mx-auto items-stretch overflow-hidden relative px-4 md:px-8">
        {options.map((option, index) => (
          <button
            type="button"
            key={option.title}
            className={`
              relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] rounded-2xl md:mx-1 my-1 md:my-0 min-h-[80px] md:min-h-0 md:min-w-[70px] border-none outline-none block text-left focus:ring-2 focus:ring-[#2A6FDB]
              ${activeIndex === index ? 'active' : ''}
            `}
            style={{
              backgroundImage: `url('${option.image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backfaceVisibility: 'hidden',
              opacity: animatedOptions.includes(index) ? 1 : 0,
              transform: animatedOptions.includes(index) ? 'translateX(0)' : 'translateX(-60px)',
              cursor: 'pointer',
              backgroundColor: '#18181b',
              boxShadow: activeIndex === index 
                ? '0 20px 60px rgba(0,0,0,0.50)' 
                : '0 10px 30px rgba(0,0,0,0.30)',
              flex: activeIndex === index ? '7 1 0%' : '1 1 0%',
              zIndex: activeIndex === index ? 10 : 1,
              willChange: 'flex-grow, box-shadow, background-size, background-position'
            }}
            onClick={() => handleOptionClick(index)}
          >
            {/* Shadow effect */}
            <div 
              className="absolute left-0 right-0 pointer-events-none transition-all duration-700 ease-in-out"
              style={{
                bottom: activeIndex === index ? '0' : '-40px',
                height: '160px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
              }}
            ></div>
            
            {/* Label with icon and info */}
            <div className="absolute left-0 right-0 bottom-6 flex items-center justify-start z-10 pointer-events-none px-4 gap-4 w-full overflow-hidden">
              <div className={`min-w-[48px] h-[48px] flex items-center justify-center rounded-full backdrop-blur-md border border-white/20 transition-all duration-500 ${activeIndex === index ? 'bg-[#111]/90 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-black/50'}`}>
                {option.icon}
              </div>
              <div className="text-white whitespace-pre relative flex-1">
                <div 
                  className="font-bold text-xl md:text-2xl transition-all duration-700 ease-in-out whitespace-normal leading-tight"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform: activeIndex === index ? 'translateX(0)' : 'translateX(20px)',
                    display: activeIndex === index ? 'block' : 'none'
                  }}
                >
                  {option.title}
                </div>
                <div 
                  className="text-sm md:text-base text-[#666] transition-all duration-700 ease-in-out mt-1 whitespace-normal leading-snug"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform: activeIndex === index ? 'translateX(0)' : 'translateX(20px)',
                    transitionDelay: '100ms',
                    display: activeIndex === index ? 'block' : 'none'
                  }}
                >
                  {option.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Custom animations using a standard style block */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideFadeIn {
          0% {
            opacity: 0;
            transform: translateX(-60px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </div>
  );
};

export default InteractiveSelector;
