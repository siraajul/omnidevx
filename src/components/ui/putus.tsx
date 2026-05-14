'use client';

import React, { useEffect, useRef } from 'react';

// --- Math Utilities ---
const GRAVITY = 2200;
const easeInOutCubic = (x: number) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const easeOutQuad = (x: number) => 1 - (1 - x) * (1 - x);
const easeInQuad = (x: number) => x * x;

function getVisualTopCenter(el: HTMLElement) {
  const marker = document.createElement('div');
  marker.style.position = 'absolute';
  marker.style.top = '0';
  marker.style.left = '50%';
  marker.style.width = '1px';
  marker.style.height = '1px';
  marker.style.pointerEvents = 'none';
  marker.style.visibility = 'hidden';
  marker.style.transform = 'translate(-50%, 0)';
  
  const originalPos = el.style.position;
  const isStatic = globalThis.getComputedStyle(el).position === 'static';
  if (isStatic) el.style.position = 'relative';
  
  el.appendChild(marker);
  const rect = marker.getBoundingClientRect();
  marker.remove();
  
  if (isStatic) el.style.position = originalPos;
  
  return { x: rect.left + rect.width / 2, y: rect.top }; 
}

type PutusState = 'WANDER' | 'WANDER_PAUSE' | 'APPROACH' | 'PRE_JUMP' | 'JUMP' | 'LANDING' | 'PRESS' | 'SIT' | 'JUMP_OFF';

interface DomElements {
  container: HTMLDivElement;
  body: HTMLDivElement;
  legL: HTMLDivElement;
  legR: HTMLDivElement;
}

class PutusEngine {
  x = globalThis.window === undefined ? 0 : globalThis.window.innerWidth / 2;
  y = globalThis.window === undefined ? 0 : globalThis.window.innerHeight - 12;
  vx = 0;
  vy = 0;
  
  state: PutusState = 'WANDER';
  timer = 0;
  duration = 0;
  
  startX = this.x;
  targetX = this.x;
  startY = this.y;
  targetY = this.y;
  jumpAirTime = 0;
  jumpTime = 0;
  
  targetElement: HTMLElement | null = null;
  targetOffsetX = 0;
  targetOffsetY = 0;
  
  isFlipped = false;
  isJumpingOffFlag = false;

  scaleX = 1;
  scaleY = 1;
  bodyRot = 0;
  bodyYOffset = 0;
  legLAngle = 0;
  legRAngle = 0;

  pickTarget() {
    const elements = Array.from(document.querySelectorAll('button, a, .hero-phone, .mockup-card')) as HTMLElement[];
    const validTargets = elements.filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 20 && rect.top > 100 && rect.bottom < window.innerHeight - 100;
    });

    if (validTargets.length > 0 && Math.random() > 0.3) {
      this.targetElement = validTargets[Math.floor(Math.random() * validTargets.length)];
      const targetPos = getVisualTopCenter(this.targetElement);
      
      this.targetX = targetPos.x;
      this.targetY = targetPos.y; 
      
      const sideOffset = this.x < this.targetX ? -80 : 80;
      this.targetX = this.targetX + sideOffset;
      
      this.startX = this.x;
      this.duration = Math.max(0.5, Math.abs(this.targetX - this.startX) / 150);
      this.timer = 0;
      this.state = 'APPROACH';
    } else {
      this.targetElement = null;
      this.startX = this.x;
      this.targetX = Math.max(40, Math.min(window.innerWidth - 40, this.x + (Math.random() - 0.5) * 600));
      this.duration = Math.max(0.5, Math.abs(this.targetX - this.startX) / 150);
      this.timer = 0;
      this.state = 'WANDER';
    }
  }

  startJump(isJumpingOff = false) {
    this.startX = this.x;
    this.startY = this.y;

    if (!isJumpingOff && this.targetElement) {
      const targetPos = getVisualTopCenter(this.targetElement);
      const rect = this.targetElement.getBoundingClientRect();
      this.targetOffsetX = targetPos.x - rect.left;
      this.targetOffsetY = targetPos.y - rect.top;
      
      this.targetX = targetPos.x;
      this.targetY = targetPos.y;
    } else {
      this.targetX = Math.max(40, Math.min(window.innerWidth - 40, this.x + (Math.random() > 0.5 ? 100 : -100) + (Math.random() * 60)));
      this.targetY = window.innerHeight - 12;
    }

    const peakY = Math.min(this.startY, this.targetY) - 160 - Math.random() * 40;
    this.vy = -Math.sqrt(2 * GRAVITY * Math.abs(this.startY - peakY));
    
    const tUp = Math.abs(this.vy) / GRAVITY;
    const hFall = Math.abs(this.targetY - peakY);
    const tDown = Math.sqrt((2 * hFall) / GRAVITY);
    
    this.jumpAirTime = tUp + tDown;
    this.jumpTime = 0;
    this.vx = (this.targetX - this.startX) / this.jumpAirTime;
    
    this.state = isJumpingOff ? 'JUMP_OFF' : 'JUMP';
  }

  resetVisuals() {
    this.scaleX = 1;
    this.scaleY = 1;
    this.bodyRot = 0;
    this.bodyYOffset = 0;
    this.legLAngle = 0;
    this.legRAngle = 0;
  }

  updateWander(dt: number, walkCycle: number, walkBounce: number) {
    this.timer += dt;
    const progress = Math.min(this.timer / this.duration, 1);
    const eased = easeInOutCubic(progress);
    
    // In wander, Putus should also hop instead of slide
    this.x = this.startX + (this.targetX - this.startX) * eased;
    
    // Add a bounce to the Y position during wander
    const hopHeight = 30;
    const hopY = Math.sin(progress * Math.PI) * hopHeight;
    this.y = (window.innerHeight - 12) - hopY;

    if (progress < 1) {
      this.legLAngle = Math.sin(walkCycle * Math.PI) * 22;
      this.legRAngle = Math.sin(walkCycle * Math.PI + Math.PI) * 22;
      
      // Slight stretch during hop, squash at bottom
      const hopStretch = Math.sin(progress * Math.PI);
      this.scaleX = 1 - hopStretch * 0.1;
      this.scaleY = 1 + hopStretch * 0.15;
    }

    if (progress >= 1) {
      if (this.state === 'APPROACH') {
        this.timer = 0;
        this.state = 'PRE_JUMP';
      } else {
        this.timer = 0;
        this.duration = 0.28 + Math.random() * 0.4;
        this.state = 'WANDER_PAUSE';
      }
    }
  }

  updatePreJump(dt: number) {
    this.timer += dt;
    const preJumpDur = 0.15;
    const p = Math.min(this.timer / preJumpDur, 1);
    
    // Anticipation: Squash down before jumping
    this.scaleX = 1 + p * 0.2;
    this.scaleY = 1 - p * 0.3;
    this.bodyYOffset = p * 8;
    
    if (p >= 1) {
      if (this.targetElement && this.isJumpingOffFlag) {
         this.startJump(true);
      } else {
         this.startJump(false);
      }
    }
  }

  updateJump(dt: number) {
    this.jumpTime += dt;
    this.vy += GRAVITY * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Extreme stretch in the air based on vertical velocity
    const speed = Math.abs(this.vy) / 1000;
    this.scaleX = Math.max(0.7, 1 - speed * 0.3);
    this.scaleY = Math.min(1.4, 1 + speed * 0.4);
    
    this.legLAngle = 15;
    this.legRAngle = -15;

    if (this.y >= this.targetY && this.vy > 0) {
      this.y = this.targetY;
      this.vx = 0;
      this.vy = 0;
      this.timer = 0;
      
      if (this.state === 'JUMP') {
         this.state = 'LANDING';
      } else {
         this.state = 'LANDING'; 
         this.targetElement = null;
      }
    }
  }

  updateLanding(dt: number) {
    this.timer += dt;
    const landDur = 0.2;
    const p = Math.min(this.timer / landDur, 1);
    
    if (p < 0.4) {
      // Squash upon impact
      const p2 = p / 0.4;
      this.scaleX = 1 + easeOutQuad(p2) * 0.3;
      this.scaleY = 1 - easeOutQuad(p2) * 0.4;
      this.bodyYOffset = easeOutQuad(p2) * 8;
    } else {
      // Recover to normal
      const p2 = (p - 0.4) / 0.6;
      this.scaleX = 1.3 - easeInQuad(p2) * 0.3;
      this.scaleY = 0.6 + easeInQuad(p2) * 0.4;
      this.bodyYOffset = 8 - easeInQuad(p2) * 8;
    }

    if (p >= 1) {
      this.timer = 0;
      if (this.targetElement) {
         this.state = 'PRESS';
      } else {
         this.duration = 0.28 + Math.random() * 0.4;
         this.state = 'WANDER_PAUSE';
      }
    }
  }

  updatePress(dt: number) {
    this.timer += dt;
    const pressDur = 0.09;
    
    if (this.targetElement && this.timer <= dt) {
      this.targetElement.style.transition = 'transform 90ms ease-out';
      this.targetElement.style.transform += ' translateY(8px)';
    }

    if (this.timer >= pressDur) {
      this.timer = 0;
      this.duration = 1.4 + Math.random() * 1.4;
      this.state = 'SIT';
    }
  }

  updateSit(dt: number, t: number) {
    this.timer += dt;
    
    // Just breathing naturally
    this.scaleX = 1;
    this.scaleY = 1;
    this.bodyRot = 0; // No rotation
    this.bodyYOffset = 0;

    const swingL = Math.sin(t * 2) * 12 + 60;
    const swingR = Math.sin((t - 0.35) * 2) * 11 + 45;
    this.legLAngle = swingL;
    this.legRAngle = swingR;

    const breath = Math.sin(t * Math.PI * 1.5);
    this.scaleX += breath * 0.02;
    this.scaleY -= breath * 0.02;

    if (this.targetElement) {
       const rect = this.targetElement.getBoundingClientRect();
       this.x = rect.left + this.targetOffsetX;
       this.y = rect.top + this.targetOffsetY + 8;
    }

    if (this.timer >= this.duration) {
       this.timer = 0;
       if (this.targetElement) {
         this.targetElement.style.transition = 'transform 260ms cubic-bezier(0.34, 1.7, 0.5, 1)';
         const currentTransform = this.targetElement.style.transform;
         this.targetElement.style.transform = currentTransform.replaceAll(' translateY(8px)', '');
         
         const el = this.targetElement;
         setTimeout(() => { if (el) el.style.transition = ''; }, 260);
       }

       this.isJumpingOffFlag = true;
       this.state = 'PRE_JUMP'; 
    }
  }

  update(time: number, dt: number, dom: DomElements) {
    // We removed flipping to match the video
    this.isFlipped = false;

    this.resetVisuals();
    
    const walkCycle = (time / 1000) / 0.42;
    const walkBounce = Math.abs(Math.sin(walkCycle * Math.PI));

    switch (this.state) {
      case 'WANDER':
      case 'APPROACH':
        this.updateWander(dt, walkCycle, walkBounce);
        break;
      case 'WANDER_PAUSE':
        this.timer += dt;
        if (this.timer >= this.duration) this.pickTarget();
        break;
      case 'PRE_JUMP':
        this.updatePreJump(dt);
        break;
      case 'JUMP':
      case 'JUMP_OFF':
        this.updateJump(dt);
        break;
      case 'LANDING':
        this.updateLanding(dt);
        break;
      case 'PRESS':
        this.updatePress(dt);
        break;
      case 'SIT':
        this.updateSit(dt, time / 1000);
        break;
    }

    // Apply transforms: Note we removed scaleX(-1) flipping and body rotation
    dom.container.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
    dom.body.style.transform = `translateY(${this.bodyYOffset}px) scale(${this.scaleX}, ${this.scaleY})`;
    dom.legL.style.transform = `rotate(${this.legLAngle}deg)`;
    dom.legR.style.transform = `rotate(${this.legRAngle}deg)`;
  }
}

export function Putus() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const legLRef = useRef<HTMLDivElement>(null);
  const legRRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !bodyRef.current || !legLRef.current || !legRRef.current) return;

    const dom = {
      container: containerRef.current,
      body: bodyRef.current,
      legL: legLRef.current,
      legR: legRRef.current
    };

    let isActive = true;

    const engine = new PutusEngine();
    setTimeout(() => engine.pickTarget(), 1000);

    let lastTime = performance.now();
    const loop = (time: number) => {
      if (!isActive) return;
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      
      engine.update(time, dt, dom);
      
      if (isActive) requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    return () => {
      isActive = false;
      if (engine.targetElement) {
        engine.targetElement.style.transition = '';
        const currentTransform = engine.targetElement.style.transform;
        engine.targetElement.style.transform = currentTransform.replaceAll(' translateY(8px)', '');
      }
    };
  }, []);

  return (
    <>
      {/* Global Walkway for Putus */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-3 pointer-events-none z-[9998]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent 0px, transparent 6px, rgba(0,0,0,0.04) 6px, rgba(0,0,0,0.04) 7px)',
        }}
      />
      <div
        ref={containerRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none select-none will-change-transform"
      style={{ 
        width: '40px', 
        height: '40px',
        marginLeft: '-20px', 
        marginTop: '-40px' 
      }}
    >
      <div className="absolute bottom-0 left-0 w-full h-full">
        {/* Legs */}
        <div 
          ref={legLRef}
          className="absolute bottom-[-2px] left-[10px] w-1.5 h-3.5 bg-[#161616] rounded-full z-[-1] origin-top will-change-transform"
        />
        <div 
          ref={legRRef}
          className="absolute bottom-[-2px] right-[10px] w-1.5 h-3.5 bg-[#161616] rounded-full z-[-1] origin-top will-change-transform"
        />

        {/* Body Container */}
        <div 
          ref={bodyRef}
          className="w-full h-full relative origin-bottom will-change-transform"
        >
          {/* Blue Body Surface */}
          <div className="absolute inset-0 bg-[#2A6FDB] rounded-full border-2 border-[#161616] shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center overflow-hidden">
            {/* Face Container */}
            <div className="flex flex-col items-center mt-1 w-full relative z-10">
              
              {/* Eyes */}
              <div className="flex gap-[6px] justify-center items-center w-full">
                {/* Left Eye */}
                <div className="w-[8px] h-[8px] bg-[#161616] rounded-full relative">
                  <div className="absolute top-[1.5px] left-[1.5px] w-[2.5px] h-[2.5px] bg-white rounded-full"></div>
                </div>
                {/* Right Eye */}
                <div className="w-[8px] h-[8px] bg-[#161616] rounded-full relative">
                  <div className="absolute top-[1.5px] left-[1.5px] w-[2.5px] h-[2.5px] bg-white rounded-full"></div>
                </div>
              </div>

              {/* Simple Smile */}
              <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1">
                <path d="M 3 2 Q 9 8 15 2" stroke="#161616" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
