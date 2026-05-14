'use client';

import React, { useEffect, useRef } from 'react';

/* ============================================================
   PerchEngine — physics-driven walker that perches on
   buttons + phone. rAF + direct DOM transforms (no React
   re-renders per frame) for smooth motion.
   ============================================================ */
class PerchEngine {
  el: HTMLElement;
  root: HTMLElement;
  body: SVGElement | null;
  
  cancelled = false;
  x = 60;
  y = 0;
  dir: 1 | -1 = 1;
  bodyScaleX = 1;
  bodyScaleY = 1;
  bodyRotate = 0;
  pressedNode: HTMLElement | null = null;
  pressedOrigTransform = '';
  pressedOrigTransition = '';
  pressedOrigOrigin = '';

  CREATURE_W = 70;
  GROUND_BOTTOM = 4;
  GRAVITY = 2200;
  WALK_SPEED = 200;
  BODY_BOTTOM_INSET = 33.6;
  bodyOriginPctX = 50;

  cancelTokens: Array<() => void> = [];

  cachedWfW = 0;
  cachedWfH = 0;
  cachedMaxY = 0;

  pressedBaseRotDeg = 0;
  pressedPivotX = 0;
  pressedPivotY = 0;
  pressedContactX0 = 0;
  pressedContactY0 = 0;
  pressedContactFrac = 0;
  pressedElHalfW = 0;

  PERCH_SELECTORS = ['.pill', '.btn-primary', '.btn-ghost', '.perchable', '.phone'];

  constructor(el: HTMLElement, root: HTMLElement, body: SVGElement | null) {
    this.el = el;
    this.root = root;
    this.body = body;
    this.updateCache();
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
    this.cancelTokens.push(() => window.removeEventListener('resize', this.onResize));
  }

  stop() {
    this.cancelled = true;
    this.releasePress(true);
    this.cancelTokens.forEach((fn) => fn());
  }

  updateCache() {
    this.cachedWfW = this.root.offsetWidth;
    this.cachedWfH = this.root.offsetHeight;
    this.cachedMaxY = this.cachedWfH - this.GROUND_BOTTOM - 20;
  }

  onResize() {
    this.updateCache();
  }

  clampState() {
    if (this.x < 0) this.x = 0;
    if (this.x > this.cachedWfW - this.CREATURE_W) this.x = this.cachedWfW - this.CREATURE_W;
    if (this.y > this.cachedMaxY) this.y = this.cachedMaxY;
    if (this.y < 0) this.y = 0;
  }

  apply() {
    this.clampState();
    this.el.style.transform = `translate3d(${this.x}px, ${-this.y}px, 0) scaleX(${this.dir})`;
    if (this.body) {
      this.body.style.transformOrigin = `${this.bodyOriginPctX}% 65.7%`;
      const effectiveRot = this.bodyRotate * this.dir;
      this.body.style.transform = `rotate(${effectiveRot}deg) scaleX(${this.bodyScaleX}) scaleY(${this.bodyScaleY})`;
    }
  }

  sleep(ms: number) {
    return new Promise<void>((r) => {
      const id = setTimeout(() => r(), ms);
      this.cancelTokens.push(() => clearTimeout(id));
    });
  }

  easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  easeOutQuad(t: number) {
    return 1 - (1 - t) * (1 - t);
  }

  tween(from: number, to: number, dur: number, set: (v: number) => void, ease: (t: number) => number = (t) => t) {
    return new Promise<void>((resolve) => {
      if (dur <= 0) { set(to); return resolve(); }
      const start = performance.now();
      const step = (now: number) => {
        if (this.cancelled) return resolve();
        const p = Math.min(1, (now - start) / dur);
        set(from + (to - from) * ease(p));
        if (p < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  collectTargets() {
    const rb = this.root.getBoundingClientRect();
    const scale = rb.width / this.root.offsetWidth || 1;
    const list: { node: HTMLElement; tb: DOMRect; rb: DOMRect; scale: number }[] = [];
    this.PERCH_SELECTORS.forEach((sel) => {
      this.root.querySelectorAll<HTMLElement>(sel).forEach((node) => {
        const tb = node.getBoundingClientRect();
        const w = tb.width / scale;
        const h = tb.height / scale;
        if (w < 40 || h < 14) return;
        if (tb.top < rb.top + 30 * scale || tb.bottom > rb.bottom - 90 * scale) return;
        list.push({ node, tb, rb, scale });
      });
    });
    return list;
  }

  cumulativeRotation(node: HTMLElement) {
    let totalRot = 0;
    let walker: HTMLElement | null = node;
    while (walker && walker !== this.root) {
      const t = getComputedStyle(walker).transform;
      if (t && t !== 'none') {
        const open = t.indexOf('(');
        const close = t.lastIndexOf(')');
        if (open !== -1 && close !== -1) {
          const parts = t.slice(open + 1, close).split(',').map(Number.parseFloat);
          totalRot += Math.atan2(parts[1], parts[0]);
        }
      }
      walker = walker.parentElement;
    }
    return totalRot;
  }

  targetGeometry(entry: any, offsetFrac = 0) {
    const { tb, rb, scale, node } = entry;
    const wfH = this.root.offsetHeight;
    const elTop = (tb.top - rb.top) / scale;
    const elLeft = (tb.left - rb.left) / scale;
    const elW = tb.width / scale;
    const elH = tb.height / scale;
    const layoutH = node.offsetHeight;
    const rot = this.cumulativeRotation(node);
    const cos = Math.cos(rot);
    const cx = elLeft + elW / 2;
    const cy = elTop + elH / 2;
    const visualTopY = cy - (layoutH / 2) * Math.abs(cos);
    const visualTopXCenter = cx + (layoutH / 2) * Math.sin(rot);
    const usableHalf = Math.max(0, elW / 2 - 24);
    const visualTopX = visualTopXCenter + offsetFrac * usableHalf;
    const perchX = visualTopX - this.CREATURE_W / 2;
    const perchY = wfH - this.GROUND_BOTTOM - visualTopY - this.BODY_BOTTOM_INSET;
    return { perchX, perchY, leftX: elLeft, rightX: elLeft + elW, offsetFrac, usableHalf, elW };
  }

  async walkTo(targetX: number) {
    const startX = this.x;
    const dist = targetX - startX;
    if (Math.abs(dist) < 2) return;
    this.dir = dist >= 0 ? 1 : -1;
    this.el.classList.remove('sitting');
    this.el.classList.add('walking');
    const speed = this.WALK_SPEED * (0.9 + Math.random() * 0.3);
    const dur = Math.max(360, (Math.abs(dist) / speed) * 1000);
    const BOB_HZ = 4;
    const baseY = this.y;
    const bobCycles = (dur / 1000) * BOB_HZ;
    await this.tween(0, 1, dur, (p) => {
      this.x = startX + dist * this.easeInOutCubic(p);
      const bob = Math.abs(Math.sin(p * Math.PI * bobCycles)) * 3;
      this.y = baseY + bob;
      const compress = (1 - Math.abs(Math.sin(p * Math.PI * bobCycles))) * 0.05;
      this.bodyScaleX = 1 + compress;
      this.bodyScaleY = 1 - compress;
      this.apply();
    });
    this.y = baseY;
    this.bodyScaleX = 1; this.bodyScaleY = 1;
    this.apply();
    this.el.classList.remove('walking');
  }

  async lookAround() {
    const startRot = this.bodyRotate;
    await this.tween(0, 1, 700, (p) => {
      this.bodyRotate = startRot + Math.sin(p * Math.PI * 2) * 4;
      this.apply();
    });
    this.bodyRotate = startRot;
    this.apply();
  }

  async hopInPlace() {
    const baseY = this.y;
    this.el.classList.add('jumping');
    await this.tween(0, 1, 110, (p) => {
      this.bodyScaleX = 1 + 0.15 * p;
      this.bodyScaleY = 1 - 0.18 * p;
      this.apply();
    });
    const dur = 360;
    const start = performance.now();
    await new Promise<void>((resolve) => {
      const step = (now: number) => {
        if (this.cancelled) return resolve();
        const t = Math.min(dur, now - start) / dur;
        this.y = baseY + Math.sin(t * Math.PI) * 28;
        this.bodyScaleX = 0.95;
        this.bodyScaleY = 1.08;
        this.apply();
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
    this.y = baseY;
    await this.tween(0, 1, 110, (p) => {
      this.bodyScaleX = 1 + 0.18 * p;
      this.bodyScaleY = 1 - 0.2 * p;
      this.apply();
    });
    await this.tween(1, 0, 160, (p) => {
      this.bodyScaleX = 1 + 0.18 * p;
      this.bodyScaleY = 1 - 0.2 * p;
      this.apply();
    }, this.easeOutQuad.bind(this));
    this.bodyScaleX = 1; this.bodyScaleY = 1;
    this.apply();
    this.el.classList.remove('jumping');
  }

  async physicsJump(toX: number, toY: number, clearance = 110) {
    const fromX = this.x, fromY = this.y;
    const dx = toX - fromX;
    if (dx !== 0) this.dir = dx > 0 ? 1 : -1;
    this.el.classList.remove('sitting');
    this.el.classList.add('jumping');

    await this.tween(0, 1, 110, (p) => {
      this.bodyScaleX = 1 + 0.18 * p;
      this.bodyScaleY = 1 - 0.22 * p;
      this.apply();
    });
    await this.tween(1, 0, 90, (p) => {
      this.bodyScaleX = 1 + 0.18 * p - 0.05 * (1 - p);
      this.bodyScaleY = 1 - 0.22 * p + 0.1 * (1 - p);
      this.apply();
    });
    this.bodyScaleX = 0.95;
    this.bodyScaleY = 1.08;

    const rbJ = this.root.getBoundingClientRect();
    const scaleJ = rbJ.width / this.root.offsetWidth || 1;
    const wfHJ = this.root.offsetHeight;
    let maxTopY = Math.max(fromY, toY);
    const loX = Math.min(fromX, toX);
    const hiX = Math.max(fromX, toX);
    this.PERCH_SELECTORS.forEach((sel) => {
      this.root.querySelectorAll<HTMLElement>(sel).forEach((node) => {
        const tb = node.getBoundingClientRect();
        const elL = (tb.left - rbJ.left) / scaleJ;
        const elR = (tb.right - rbJ.left) / scaleJ;
        const elT = (tb.top - rbJ.top) / scaleJ;
        if (elR < loX - 30 || elL > hiX + 30) return;
        const yFromBottom = wfHJ - this.GROUND_BOTTOM - elT;
        if (yFromBottom > maxTopY) maxTopY = yFromBottom;
      });
    });
    const maxPeakY = wfHJ - this.GROUND_BOTTOM - 40;
    const peakAboveStart = Math.min(maxPeakY - fromY, (maxTopY - fromY) + clearance);
    const vy = Math.sqrt(2 * this.GRAVITY * Math.max(10, peakAboveStart));
    const a = 0.5 * this.GRAVITY;
    const b = -vy;
    const c = toY - fromY;
    const disc = b * b - 4 * a * c;
    if (disc < 0) {
      this.el.classList.remove('jumping');
      return;
    }
    const T = (-b + Math.sqrt(disc)) / (2 * a);
    const vx = (toX - fromX) / T;

    const start = performance.now();
    await new Promise<void>((resolve) => {
      const step = (now: number) => {
        if (this.cancelled) return resolve();
        const t = Math.min(T, (now - start) / 1000);
        this.x = fromX + vx * t;
        this.y = fromY + vy * t - 0.5 * this.GRAVITY * t * t;
        const phase = t / T;
        this.bodyScaleX = 0.95 + 0.05 * Math.sin(phase * Math.PI);
        this.bodyScaleY = 1.08 - 0.1 * Math.sin(phase * Math.PI);
        this.apply();
        if (t < T) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });

    this.x = toX;
    this.y = toY;
    this.el.classList.remove('jumping');

    await this.tween(0, 1, 110, (p) => {
      this.bodyScaleX = 1 + 0.22 * p;
      this.bodyScaleY = 1 - 0.2 * p;
      this.apply();
    });
    await this.tween(1, 0, 180, (p) => {
      this.bodyScaleX = 1 + 0.22 * p;
      this.bodyScaleY = 1 - 0.2 * p;
      this.apply();
    }, this.easeOutQuad.bind(this));
    this.bodyScaleX = 1;
    this.bodyScaleY = 1;
    this.apply();
  }

  beginPress(node: HTMLElement, contactFracX: number) {
    if (this.pressedNode && this.pressedNode !== node) this.releasePress(true);
    this.pressedNode = node;
    this.pressedOrigTransform = node.style.transform || '';
    this.pressedOrigTransition = node.style.transition || '';
    this.pressedOrigOrigin = node.style.transformOrigin || '';
    this.pressedContactFrac = contactFracX;
    const computed = getComputedStyle(node).transform;
    this.pressedBaseRotDeg = 0;
    if (computed && computed !== 'none') {
      const open = computed.indexOf('(');
      const close = computed.lastIndexOf(')');
      if (open !== -1 && close !== -1) {
        const parts = computed.slice(open + 1, close).split(',').map(Number.parseFloat);
        this.pressedBaseRotDeg = (Math.atan2(parts[1], parts[0]) * 180) / Math.PI;
      }
    }
    const tb = node.getBoundingClientRect();
    const rb = this.root.getBoundingClientRect();
    const scale = rb.width / this.root.offsetWidth || 1;
    const elW = tb.width / scale;
    const elH = tb.height / scale;
    const elLeft = (tb.left - rb.left) / scale;
    const elTop = (tb.top - rb.top) / scale;
    this.pressedPivotX = elLeft + elW / 2;
    this.pressedPivotY = elTop + elH / 2;
    const layoutH = node.offsetHeight;
    const layoutW = node.offsetWidth;
    const baseRotRad = (this.pressedBaseRotDeg * Math.PI) / 180;
    const cosB = Math.cos(baseRotRad);
    const sinB = Math.sin(baseRotRad);
    const visualTopY = this.pressedPivotY - (layoutH / 2) * Math.abs(cosB);
    const visualTopX = this.pressedPivotX + (layoutH / 2) * sinB;
    const usableHalf = Math.max(0, layoutW / 2 - 24);
    this.pressedContactX0 = visualTopX + contactFracX * usableHalf * cosB;
    this.pressedContactY0 = visualTopY + contactFracX * usableHalf * sinB;
    this.pressedElHalfW = layoutW / 2;
    node.style.transformOrigin = '50% 50%';
    node.style.transition = 'transform 0s linear';
  }

  contactAfterTilt(tiltDeg: number) {
    const rad = (tiltDeg * Math.PI) / 180;
    const dx0 = this.pressedContactX0 - this.pressedPivotX;
    const dy0 = this.pressedContactY0 - this.pressedPivotY;
    const cosT = Math.cos(rad);
    const sinT = Math.sin(rad);
    const newDx = dx0 * cosT - dy0 * sinT;
    const newDy = dx0 * sinT + dy0 * cosT;
    return { x: this.pressedPivotX + newDx, y: this.pressedPivotY + newDy };
  }

  updatePress(depth: number, tiltDeg: number) {
    if (!this.pressedNode) return;
    let effectiveTilt = tiltDeg;
    if (this.pressedNode.classList.contains('android-cta')) {
      effectiveTilt = -tiltDeg;
    }
    const totalRot = this.pressedBaseRotDeg + effectiveTilt;
    this.pressedNode.style.transform = `translateY(${depth}px) rotate(${totalRot}deg)`;
  }

  releasePress(snap = false) {
    if (!this.pressedNode) return;
    const node = this.pressedNode;
    const origT = this.pressedOrigTransform;
    const origTr = this.pressedOrigTransition;
    const origO = this.pressedOrigOrigin;
    this.pressedNode = null;
    if (snap) {
      node.style.transition = origTr;
      node.style.transform = origT;
      node.style.transformOrigin = origO;
      return;
    }
    node.style.transition = 'transform 0.26s cubic-bezier(0.34, 1.7, 0.5, 1)';
    node.style.transform = origT;
    const restoreTimer = setTimeout(() => {
      node.style.transformOrigin = origO;
    }, 300);
    this.cancelTokens.push(() => clearTimeout(restoreTimer));
    const id = setTimeout(() => {
      if (this.pressedNode !== node) node.style.transition = origTr;
    }, 280);
    this.cancelTokens.push(() => clearTimeout(id));
  }

  async idleBob(durMs: number, surfaceTiltStart = 0, surfaceTiltEnd = 0, trackContact = false) {
    const baseY = this.y;
    const baseX = this.x;
    const baseRot = -surfaceTiltStart * 0.4;
    const baseScaleX = this.bodyScaleX || 1;
    const baseScaleY = this.bodyScaleY || 1;
    const wfHLocal = this.root.offsetHeight;

    await this.tween(0, 1, 280, (p) => {
      this.bodyScaleX = baseScaleX + 0.06 * p;
      this.bodyScaleY = baseScaleY - 0.1 * p;
      this.bodyRotate = baseRot;
      this.apply();
    }, this.easeOutQuad.bind(this));

    const start = performance.now();
    const slideDir = this.pressedContactFrac > 0 ? 1 : -1;
    const elementHalfWidth = this.pressedElHalfW;
    const initialOffsetU = this.pressedContactFrac * Math.max(0, elementHalfWidth - 24);
    const baseRotRad = (this.pressedBaseRotDeg * Math.PI) / 180;
    const cosB = Math.cos(baseRotRad);
    const sinB = Math.sin(baseRotRad);
    const layoutHL = this.pressedNode ? this.pressedNode.offsetHeight : 0;
    const topCenterX = this.pressedPivotX + (layoutHL / 2) * sinB;
    const topCenterY = this.pressedPivotY - (layoutHL / 2) * Math.abs(cosB);

    await new Promise<void>((resolve) => {
      const step = (now: number) => {
        if (this.cancelled) return resolve();
        const elapsed = now - start;
        const p = Math.min(1, elapsed / durMs);
        const t = elapsed / 1000;

        const curTilt = surfaceTiltStart + (surfaceTiltEnd - surfaceTiltStart) * this.easeInOutCubic(p);

        if (trackContact && this.pressedNode) {
          const slideFrac = p * p;
          const targetEdgeU = slideDir * elementHalfWidth;
          const curOffsetU = initialOffsetU + (targetEdgeU - initialOffsetU) * slideFrac;

          const surfaceX = topCenterX + curOffsetU * cosB;
          const surfaceY = topCenterY + curOffsetU * sinB;

          const rad = (curTilt * Math.PI) / 180;
          const dx0 = surfaceX - this.pressedPivotX;
          const dy0 = surfaceY - this.pressedPivotY;
          const newX = this.pressedPivotX + dx0 * Math.cos(rad) - dy0 * Math.sin(rad);
          const newY = this.pressedPivotY + dx0 * Math.sin(rad) + dy0 * Math.cos(rad);
          this.x = newX - this.CREATURE_W / 2;
          this.y = wfHLocal - this.GROUND_BOTTOM - newY - this.BODY_BOTTOM_INSET - 8 + Math.sin(t * 2) * 0.8;

          this.updatePress(8, curTilt);

          if (Math.abs(curOffsetU) >= elementHalfWidth * 0.95) {
            this.apply();
            return resolve();
          }
        } else {
          this.y = baseY + Math.sin(t * 2) * 0.8;
          this.x = baseX;
        }
        this.bodyScaleX = 1.04 + Math.sin(t * 2) * 0.015;
        this.bodyScaleY = 0.92 - Math.sin(t * 2) * 0.015;
        this.bodyRotate = -curTilt * 0.4 + Math.sin(t * 1.4) * 1.2;

        if (!(trackContact && this.pressedNode)) this.updatePress(8, curTilt);
        this.apply();
        if (p >= 1) return resolve();
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });

    const heldRot = this.bodyRotate;
    await this.tween(0, 1, 180, (p) => {
      this.bodyScaleX = 1.04 + (1 - 1.04) * p;
      this.bodyScaleY = 0.92 + (1 - 0.92) * p;
      this.bodyRotate = heldRot;
      this.apply();
    }, this.easeOutQuad.bind(this));
    this.bodyScaleX = 1;
    this.bodyScaleY = 1;
    this.apply();
  }

  pickTarget() {
    this.updateCache();
    const list = this.collectTargets();
    if (!list.length) return null;
    return list[Math.floor(Math.random() * list.length)];
  }

  async doPerchSitAndFall(entry: any, offsetFrac: number) {
    this.el.classList.add('sitting');
    const willFall = true;
    const PRESS_DEPTH = 8;
    const initialTilt = Math.max(-2, Math.min(2, offsetFrac * 3));
    const FINAL_TILT_MAX = willFall ? 30 : 18;
    const finalTilt = Math.max(-FINAL_TILT_MAX, Math.min(FINAL_TILT_MAX, offsetFrac * (willFall ? 40 : 24)));
    const contactFracX = offsetFrac;

    this.beginPress(entry.node, contactFracX);
    this.bodyOriginPctX = 50;

    const wfH = this.root.offsetHeight;
    await this.tween(0, 1, 260, (p) => {
      const e = 1 - Math.pow(1 - p, 2);
      const curDepth = PRESS_DEPTH * e;
      const curTilt = initialTilt * e;
      this.updatePress(curDepth, curTilt);
      const c = this.contactAfterTilt(curTilt);
      this.x = c.x - this.CREATURE_W / 2;
      this.y = wfH - this.GROUND_BOTTOM - c.y - this.BODY_BOTTOM_INSET - curDepth;
      this.bodyRotate = -curTilt * 0.4;
      this.apply();
    });

    const sitDur = 2600 + Math.random() * 800;
    await this.idleBob(sitDur, initialTilt, finalTilt, true);

    const wobbleDur = 400;
    const fallDir = offsetFrac > 0 ? 1 : -1;
    const wobBase = this.bodyRotate;
    await this.tween(0, 1, wobbleDur, (p) => {
      const flutter = Math.sin(p * Math.PI * 4) * (1 - p) * 4;
      const commit = fallDir * p * 18;
      this.bodyRotate = wobBase + flutter + commit;
      this.apply();
    });
    
    return fallDir;
  }

  async doTumbleFall(fallDir: number) {
    this.dir = fallDir as 1 | -1;
    this.el.classList.remove('sitting');
    this.el.classList.add('jumping');
    this.releasePress();

    const fallStartX = this.x;
    const fallStartY = this.y;
    const fallStartRot = this.bodyRotate;
    const tumbleVy = 200;
    const tumbleVx = fallDir * (220 + Math.random() * 80);
    const T = (tumbleVy + Math.sqrt(tumbleVy * tumbleVy + 2 * this.GRAVITY * Math.max(0, fallStartY))) / this.GRAVITY;
    const landingRot = fallDir * 180;
    const tumbleStart = performance.now();
    
    await new Promise<void>((resolve) => {
      const step = (now: number) => {
        if (this.cancelled) return resolve();
        const t = Math.min(T, (now - tumbleStart) / 1000);
        this.x = fallStartX + tumbleVx * t;
        this.y = fallStartY + tumbleVy * t - 0.5 * this.GRAVITY * t * t;
        const rotP = t / T;
        this.bodyRotate = fallStartRot + (landingRot - fallStartRot) * rotP;
        this.bodyScaleX = 0.95;
        this.bodyScaleY = 1.05;
        this.apply();
        if (t < T) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
    
    return landingRot;
  }

  async doLandingSequence(landingRot: number) {
    this.y = 0;
    this.bodyOriginPctX = 50;
    this.bodyRotate = landingRot;
    this.el.classList.remove('jumping');
    this.el.classList.add('sitting');
    this.apply();

    await this.tween(0, 1, 90, (p) => {
      this.bodyScaleX = 1 + 0.36 * p;
      this.bodyScaleY = 1 - 0.34 * p;
      this.apply();
    });
    await this.tween(0, 1, 220, (p) => {
      const eOut = 1 - Math.pow(1 - p, 2);
      const lift = Math.sin(p * Math.PI) * 28;
      this.y = lift;
      this.bodyScaleX = (1 + 0.36) + (0.95 - (1 + 0.36)) * eOut;
      this.bodyScaleY = (1 - 0.34) + (1.06 - (1 - 0.34)) * eOut;
      this.apply();
    });
    this.y = 0;
    this.bodyScaleX = 1; this.bodyScaleY = 1;
    this.apply();
    
    const wiggleStart = performance.now();
    await new Promise<void>((resolve) => {
      const step = (now: number) => {
        if (this.cancelled) return resolve();
        const e = now - wiggleStart;
        if (e >= 600) return resolve();
        const ts = e / 1000;
        this.bodyRotate = landingRot + Math.sin(ts * 8) * 4;
        this.apply();
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });

    const standFrom = this.bodyRotate;
    let standDelta = -standFrom;
    while (standDelta > 180) standDelta -= 360;
    while (standDelta < -180) standDelta += 360;
    this.el.classList.remove('sitting');
    
    await this.tween(0, 1, 420, (p) => {
      const e = 1 - Math.pow(1 - p, 3);
      this.bodyRotate = standFrom + standDelta * e;
      const squash = Math.sin(p * Math.PI) * 0.08;
      this.bodyScaleX = 1 + squash;
      this.bodyScaleY = 1 - squash;
      this.apply();
    });
    this.bodyRotate = 0; this.bodyScaleX = 1; this.bodyScaleY = 1;
    this.apply();
    await this.sleep(280);
  }

  async runSingleCycle() {
    const entry = this.pickTarget();
    if (!entry) { await this.sleep(600); return; }

    const offsetSign = Math.random() < 0.5 ? -1 : 1;
    const offsetFrac = offsetSign * (0.4 + Math.random() * 0.3);
    const g = this.targetGeometry(entry, offsetFrac);

    const fromSide = g.perchX > this.x ? -1 : 1;
    const approachX = g.perchX + fromSide * 80;
    await this.walkTo(approachX);
    if (this.cancelled) return;
    await this.sleep(120);

    await this.physicsJump(g.perchX, g.perchY, 80);
    if (this.cancelled) return;

    const fallDir = await this.doPerchSitAndFall(entry, offsetFrac);
    if (this.cancelled) return;

    const landingRot = await this.doTumbleFall(fallDir);
    if (this.cancelled) return;

    await this.doLandingSequence(landingRot);
    if (this.cancelled) return;

    const wfW = this.root.offsetWidth;
    const wanderX = 40 + Math.random() * (wfW - 120);
    await this.walkTo(wanderX);

    const r = Math.random();
    if (r < 0.35) {
      await this.lookAround();
    } else if (r < 0.55) {
      await this.hopInPlace();
    }
    await this.sleep(280 + Math.random() * 400);
  }

  async loop() {
    this.x = 60;
    this.y = 0;
    this.dir = 1;
    this.apply();
    while (!this.cancelled) {
      await this.runSingleCycle();
    }
  }
}

function PerchCreature({ color = '#2a6fdb' }: Readonly<{ color?: string }>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const root = el?.closest('.wf') as HTMLElement | null;
    const body = el?.querySelector('.body') as SVGElement | null;
    if (!el || !root) return;

    const engine = new PerchEngine(el, root, body);
    engine.loop();

    return () => {
      engine.stop();
    };
  }, []);

  return (
    <div ref={ref} className="creature">
      {/* Everything lives in ONE SVG so the body never paints over the legs.
          ViewBox 0..100 wide, 0..140 tall — extra 40 units below the body
          (y=92) are reserved for dangling legs when sitting. */}
      <svg className="body" viewBox="0 0 100 140" width="70" height="98">
        {/* Walking/standing/jumping legs — straight sticks under the body */}
        <g className="leg-stand l">
          <line x1="40" y1="88" x2="40" y2="108" stroke="#111" strokeWidth="6" strokeLinecap="round" />
        </g>
        <g className="leg-stand r">
          <line x1="60" y1="88" x2="60" y2="108" stroke="#111" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* Sitting legs — jointed thigh + shin + ankle SOCK + foot.
            Outer <g> rotates the THIGH around the hip;
            inner <g> rotates the SHIN+SOCK+FOOT around the knee. */}
        <g className="leg-sit near">
          <g className="thigh-pivot">
            {/* thigh: hip (44,88) → knee (44,106) */}
            <line x1="44" y1="88" x2="44" y2="106" stroke="#111" strokeWidth="6" strokeLinecap="round" />
            {/* knee dot */}
            <circle cx="44" cy="106" r="3.5" fill="#111" />
            <g className="shin-pivot" style={{ transformOrigin: '44px 106px' }}>
              {/* shin: knee (44,106) → ankle (44,122) */}
              <line x1="44" y1="106" x2="44" y2="122" stroke="#111" strokeWidth="6" strokeLinecap="round" />
              {/* BLUE SOCK — colored cuff at the ankle, on top of shin stroke */}
              <rect x="40" y="118" width="8" height="8" rx="2" fill={color} stroke="#111" strokeWidth="1.5" />
              {/* foot: small ellipse pointing forward */}
              <ellipse cx="46" cy="128" rx="6" ry="3" fill="#111" />
            </g>
          </g>
        </g>
        <g className="leg-sit far">
          <g className="thigh-pivot">
            <line x1="56" y1="88" x2="56" y2="106" stroke="#111" strokeWidth="6" strokeLinecap="round" />
            <circle cx="56" cy="106" r="3.5" fill="#111" />
            <g className="shin-pivot" style={{ transformOrigin: '56px 106px' }}>
              <line x1="56" y1="106" x2="56" y2="122" stroke="#111" strokeWidth="6" strokeLinecap="round" />
              <rect x="52" y="118" width="8" height="8" rx="2" fill={color} stroke="#111" strokeWidth="1.5" />
              <ellipse cx="58" cy="128" rx="6" ry="3" fill="#111" />
            </g>
          </g>
        </g>

        {/* Body — rendered LAST so it paints on top of the leg roots,
            cleanly hiding the "hip" portion behind the body silhouette */}
        <path
          d="M50 8 C 78 8 92 32 92 54 C 92 78 74 92 50 92 C 26 92 8 78 8 54 C 8 32 22 8 50 8 Z"
          fill={color}
          stroke="#111"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="38" cy="48" r="5" fill="#111" />
        <circle cx="64" cy="48" r="5" fill="#111" />
        <path
          d="M38 66 Q 50 76 64 66"
          stroke="#111"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="36" cy="46" r="1.4" fill="#fff" />
        <circle cx="62" cy="46" r="1.4" fill="#fff" />
      </svg>
    </div>
  );
}

/* ─── Phone Mockup (matches wireframe) ─── */
function PhoneMock() {
  const [isFlipped, setIsFlipped] = React.useState(false);
  return (
    <button
      className="phone-wrap"
      type="button"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, outline: 'none', textAlign: 'left' }}
    >
      <div className="phone">
        <div className="phone-flipper" style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          <div className="phone-face phone-front">
            <div className="screen">
              <div className="app-header">
                <span>◀ Omnidevx</span>
                <span>· · ·</span>
              </div>
              <div className="app-headline">Intelligence.</div>
              <div className="app-sub">Built right in.</div>
              <div className="placeholder">[ product screen ]</div>
              <div className="placeholder small">[ list row ]</div>
              <div className={`app-cta ${isFlipped ? '' : 'perchable'}`}>Start building</div>
            </div>
          </div>
          <div className="phone-face phone-back">
            <div className="screen">
              <div className="app-header android">
                <span>≡</span>
                <span style={{flex: 1, textAlign: 'center', fontWeight: 'bold'}}>Omnidevx</span>
                <span>⋮</span>
              </div>
              <div className="app-headline">Any platform.</div>
              <div className="app-sub">Materially better.</div>
              <div className="placeholder">[ android widget ]</div>
              <div className="placeholder small">[ list row ]</div>
              <div className={`app-cta android-cta ${isFlipped ? 'perchable' : ''}`}>DOWNLOAD</div>
            </div>
          </div>
        </div>
      </div>
      <svg className="phone-doodle" viewBox="0 0 120 80">
        <path
          d="M10 60 Q 50 10 100 30"
          stroke="#2a6fdb"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="3 4"
        />
        <path
          d="M92 22 L 100 30 L 92 38"
          stroke="#2a6fdb"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <div className="phone-annot">click to flip ↺</div>
    </button>
  );
}

/* ─── Hero Section ─── */
export default function OmnidevxHero() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section ref={containerRef} className="hero-wireframe-section">
      <div className="wf">
        {/* nav row */}
        <div className="wf-nav">
          <div className="logo">
            Omnidev<span style={{ color: '#2a6fdb' }}>X</span>
          </div>
          <div className="links">
            <span>Work</span>
            <span>Process</span>
            <span>Team</span>
            <span>Contact</span>
          </div>
          <div className="cta">Start a project</div>
        </div>

        {/* main grid */}
        <div className="wf-pad">
          <div className="left-col">
            <span className="pill">↳ The AI-first studio</span>
            <h1 className="headline">
              Powered by AI. <span className="scribble-underline accent">Engineered</span> for performance.
            </h1>
            <p className="sub">
              Intelligence isn’t an add-on. It’s our main engine. We craft enterprise-grade software and platforms driven by state-of-the-art AI.
            </p>
            <div className="row">
              <a className="btn-primary" href="/contact">Get started.</a>
              <a className="btn-ghost" href="/portfolio">Learn more.</a>
            </div>
            <div className="stat-strip">
              <div><b>50+</b> Platforms shipped.</div>
              <div><b>10x</b> Faster delivery.</div>
              <div><b>99.9%</b> Reliability.</div>
            </div>
          </div>

          <PhoneMock />
        </div>

        {/* ground strip — Putus's playground */}
        <div className="ground">
          <div className="putus-label">
            <span className="putus-tag">✦ meet putus</span>
            <span className="putus-line">your future AI pet — motivates you, listens, gets you</span>
          </div>
        </div>

        {/* the perch creature */}
        <PerchCreature color="#2a6fdb" />
      </div>

      <style>{`
        .hero-wireframe-section {
          position: relative;
          width: 100%;
          min-height: 760px;
          background: #f7f5ef;
          font-family: "Patrick Hand", sans-serif;
          color: #1a1a1a;
        }
        .hero-wireframe-section * { box-sizing: border-box; }

        .hero-wireframe-section .wf {
          position: relative;
          width: 100%;
          min-height: 760px;
          background:
            radial-gradient(rgba(0,0,0,0.067) 1px, transparent 1px) 0 0 / 22px 22px,
            #fdfcf7;
          overflow: hidden;
          color: #161616;
        }

        .hero-wireframe-section .wf-pad {
          padding: 96px 64px 120px;
          min-height: 760px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 48px;
          align-items: center;
        }

        .hero-wireframe-section .wf-nav {
          position: absolute;
          top: 22px;
          left: 64px;
          right: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: "Kalam", cursive;
          font-size: 18px;
          color: #444;
          z-index: 4;
        }
        .hero-wireframe-section .wf-nav .logo {
          font-family: "Caveat", cursive;
          font-size: 26px;
          font-weight: 700;
          color: #111;
        }
        .hero-wireframe-section .wf-nav .links { display: flex; gap: 24px; }
        .hero-wireframe-section .wf-nav .links span {
          border-bottom: 1.5px dashed #888;
          padding-bottom: 2px;
          cursor: pointer;
        }
        .hero-wireframe-section .wf-nav .cta {
          border: 2px solid #111;
          padding: 6px 14px;
          border-radius: 22px;
          font-family: "Kalam", cursive;
          transform: rotate(-1.5deg);
          cursor: pointer;
        }

        .hero-wireframe-section .pill {
          display: inline-block;
          border: 1.8px solid #111;
          border-radius: 999px;
          padding: 4px 12px;
          font-family: "Kalam", cursive;
          font-size: 16px;
          background: #fff;
          transform: rotate(-2deg);
          will-change: transform;
        }
        .hero-wireframe-section .scribble-underline {
          position: relative;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 12'><path d='M2 8 Q 30 2 60 7 T 120 7 T 198 6' stroke='%232a6fdb' stroke-width='3' fill='none' stroke-linecap='round'/></svg>");
          background-repeat: no-repeat;
          background-position: 0 92%;
          background-size: 100% 12px;
          padding-bottom: 6px;
        }
        .hero-wireframe-section .accent { color: #2a6fdb; }

        .hero-wireframe-section h1.headline {
          font-family: "Caveat", cursive;
          font-weight: 700;
          font-size: 64px;
          line-height: 1.05;
          margin: 18px 0 14px;
          letter-spacing: 0.2px;
        }
        .hero-wireframe-section p.sub {
          font-family: "Patrick Hand", sans-serif;
          font-size: 22px;
          line-height: 1.35;
          color: #2a2a2a;
          max-width: 520px;
        }
        .hero-wireframe-section .row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 22px;
          flex-wrap: wrap;
        }
        .hero-wireframe-section .btn-primary {
          border: 2.2px solid #111;
          background: #111;
          color: #fff;
          padding: 12px 22px;
          border-radius: 999px;
          font-family: "Kalam", cursive;
          font-size: 18px;
          transform: rotate(-1deg);
          text-decoration: none;
          display: inline-block;
          cursor: pointer;
          will-change: transform;
        }
        .hero-wireframe-section .btn-ghost {
          border: 2.2px dashed #111;
          background: transparent;
          color: #111;
          padding: 12px 22px;
          border-radius: 999px;
          font-family: "Kalam", cursive;
          font-size: 18px;
          transform: rotate(1deg);
          text-decoration: none;
          display: inline-block;
          cursor: pointer;
          will-change: transform;
        }
        .hero-wireframe-section .stat-strip {
          display: flex;
          gap: 22px;
          margin-top: 28px;
          flex-wrap: wrap;
          font-family: "Kalam", cursive;
          font-size: 18px;
        }
        .hero-wireframe-section .stat-strip b {
          font-family: "Caveat", cursive;
          font-size: 30px;
          display: block;
        }

        /* phone */
        .hero-wireframe-section .phone-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .hero-wireframe-section .phone {
          width: 260px;
          height: 530px;
          position: relative;
          perspective: 1200px;
          transform: rotate(3deg);
          will-change: transform;
        }
        .hero-wireframe-section .phone-flipper {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hero-wireframe-section .phone-face {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 3px solid #111;
          border-radius: 38px;
          background: #fff;
          box-shadow: 6px 8px 0 rgba(17,17,17,0.13);
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .hero-wireframe-section .phone-face.phone-back {
          transform: rotateY(180deg);
        }
        .hero-wireframe-section .phone-face.phone-front::before {
          content: "";
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 70px;
          height: 16px;
          border: 2px solid #111;
          border-radius: 999px;
          background: #f3f0e6;
        }
        .hero-wireframe-section .phone-face.phone-back::before {
          content: "";
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: 10px;
          height: 10px;
          border: 2px solid #111;
          border-radius: 50%;
          background: #111;
        }
        .hero-wireframe-section .phone-face .screen {
          margin-top: 30px;
          flex: 1;
          border: 2px dashed #888;
          border-radius: 22px;
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: repeating-linear-gradient(45deg, #fafaf3 0 10px, #f4f1e6 10px 20px);
        }
        .hero-wireframe-section .phone-face.phone-back .screen {
          background: repeating-linear-gradient(135deg, #f0f7f4 0 10px, #e6f3eb 10px 20px);
          border-radius: 8px;
          margin-top: 24px;
        }
        .hero-wireframe-section .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: "Kalam", cursive;
          font-size: 13px;
          color: #444;
        }
        .hero-wireframe-section .app-header.android {
          font-family: "Patrick Hand", sans-serif;
          font-size: 18px;
          color: #222;
        }
        .hero-wireframe-section .app-headline {
          font-family: "Caveat", cursive;
          font-weight: 700;
          font-size: 28px;
          line-height: 1.05;
          color: #111;
          margin-top: 6px;
        }
        .hero-wireframe-section .app-sub {
          font-family: "Patrick Hand", sans-serif;
          font-size: 14px;
          color: #333;
          line-height: 1.25;
        }
        .hero-wireframe-section .app-cta {
          margin-top: auto;
          border: 2px solid #111;
          background: #111;
          color: #fff;
          border-radius: 12px;
          text-align: center;
          padding: 10px 0;
          font-family: "Kalam", cursive;
          font-size: 15px;
          cursor: pointer;
          will-change: transform;
        }
        .hero-wireframe-section .app-cta.android-cta {
          border-radius: 4px;
          background: #2a6fdb;
          border-color: #2a6fdb;
          color: white;
          text-transform: uppercase;
          font-family: "Patrick Hand", sans-serif;
          letter-spacing: 1px;
        }
        .hero-wireframe-section .placeholder {
          border: 1.5px dashed #888;
          border-radius: 10px;
          height: 70px;
          background: repeating-linear-gradient(45deg, transparent 0 6px, rgba(0,0,0,0.063) 6px 7px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Kalam", cursive;
          font-size: 12px;
          color: #666;
        }
        .hero-wireframe-section .placeholder.small { height: 42px; }

        .hero-wireframe-section .phone-doodle {
          position: absolute;
          left: -90px;
          top: 30px;
          width: 120px;
          height: 80px;
        }
        .hero-wireframe-section .phone-annot {
          position: absolute;
          left: -130px;
          top: 8px;
          width: 120px;
          transform: rotate(-6deg);
          font-family: "Gloria Hallelujah", cursive;
          font-size: 14px;
          color: #2a6fdb;
        }

        /* ground strip — Putus's lane */
        .hero-wireframe-section .ground {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 80px;
          border-top: 2px dashed #111;
          background: repeating-linear-gradient(135deg, #fbfaf1 0 10px, #f1ecdb 10px 20px);
          z-index: 1;
        }
        .hero-wireframe-section .putus-label {
          position: absolute;
          left: 24px;
          top: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: "Kalam", cursive;
          font-size: 13px;
          color: #444;
        }
        .hero-wireframe-section .putus-tag {
          display: inline-block;
          background: #2a6fdb;
          color: #fff;
          padding: 2px 10px;
          border-radius: 999px;
          font-family: "Caveat", cursive;
          font-size: 18px;
          font-weight: 700;
          transform: rotate(-3deg);
          box-shadow: 2px 2px 0 #111;
          letter-spacing: 0.3px;
        }
        .hero-wireframe-section .putus-line {
          font-family: "Patrick Hand", sans-serif;
          font-size: 15px;
          color: #2a2a2a;
        }
        .hero-wireframe-section .putus-hint {
          font-family: "Gloria Hallelujah", cursive;
          font-size: 12px;
          color: #2a6fdb;
          margin-left: 4px;
        }
        @media (max-width: 768px) {
          .hero-wireframe-section .putus-line,
          .hero-wireframe-section .putus-hint { display: none; }
        }

        /* CREATURE — container is 70x98 to fit the dangling sitting legs.
           Legs live INSIDE the body SVG so the body paints behind their roots.
           bottom: 4px puts the creature deep INSIDE the 80px dashed ground strip
           (Putus walks on the striped lane, not above the dashed line). */
        .hero-wireframe-section .creature {
          position: absolute;
          bottom: 4px;
          left: 0;
          width: 70px;
          height: 98px;
          will-change: transform;
          z-index: 5;
          pointer-events: none;
        }
        .hero-wireframe-section .creature .body {
          width: 100%;
          height: 100%;
          display: block;
          /* Squash origin at the painted body bottom (y=92 in 140-tall viewBox = 65.7%)
             so the painted bottom stays planted during sit. */
          transform-origin: 50% 65.7%;
          overflow: visible;
        }

        /* Show/hide the two leg sets via class flip — no JS state per leg. */
        .hero-wireframe-section .creature .leg-stand { display: inline; }
        .hero-wireframe-section .creature .leg-sit { display: none; }
        .hero-wireframe-section .creature.sitting .leg-stand { display: none; }
        .hero-wireframe-section .creature.sitting .leg-sit { display: inline; }

        /* SVG leg transforms — anchored at the hip (top of each line),
           use transform-box: fill-box so % origins work in SVG. */
        .hero-wireframe-section .creature .leg-stand {
          transform-box: fill-box;
          transform-origin: center top;
          transition: transform 0.2s ease;
        }
        .hero-wireframe-section .creature.walking .leg-stand.l { animation: wf-walkL 0.42s ease-in-out infinite; }
        .hero-wireframe-section .creature.walking .leg-stand.r { animation: wf-walkR 0.42s ease-in-out infinite; }
        .hero-wireframe-section .creature.jumping .leg-stand.l { transform: rotate(-30deg); }
        .hero-wireframe-section .creature.jumping .leg-stand.r { transform: rotate(30deg); }

        /* Sitting leg: thigh pivots at the hip, shin pivots at the knee
           — gives a true two-joint kick like a real seated leg. */
        .hero-wireframe-section .creature .leg-sit .thigh-pivot {
          transform-origin: 44px 88px; /* hip — overridden per-leg below */
        }
        .hero-wireframe-section .creature .leg-sit.near .thigh-pivot {
          transform-origin: 44px 88px;
        }
        .hero-wireframe-section .creature .leg-sit.far .thigh-pivot {
          transform-origin: 56px 88px;
        }
        /* shin-pivot transform-origin is set inline on the SVG group (per leg) */

        .hero-wireframe-section .creature.sitting .leg-sit.near .thigh-pivot {
          animation: wf-thighNear 1.5s ease-in-out infinite;
        }
        .hero-wireframe-section .creature.sitting .leg-sit.near .shin-pivot {
          animation: wf-shinNear 1.5s ease-in-out infinite;
          animation-delay: 0.18s; /* shin lags the thigh — the "whip" of a kick */
        }
        .hero-wireframe-section .creature.sitting .leg-sit.far .thigh-pivot {
          animation: wf-thighFar 1.5s ease-in-out infinite;
          animation-delay: 0.4s;
        }
        .hero-wireframe-section .creature.sitting .leg-sit.far .shin-pivot {
          animation: wf-shinFar 1.5s ease-in-out infinite;
          animation-delay: 0.58s;
        }

        @keyframes wf-walkL { 0%,100% { transform: rotate(-22deg); } 50% { transform: rotate(22deg); } }
        @keyframes wf-walkR { 0%,100% { transform: rotate(22deg); } 50% { transform: rotate(-22deg); } }

        /* Thigh rotates from the hip — small forward/back swing.
           Shin rotates from the knee — kicks out wider (the "whip"). */
        @keyframes wf-thighNear {
          0%   { transform: rotate(-8deg); }
          50%  { transform: rotate(12deg); }
          100% { transform: rotate(-8deg); }
        }
        @keyframes wf-shinNear {
          0%   { transform: rotate(-22deg); }   /* shin tucked under (knee bent) */
          50%  { transform: rotate(8deg); }     /* shin kicks forward (almost straight) */
          100% { transform: rotate(-22deg); }
        }
        @keyframes wf-thighFar {
          0%   { transform: rotate(10deg); }
          50%  { transform: rotate(-6deg); }
          100% { transform: rotate(10deg); }
        }
        @keyframes wf-shinFar {
          0%   { transform: rotate(-18deg); }
          50%  { transform: rotate(14deg); }
          100% { transform: rotate(-18deg); }
        }

        /* responsive */
        @media (max-width: 1024px) {
          .hero-wireframe-section .wf-pad {
            grid-template-columns: 1fr;
            padding: 96px 32px 120px;
            gap: 32px;
          }
          .hero-wireframe-section h1.headline { font-size: 48px; }
          .hero-wireframe-section .wf-nav { left: 24px; right: 24px; }
          .hero-wireframe-section .wf-nav .links { display: none; }
        }
        @media (max-width: 640px) {
          .hero-wireframe-section h1.headline { font-size: 38px; }
          .hero-wireframe-section .phone { transform: rotate(3deg) scale(0.85); }
        }
      `}</style>
    </section>
  );
}
