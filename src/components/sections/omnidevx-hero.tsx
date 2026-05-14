'use client';

import React, { useEffect, useRef } from 'react';

/* ============================================================
   PerchCreature — physics-driven walker that perches on
   buttons + phone. rAF + direct DOM transforms (no React
   re-renders per frame) for smooth motion.
   ============================================================ */
function PerchCreature({ color = '#2a6fdb' }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const root = el?.closest('.wf') as HTMLElement | null;
    if (!el || !root) return;

    let cancelled = false;
    let x = 60;
    let y = 0;
    let dir: 1 | -1 = 1;
    let bodyScaleX = 1, bodyScaleY = 1;
    let bodyRotate = 0;
    let pressedNode: HTMLElement | null = null;
    let pressedOrigTransform = '';
    let pressedOrigTransition = '';

    const CREATURE_W = 70;
    const GROUND_BOTTOM = 4; // must match .creature CSS bottom
    const GRAVITY = 2200;
    const WALK_SPEED = 200;

    const body = el.querySelector('.body') as SVGElement | null;

    const cancelTokens: Array<() => void> = [];

    // Cache the root dimensions to avoid layout-thrash reads in every apply().
    let cachedWfW = root.offsetWidth;
    let cachedWfH = root.offsetHeight;
    let cachedMaxY = cachedWfH - GROUND_BOTTOM - 20;
    const updateCache = () => {
      cachedWfW = root.offsetWidth;
      cachedWfH = root.offsetHeight;
      cachedMaxY = cachedWfH - GROUND_BOTTOM - 20;
    };
    const onResize = () => updateCache();
    window.addEventListener('resize', onResize);
    cancelTokens.push(() => window.removeEventListener('resize', onResize));

    const clampState = () => {
      if (x < 0) x = 0;
      if (x > cachedWfW - CREATURE_W) x = cachedWfW - CREATURE_W;
      if (y > cachedMaxY) y = cachedMaxY;
      if (y < 0) y = 0;
    };

    // SVG container is 70x98 (viewBox 100x140). Painted body bottom is at y=92 in
    // the viewBox, so its screen-y inside the container = 92/140 * 98 = 64.4px.
    // The empty space below the painted body is 98 - 64.4 = 33.6px (which is where
    // the dangling sitting-legs live). To place the painted body bottom flush with
    // the element's visual top, we subtract this from perchY.
    const BODY_BOTTOM_INSET = 33.6;
    // The body's rotation pivot X (in percent of body width) — dynamically set
    // so that when Putus sits OFF-CENTER on a surface, the body's pivot matches
    // the surface's pivot. Otherwise body and surface rotate around different
    // points and their bottom edges no longer stay parallel.
    let bodyOriginPctX = 50;
    const apply = () => {
      clampState();
      el.style.transform = `translate3d(${x}px, ${-y}px, 0) scaleX(${dir})`;
      if (body) {
        body.style.transformOrigin = `${bodyOriginPctX}% 65.7%`;
        // Container is mirrored when dir=-1; counter-flip the rotation sign so
        // visual rotation always matches the intended bodyRotate in world space.
        const effectiveRot = bodyRotate * dir;
        body.style.transform = `rotate(${effectiveRot}deg) scaleX(${bodyScaleX}) scaleY(${bodyScaleY})`;
      }
    };

    const sleep = (ms: number) =>
      new Promise<void>((r) => {
        const id = setTimeout(() => r(), ms);
        cancelTokens.push(() => clearTimeout(id));
      });

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
    const easeInQuad = (t: number) => t * t;

    const tween = (
      from: number,
      to: number,
      dur: number,
      set: (v: number) => void,
      ease: (t: number) => number = (t) => t
    ) =>
      new Promise<void>((resolve) => {
        if (dur <= 0) { set(to); return resolve(); }
        const start = performance.now();
        const step = (now: number) => {
          if (cancelled) return resolve();
          const p = Math.min(1, (now - start) / dur);
          set(from + (to - from) * ease(p));
          if (p < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });

    const PERCH_SELECTORS = ['.pill', '.btn-primary', '.btn-ghost', '.app-cta', '.phone'];

    type PerchEntry = { node: HTMLElement; tb: DOMRect; rb: DOMRect; scale: number };

    const collectTargets = (): PerchEntry[] => {
      const rb = root.getBoundingClientRect();
      const scale = rb.width / root.offsetWidth || 1;
      const list: PerchEntry[] = [];
      PERCH_SELECTORS.forEach((sel) => {
        root.querySelectorAll<HTMLElement>(sel).forEach((node) => {
          const tb = node.getBoundingClientRect();
          const w = tb.width / scale;
          const h = tb.height / scale;
          if (w < 40 || h < 14) return;
          if (tb.top < rb.top + 30 * scale || tb.bottom > rb.bottom - 90 * scale) return;
          list.push({ node, tb, rb, scale });
        });
      });
      return list;
    };

    const cumulativeRotation = (node: HTMLElement) => {
      let totalRot = 0;
      let walker: HTMLElement | null = node;
      while (walker && walker !== root) {
        const t = getComputedStyle(walker).transform;
        if (t && t !== 'none') {
          const open = t.indexOf('(');
          const close = t.lastIndexOf(')');
          if (open !== -1 && close !== -1) {
            const parts = t.slice(open + 1, close).split(',').map(parseFloat);
            totalRot += Math.atan2(parts[1], parts[0]);
          }
        }
        walker = walker.parentElement;
      }
      return totalRot;
    };

    // offsetFrac in [-1, 1] — 0 = center, ±1 = full edge of perchable width.
    // We reserve 20px on each side so the creature doesn't perch right at the corner.
    const targetGeometry = (entry: PerchEntry, offsetFrac = 0) => {
      const { tb, rb, scale, node } = entry;
      const wfH = root.offsetHeight;
      const elTop = (tb.top - rb.top) / scale;
      const elLeft = (tb.left - rb.left) / scale;
      const elW = tb.width / scale;
      const elH = tb.height / scale;
      const layoutH = node.offsetHeight;
      const rot = cumulativeRotation(node);
      const cos = Math.cos(rot);
      const cx = elLeft + elW / 2;
      const cy = elTop + elH / 2;
      const visualTopY = cy - (layoutH / 2) * Math.abs(cos);
      const visualTopXCenter = cx + (layoutH / 2) * Math.sin(rot);
      // Offset the perch X by a fraction of the element's half-width.
      const usableHalf = Math.max(0, elW / 2 - 24);
      const visualTopX = visualTopXCenter + offsetFrac * usableHalf;
      const perchX = visualTopX - CREATURE_W / 2;
      const perchY = wfH - GROUND_BOTTOM - visualTopY - BODY_BOTTOM_INSET;
      return {
        perchX,
        perchY,
        leftX: elLeft,
        rightX: elLeft + elW,
        offsetFrac,
        usableHalf,
        elW,
      };
    };

    const walkTo = async (targetX: number) => {
      const startX = x;
      const dist = targetX - startX;
      if (Math.abs(dist) < 2) return;
      dir = dist >= 0 ? 1 : -1;
      el.classList.remove('sitting');
      el.classList.add('walking');
      // Speed varies a little so each walk feels different (180-240 px/s).
      const speed = WALK_SPEED * (0.9 + Math.random() * 0.3);
      const dur = Math.max(360, (Math.abs(dist) / speed) * 1000);
      // Bouncy bob frequency — roughly matches the leg-walk cycle (~2.4 Hz).
      const BOB_HZ = 4.0;
      const baseY = y;
      const bobCycles = (dur / 1000) * BOB_HZ;
      await tween(0, 1, dur, (p) => {
        x = startX + dist * easeInOutCubic(p);
        // vertical bounce — sine wave; absolute value gives a "step up/step down" feel
        const bob = Math.abs(Math.sin(p * Math.PI * bobCycles)) * 3;
        y = baseY + bob;
        // slight squash on each footfall — body compresses at lowest point
        const compress = (1 - Math.abs(Math.sin(p * Math.PI * bobCycles))) * 0.05;
        bodyScaleX = 1 + compress;
        bodyScaleY = 1 - compress;
        apply();
      });
      y = baseY;
      bodyScaleX = 1; bodyScaleY = 1;
      apply();
      el.classList.remove('walking');
    };

    // Brief "look around" pause — head wiggle while standing still.
    const lookAround = async () => {
      const startRot = bodyRotate;
      await tween(0, 1, 700, (p) => {
        bodyRotate = startRot + Math.sin(p * Math.PI * 2) * 4;
        apply();
      });
      bodyRotate = startRot;
      apply();
    };

    // Little hop in place — for when wandering without a clear destination.
    const hopInPlace = async () => {
      const baseY = y;
      el.classList.add('jumping');
      await tween(0, 1, 110, (p) => {
        bodyScaleX = 1 + 0.15 * p;
        bodyScaleY = 1 - 0.18 * p;
        apply();
      });
      const dur = 360;
      const start = performance.now();
      await new Promise<void>((resolve) => {
        const step = (now: number) => {
          if (cancelled) return resolve();
          const t = Math.min(dur, now - start) / dur;
          y = baseY + Math.sin(t * Math.PI) * 28;
          bodyScaleX = 0.95;
          bodyScaleY = 1.08;
          apply();
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
      y = baseY;
      // landing squash
      await tween(0, 1, 110, (p) => {
        bodyScaleX = 1 + 0.18 * p;
        bodyScaleY = 1 - 0.20 * p;
        apply();
      });
      await tween(1, 0, 160, (p) => {
        bodyScaleX = 1 + 0.18 * p;
        bodyScaleY = 1 - 0.20 * p;
        apply();
      }, easeOutQuad);
      bodyScaleX = 1; bodyScaleY = 1;
      apply();
      el.classList.remove('jumping');
    };

    const physicsJump = async (toX: number, toY: number, clearance = 110) => {
      const fromX = x, fromY = y;
      const dx = toX - fromX;
      if (dx !== 0) dir = dx > 0 ? 1 : -1;
      el.classList.remove('sitting');
      el.classList.add('jumping');

      await tween(0, 1, 110, (p) => {
        bodyScaleX = 1 + 0.18 * p;
        bodyScaleY = 1 - 0.22 * p;
        apply();
      });
      await tween(1, 0, 90, (p) => {
        bodyScaleX = 1 + 0.18 * p - 0.05 * (1 - p);
        bodyScaleY = 1 - 0.22 * p + 0.10 * (1 - p);
        apply();
      });
      bodyScaleX = 0.95;
      bodyScaleY = 1.08;

      const rbJ = root.getBoundingClientRect();
      const scaleJ = rbJ.width / root.offsetWidth || 1;
      const wfHJ = root.offsetHeight;
      let maxTopY = Math.max(fromY, toY);
      const loX = Math.min(fromX, toX);
      const hiX = Math.max(fromX, toX);
      PERCH_SELECTORS.forEach((sel) => {
        root.querySelectorAll<HTMLElement>(sel).forEach((node) => {
          const tb = node.getBoundingClientRect();
          const elL = (tb.left - rbJ.left) / scaleJ;
          const elR = (tb.right - rbJ.left) / scaleJ;
          const elT = (tb.top - rbJ.top) / scaleJ;
          if (elR < loX - 30 || elL > hiX + 30) return;
          const yFromBottom = wfHJ - GROUND_BOTTOM - elT;
          if (yFromBottom > maxTopY) maxTopY = yFromBottom;
        });
      });
      // Cap peak height so Putus never overshoots the section (tall phones can
      // otherwise drive the auto-clearance up to ~600px above ground).
      const maxPeakY = wfHJ - GROUND_BOTTOM - 40; // 40px from .wf top
      const peakAboveStart = Math.min(maxPeakY - fromY, (maxTopY - fromY) + clearance);
      const vy = Math.sqrt(2 * GRAVITY * Math.max(10, peakAboveStart));
      const a = 0.5 * GRAVITY;
      const b = -vy;
      const c = toY - fromY;
      const disc = b * b - 4 * a * c;
      if (disc < 0) {
        el.classList.remove('jumping');
        return;
      }
      const T = (-b + Math.sqrt(disc)) / (2 * a);
      const vx = (toX - fromX) / T;

      const start = performance.now();
      await new Promise<void>((resolve) => {
        const step = (now: number) => {
          if (cancelled) return resolve();
          const t = Math.min(T, (now - start) / 1000);
          x = fromX + vx * t;
          y = fromY + vy * t - 0.5 * GRAVITY * t * t;
          const phase = t / T;
          bodyScaleX = 0.95 + 0.05 * Math.sin(phase * Math.PI);
          bodyScaleY = 1.08 - 0.10 * Math.sin(phase * Math.PI);
          apply();
          if (t < T) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });

      x = toX;
      y = toY;
      el.classList.remove('jumping');

      await tween(0, 1, 110, (p) => {
        bodyScaleX = 1 + 0.22 * p;
        bodyScaleY = 1 - 0.20 * p;
        apply();
      });
      await tween(1, 0, 180, (p) => {
        bodyScaleX = 1 + 0.22 * p;
        bodyScaleY = 1 - 0.20 * p;
        apply();
      }, easeOutQuad);
      bodyScaleX = 1;
      bodyScaleY = 1;
      apply();
    };

    // Cache once per press.
    let pressedBaseRotDeg = 0;
    let pressedOrigOrigin = '';

    // beginPress — set up the perched element ONCE at the start of a sit.
    //   • Captures base rotation, original styles
    //   • Sets transform-origin to the contact point (rotation pivots there)
    //   • Switches transition to 0s so subsequent updatePress calls are instant
    //     (the rAF tween provides smooth interpolation — no CSS transition layer)
    // Geometry of the perched element at press time — needed so we can compute
    // where Putus's contact point moves to as the surface rotates around its center.
    let pressedPivotX = 0;     // element center X in .wf coords (unscaled)
    let pressedPivotY = 0;     // element center Y in .wf coords (unscaled)
    let pressedContactX0 = 0;  // initial contact X in .wf coords (offset from center)
    let pressedContactY0 = 0;  // initial contact Y in .wf coords (on top edge)
    let pressedContactFrac = 0; // remember the contactFracX for this perch
    let pressedElHalfW = 0;     // element's half-width (slide-edge distance)

    const beginPress = (node: HTMLElement, contactFracX: number) => {
      if (pressedNode && pressedNode !== node) releasePress(true);
      pressedNode = node;
      pressedOrigTransform = node.style.transform || '';
      pressedOrigTransition = node.style.transition || '';
      pressedOrigOrigin = node.style.transformOrigin || '';
      pressedContactFrac = contactFracX;
      const computed = getComputedStyle(node).transform;
      pressedBaseRotDeg = 0;
      if (computed && computed !== 'none') {
        const open = computed.indexOf('(');
        const close = computed.lastIndexOf(')');
        if (open !== -1 && close !== -1) {
          const parts = computed.slice(open + 1, close).split(',').map(parseFloat);
          pressedBaseRotDeg = (Math.atan2(parts[1], parts[0]) * 180) / Math.PI;
        }
      }
      // Snapshot the element's bounding box BEFORE we add our tilt, so we know
      // the geometric pivot (center) and the contact-point's starting position.
      const tb = node.getBoundingClientRect();
      const rb = root.getBoundingClientRect();
      const scale = rb.width / root.offsetWidth || 1;
      const elW = tb.width / scale;
      const elH = tb.height / scale;
      const elLeft = (tb.left - rb.left) / scale;
      const elTop = (tb.top - rb.top) / scale;
      // AABB center = visual center (rotation pivots around it).
      pressedPivotX = elLeft + elW / 2;
      pressedPivotY = elTop + elH / 2;
      // VISUAL top center (not AABB top) — use layout height + base rotation.
      const layoutH = node.offsetHeight;
      const layoutW = node.offsetWidth;
      const baseRotRad = (pressedBaseRotDeg * Math.PI) / 180;
      const cosB = Math.cos(baseRotRad);
      const sinB = Math.sin(baseRotRad);
      // Top-center of the rotated rectangle in .wf coords
      const visualTopY = pressedPivotY - (layoutH / 2) * Math.abs(cosB);
      const visualTopX = pressedPivotX + (layoutH / 2) * sinB;
      // Contact point sits along the tilted top edge. Moving from center along
      // the top edge by `contactFracX * usableHalf` units displaces BOTH X and Y
      // because the top edge itself is tilted (not horizontal).
      // Direction along the top edge: (cos(rot), sin(rot)) — perpendicular to
      // the rectangle's left/right sides which run along (sin, -cos).
      const usableHalf = Math.max(0, layoutW / 2 - 24);
      pressedContactX0 = visualTopX + contactFracX * usableHalf * cosB;
      pressedContactY0 = visualTopY + contactFracX * usableHalf * sinB;
      // Slide distance along the top edge (in layout-untilted units).
      pressedElHalfW = layoutW / 2;
      // Pivot around CENTER so rotation is visually big at both ends.
      node.style.transformOrigin = '50% 50%';
      node.style.transition = 'transform 0s linear';
    };

    // Compute where the contact point ends up after the surface is tilted by tiltDeg.
    // Returns the new contact (X, Y) in .wf coords so Putus can track it.
    const contactAfterTilt = (tiltDeg: number) => {
      const rad = (tiltDeg * Math.PI) / 180;
      const dx0 = pressedContactX0 - pressedPivotX;
      const dy0 = pressedContactY0 - pressedPivotY;
      const cosT = Math.cos(rad);
      const sinT = Math.sin(rad);
      const newDx = dx0 * cosT - dy0 * sinT;
      const newDy = dx0 * sinT + dy0 * cosT;
      return { x: pressedPivotX + newDx, y: pressedPivotY + newDy };
    };

    // updatePress — write a new depth + tilt to the already-pressed node.
    // Cheap: just sets transform (origin is unchanged, transition is 0s).
    const updatePress = (depth: number, tiltDeg: number) => {
      if (!pressedNode) return;
      const totalRot = pressedBaseRotDeg + tiltDeg;
      pressedNode.style.transform = `translateY(${depth}px) rotate(${totalRot}deg)`;
    };

    // pressDown — convenience wrapper for single-shot calls (used outside tweens).
    const pressDown = (node: HTMLElement, depth = 8, tiltDeg = 0, contactFracX = 0) => {
      if (pressedNode !== node) beginPress(node, contactFracX);
      updatePress(depth, tiltDeg);
    };

    const releasePress = (snap = false) => {
      if (!pressedNode) return;
      const node = pressedNode;
      const origT = pressedOrigTransform;
      const origTr = pressedOrigTransition;
      const origO = pressedOrigOrigin;
      pressedNode = null;
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
      cancelTokens.push(() => clearTimeout(restoreTimer));
      const id = setTimeout(() => {
        if (pressedNode !== node) node.style.transition = origTr;
      }, 280);
      cancelTokens.push(() => clearTimeout(id));
    };

    // Tilt-aware idleBob — preserves the surface tilt baseline established by
    // PHASE 1, adds gentle breathing/sway around that baseline, and progressively
    // INCREASES the tilt over the sit duration so the seesaw effect is visible.
    //
    // baseRot: starting body rotation (= -surfaceTilt from phase 1)
    // surfaceTiltDeg: current surface tilt; gradually grows to maxTiltDeg
    // maxTiltDeg: how far the surface should ultimately lean during this sit
    const idleBob = async (
      durMs: number,
      surfaceTiltStart = 0,
      surfaceTiltEnd = 0,
      trackContact = false,
    ) => {
      const baseY = y;
      const baseX = x;
      const baseRot = -surfaceTiltStart * 0.4;
      const baseScaleX = bodyScaleX || 1;
      const baseScaleY = bodyScaleY || 1;
      const wfHLocal = root.offsetHeight;

      // settle in — slight squash, KEEP the inherited lean.
      await tween(0, 1, 280, (p) => {
        bodyScaleX = baseScaleX + 0.06 * p;
        bodyScaleY = baseScaleY - 0.10 * p;
        bodyRotate = baseRot;
        apply();
      }, easeOutQuad);

      // PROGRESSIVE TILT — surface gradually tips.
      // SLIDE — Putus slides ALONG the tilted surface toward the edge.
      // We track Putus's position on the surface (in untilted coords) and END
      // the slide as soon as the contact point passes the element's edge.
      const start = performance.now();
      const slideDir = pressedContactFrac > 0 ? 1 : -1;
      const elementHalfWidth = pressedElHalfW;
      // Initial signed offset ALONG the top edge (untilted, in layout-units).
      const initialOffsetU = pressedContactFrac * Math.max(0, elementHalfWidth - 24);
      // The base rotation's effect along the edge (cos, sin) — captured in beginPress.
      const baseRotRad = (pressedBaseRotDeg * Math.PI) / 180;
      const cosB = Math.cos(baseRotRad);
      const sinB = Math.sin(baseRotRad);
      // Top-center of the surface (where the contact would be at offset=0).
      const layoutHL = pressedNode ? pressedNode.offsetHeight : 0;
      const topCenterX = pressedPivotX + (layoutHL / 2) * sinB;
      const topCenterY = pressedPivotY - (layoutHL / 2) * Math.abs(cosB);
      await new Promise<void>((resolve) => {
        const step = (now: number) => {
          if (cancelled) return resolve();
          const elapsed = now - start;
          const p = Math.min(1, elapsed / durMs);
          const t = elapsed / 1000;

          const curTilt = surfaceTiltStart + (surfaceTiltEnd - surfaceTiltStart) * easeInOutCubic(p);

          if (trackContact && pressedNode) {
            // Position ALONG the top edge in layout-units (untilted).
            const slideFrac = p * p;
            const targetEdgeU = slideDir * elementHalfWidth;
            const curOffsetU = initialOffsetU + (targetEdgeU - initialOffsetU) * slideFrac;

            // Surface-frame coords: walking along the top edge displaces both X and Y
            // because the top edge itself is tilted by base rotation.
            const surfaceX = topCenterX + curOffsetU * cosB;
            const surfaceY = topCenterY + curOffsetU * sinB;

            // Now also rotate the entire surface by our added tilt (around pivot).
            const rad = (curTilt * Math.PI) / 180;
            const dx0 = surfaceX - pressedPivotX;
            const dy0 = surfaceY - pressedPivotY;
            const newX = pressedPivotX + dx0 * Math.cos(rad) - dy0 * Math.sin(rad);
            const newY = pressedPivotY + dx0 * Math.sin(rad) + dy0 * Math.cos(rad);
            x = newX - CREATURE_W / 2;
            y = wfHLocal - GROUND_BOTTOM - newY - BODY_BOTTOM_INSET - 8 + Math.sin(t * 2.0) * 0.8;

            updatePress(8, curTilt);

            // EDGE REACHED — resolve early so the fall begins immediately.
            if (Math.abs(curOffsetU) >= elementHalfWidth * 0.95) {
              apply();
              return resolve();
            }
          } else {
            y = baseY + Math.sin(t * 2.0) * 0.8;
            x = baseX;
          }
          bodyScaleX = 1.04 + Math.sin(t * 2.0) * 0.015;
          bodyScaleY = 0.92 - Math.sin(t * 2.0) * 0.015;
          bodyRotate = -curTilt * 0.4 + Math.sin(t * 1.4) * 1.2;

          if (!(trackContact && pressedNode)) updatePress(8, curTilt);
          apply();
          if (p >= 1) return resolve();
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });

      // Un-squash but KEEP the current lean and position — the caller will
      // transition straight into the fall, so we must NOT snap back to baseY
      // or reset bodyRotate to vertical.
      const heldRot = bodyRotate;
      await tween(0, 1, 180, (p) => {
        bodyScaleX = 1.04 + (1 - 1.04) * p;
        bodyScaleY = 0.92 + (1 - 0.92) * p;
        bodyRotate = heldRot; // freeze the current lean
        apply();
      }, easeOutQuad);
      bodyScaleX = 1;
      bodyScaleY = 1;
      // bodyRotate, x, y all stay AS-IS — no reset. Caller continues from here.
      apply();
    };

    const pickTarget = () => {
      updateCache(); // refresh wf dimensions once per perch cycle
      const list = collectTargets();
      if (!list.length) return null;
      return list[Math.floor(Math.random() * list.length)];
    };

    const loop = async () => {
      x = 60;
      y = 0;
      dir = 1;
      apply();
      while (!cancelled) {
        const entry = pickTarget();
        if (!entry) { await sleep(600); continue; }

        // Pick an off-center perch position. Skew toward the edges so the
        // seesaw tilt is highly visible. Range: [-0.85, 0.85] biased away from 0.
        // Off-center perch, but not extreme — magnitude in [0.4, 0.7] so Putus
        // doesn't end up perched on a corner. Sign random.
        const offsetSign = Math.random() < 0.5 ? -1 : 1;
        const offsetFrac = offsetSign * (0.4 + Math.random() * 0.3);
        const g = targetGeometry(entry, offsetFrac);

        const fromSide = g.perchX > x ? -1 : 1;
        const approachX = g.perchX + fromSide * 80;
        await walkTo(approachX);
        if (cancelled) return;
        await sleep(120);

        await physicsJump(g.perchX, g.perchY, 80);
        if (cancelled) return;

        el.classList.add('sitting');

        // Putus ALWAYS falls off — no clean jump-off. The only way down is by
        // sliding too far and tumbling.
        const willFall = true;

        const PRESS_DEPTH = 8;
        // Start at NEAR-ZERO tilt — surface is barely touched by Putus's weight.
        // Grows over the sit duration to a dramatic final tilt → unmistakable slide.
        const initialTilt = Math.max(-2, Math.min(2, offsetFrac * 3));
        const FINAL_TILT_MAX = willFall ? 30 : 18;
        const finalTilt = Math.max(-FINAL_TILT_MAX, Math.min(FINAL_TILT_MAX, offsetFrac * (willFall ? 40 : 24)));
        const contactFracX = offsetFrac;

        // Begin press ONCE — sets origin and switches the element to instant updates.
        beginPress(entry.node, contactFracX);
        // Putus's body is positioned with its CENTER over the contact point on the
        // surface, so the body's rotation pivot stays at its own center (50%) —
        // NOT offset to the side. The surface rotates around the contact (top edge,
        // offset X); the body rotates around its own painted bottom CENTER. Both
        // pivots coincide in world space, so the contact stays glued.
        bodyOriginPctX = 50;

        // PHASE 1: SETTLE IN — sink + initial tilt, all in one synchronized tween.
        // Putus's x/y tracks the contact point as the surface rotates around its
        // center, so the body bottom stays glued to the new visual contact spot.
        const wfH = root.offsetHeight;
        await tween(0, 1, 260, (p) => {
          const e = 1 - Math.pow(1 - p, 2);
          const curDepth = PRESS_DEPTH * e;
          const curTilt = initialTilt * e;
          updatePress(curDepth, curTilt);
          // where does the contact point end up after this rotation?
          const c = contactAfterTilt(curTilt);
          // Putus center-X over the new contact-X
          x = c.x - CREATURE_W / 2;
          // y from .wf bottom: container bottom = c.y + BODY_BOTTOM_INSET (so painted body bottom = c.y),
          //                    then subtract curDepth so we sink with the surface.
          y = wfH - GROUND_BOTTOM - c.y - BODY_BOTTOM_INSET - curDepth;
          // Body leans 40% of surface tilt — viewer sees Putus "trying to stay upright".
          bodyRotate = -curTilt * 0.4;
          apply();
        });

        // PHASE 2: STABLE-ISH SIT — surface tilt GROWS from initialTilt → finalTilt
        // over the entire sit duration. idleBob handles body breathing + sway and
        // re-pressing the surface every frame so the tilt is continuously visible.
        // Long sit duration so the tilt growth is clearly visible as a slow slide.
        const sitDur = 2600 + Math.random() * 800;
        await idleBob(sitDur, initialTilt, finalTilt, /* trackContact */ true);

        // PHASE 3: WOBBLE — Putus is already leaning; add a small flail then
        // commit to the fall direction. Wobble oscillates AROUND the current
        // lean so Putus never snaps upright.
        const wobbleDur = 400;
        const fallDir = offsetFrac > 0 ? 1 : -1;
        const wobBase = bodyRotate;       // current lean from idleBob (negative for right-lean)
        await tween(0, 1, wobbleDur, (p) => {
          // Small flutter that grows + bias toward fall direction.
          const flutter = Math.sin(p * Math.PI * 4) * (1 - p) * 4;
          const commit = fallDir * p * 18;
          bodyRotate = wobBase + flutter + commit;
          apply();
        });

        // ── PHASE 4: FALL ── Putus has wobbled past the edge, gravity takes over.
        dir = fallDir;
        el.classList.remove('sitting');
        el.classList.add('jumping');

        // surface springs back as Putus slips off
        releasePress();

        // TUMBLE — projectile fall with gravity to ground level (y=0).
        const fallStartX = x;
        const fallStartY = y;
        const fallStartRot = bodyRotate;
        const tumbleVy = 200;
        const tumbleVx = fallDir * (220 + Math.random() * 80);
        const T = (tumbleVy + Math.sqrt(tumbleVy * tumbleVy + 2 * GRAVITY * Math.max(0, fallStartY))) / GRAVITY;
        // Putus lands UPSIDE DOWN — final rotation = 180° in fall direction.
        const landingRot = fallDir * 180;
        const tumbleStart = performance.now();
        await new Promise<void>((resolve) => {
          const step = (now: number) => {
            if (cancelled) return resolve();
            const t = Math.min(T, (now - tumbleStart) / 1000);
            x = fallStartX + tumbleVx * t;
            y = fallStartY + tumbleVy * t - 0.5 * GRAVITY * t * t;
            // Smoothly rotate from fallStartRot → landingRot over the airtime
            const rotP = t / T;
            bodyRotate = fallStartRot + (landingRot - fallStartRot) * rotP;
            bodyScaleX = 0.95;
            bodyScaleY = 1.05;
            apply();
            if (t < T) requestAnimationFrame(step);
            else resolve();
          };
          requestAnimationFrame(step);
        });

        // HEAD-FIRST LANDING — Putus is upside down (180° rotated).
        // The "head" is now at the bottom touching the ground. Show the
        // sitting-leg variant so the legs+socks are visible up in the air.
        y = 0;
        bodyOriginPctX = 50;
        bodyRotate = landingRot; // keep upside-down
        // Switch to sitting state so .leg-sit (with socks) is visible while
        // upside-down — the legs dangle UPWARD like waving for help.
        el.classList.remove('jumping');
        el.classList.add('sitting');
        apply();

        // BUMP — sharp vertical squash on head impact
        await tween(0, 1, 90, (p) => {
          bodyScaleX = 1 + 0.36 * p;     // wide
          bodyScaleY = 1 - 0.34 * p;     // crushed
          apply();
        });
        // Tiny upward bounce
        await tween(0, 1, 220, (p) => {
          const eOut = 1 - Math.pow(1 - p, 2);
          const lift = Math.sin(p * Math.PI) * 28;
          y = lift;
          bodyScaleX = (1 + 0.36) + (0.95 - (1 + 0.36)) * eOut;
          bodyScaleY = (1 - 0.34) + (1.06 - (1 - 0.34)) * eOut;
          apply();
        });
        // Brief settle while still upside-down (legs wiggling)
        y = 0;
        bodyScaleX = 1; bodyScaleY = 1;
        apply();
        // Wiggle legs in distress for a moment
        const wiggleStart = performance.now();
        await new Promise<void>((resolve) => {
          const step = (now: number) => {
            if (cancelled) return resolve();
            const e = now - wiggleStart;
            if (e >= 600) return resolve();
            const ts = e / 1000;
            bodyRotate = landingRot + Math.sin(ts * 8) * 4;
            apply();
            requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });

        // STAND UP — rotate body back to vertical (the short way around)
        // Choose the rotation direction that takes ≤180°
        const standFrom = bodyRotate;
        // Normalize: target = 0 (vertical). Compute shortest path.
        let standDelta = -standFrom;
        // wrap to [-180, 180]
        while (standDelta > 180) standDelta -= 360;
        while (standDelta < -180) standDelta += 360;
        el.classList.remove('sitting'); // back to standing-leg variant
        await tween(0, 1, 420, (p) => {
          const e = 1 - Math.pow(1 - p, 3); // easeOutCubic — punchy stand-up
          bodyRotate = standFrom + standDelta * e;
          // Small dust-off squash mid-rotation
          const squash = Math.sin(p * Math.PI) * 0.08;
          bodyScaleX = 1 + squash;
          bodyScaleY = 1 - squash;
          apply();
        });
        bodyRotate = 0; bodyScaleX = 1; bodyScaleY = 1;
        apply();
        await sleep(280);

        const wfW = root.offsetWidth;
        const wanderX = 40 + Math.random() * (wfW - 120);
        await walkTo(wanderX);

        // Occasionally pause to look around or hop — adds personality.
        const r = Math.random();
        if (r < 0.35) {
          await lookAround();
        } else if (r < 0.55) {
          await hopInPlace();
        }
        await sleep(280 + Math.random() * 400);
      }
    };

    apply();
    loop();

    return () => {
      cancelled = true;
      releasePress(true);
      cancelTokens.forEach((fn) => fn());
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
  return (
    <div className="phone-wrap">
      <div className="phone">
        <div className="screen">
          <div className="app-header">
            <span>◀ omnidevx</span>
            <span>· · ·</span>
          </div>
          <div className="app-headline">join omnidevx.</div>
          <div className="app-sub">ship smoother. ship sooner.</div>
          <div className="placeholder">[ product screen ]</div>
          <div className="placeholder small">[ list row ]</div>
          <div className="app-cta">join the squad</div>
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
      <div className="phone-annot">app preview →</div>
    </div>
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
            omnidev<span style={{ color: '#2a6fdb' }}>X</span>
          </div>
          <div className="links">
            <span>work</span>
            <span>process</span>
            <span>team</span>
            <span>contact</span>
          </div>
          <div className="cta">start a project →</div>
        </div>

        {/* main grid */}
        <div className="wf-pad">
          <div className="left-col">
            <span className="pill">↳ now booking — summer cohort</span>
            <h1 className="headline">
              join us — we&apos;re shipping{' '}
              <span className="scribble-underline accent">10+ projects</span> in&nbsp;3&nbsp;months
              after our creations.
            </h1>
            <p className="sub">
              a small studio of devs, designers &amp; weirdos. we make the boring stuff smoother and the
              hard stuff actually fun. come build with us.
            </p>
            <div className="row">
              <a className="btn-primary" href="/contact">join omnidevx →</a>
              <a className="btn-ghost" href="/portfolio">see what we shipped</a>
            </div>
            <div className="stat-strip">
              <div><b>10+</b> shipped projects</div>
              <div><b>3 mo</b> avg from idea → live</div>
              <div><b>0</b> unread slack threads*</div>
            </div>
          </div>

          <PhoneMock />
        </div>

        {/* ground strip — Putus's playground */}
        <div className="ground">
          <div className="putus-label">
            <span className="putus-tag">✦ meet putus</span>
            <span className="putus-line">your future AI pet — motivates you, listens, gets you</span>
            <span className="putus-hint">↓ watch them work down here ↓</span>
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
          border: 3px solid #111;
          border-radius: 38px;
          background: #fff;
          position: relative;
          box-shadow: 6px 8px 0 rgba(17,17,17,0.13);
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transform: rotate(3deg);
          will-change: transform;
        }
        .hero-wireframe-section .phone::before {
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
        .hero-wireframe-section .phone .screen {
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
        .hero-wireframe-section .phone .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: "Kalam", cursive;
          font-size: 13px;
          color: #444;
        }
        .hero-wireframe-section .phone .app-headline {
          font-family: "Caveat", cursive;
          font-weight: 700;
          font-size: 28px;
          line-height: 1.05;
          color: #111;
          margin-top: 6px;
        }
        .hero-wireframe-section .phone .app-sub {
          font-family: "Patrick Hand", sans-serif;
          font-size: 14px;
          color: #333;
          line-height: 1.25;
        }
        .hero-wireframe-section .phone .app-cta {
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
        .hero-wireframe-section .phone .placeholder {
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
        .hero-wireframe-section .phone .placeholder.small { height: 42px; }

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
