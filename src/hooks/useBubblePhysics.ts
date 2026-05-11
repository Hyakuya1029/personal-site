import { useRef, useEffect, useCallback, useMemo, useState } from 'react';

export interface BubbleDef {
  id: string;
  radius: number;
}

interface BubbleState {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  currentScale: number;
  targetScale: number;
  element: HTMLElement | null;
}

export interface Connection {
  from: string;
  to: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  opacity: number;
}

export interface Particle {
  id: string;
  bubbleId: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

/* ── physics constants (tuned for gentle, settling behaviour) ── */
const GRAVITY = 0.0015;
const BUOYANCY_BASE = 0.0025;
const DAMPING_INITIAL = 0.986;   // quick settling during bloom
const DAMPING_NORMAL = 0.9975;   // very gentle float after settled
const SETTLE_PERIOD = 200;       // frames (~3.3 s @ 60 fps)
const FREEZE_DELAY = 150;        // frames idle before freezing (~2.5 s)
const FREEZE_RAMP = 80;          // frames to ease into full freeze (~1.3 s)
const FREEZE_DAMPING = 0.82;     // strong damping to halt movement
const CENTER_STRENGTH = 0.0005;
const COLLISION_RESTITUTION = 0.18;
const HOVER_REPULSION = 0.45;
const HOVER_INFLUENCE = 380;
const BOUNDARY_STIFFNESS = 0.12;
const NOISE_STRENGTH = 0.0015;
const MAX_VELOCITY = 0.45;
const SCALE_SMOOTHING = 0.07;
const CONNECTION_THRESHOLD = 260;
const ACTIVE_SCALE = 1.13;
const SQUEEZE_SCALE = 0.93;

export function useBubblePhysics(
  bubbles: BubbleDef[],
  hoveredId: string | null,
  containerWidth: number,
  containerHeight: number,
) {
  const stateRef = useRef<Map<string, BubbleState>>(new Map());
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const hoveredRef = useRef<string | null>(hoveredId);
  hoveredRef.current = hoveredId;
  const idleFramesRef = useRef<number>(0);

  const [connections, setConnections] = useState<Connection[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  // ── initial positions: tight cluster near centre, zero velocity ──
  const initialPositions = useMemo(() => {
    const positions = new Map<string, { x: number; y: number }>();
    if (containerWidth === 0 || containerHeight === 0) return positions;
    const cx = containerWidth / 2;
    const cy = containerHeight / 2;
    // tiny ring so bubbles barely overlap → collision resolution spreads them
    const ringR = Math.min(containerWidth, containerHeight) * 0.04;
    bubbles.forEach((b, i) => {
      const angle = (2 * Math.PI * i) / bubbles.length - Math.PI / 2;
      positions.set(b.id, {
        x: cx + Math.cos(angle) * ringR + (Math.random() - 0.5) * 4,
        y: cy + Math.sin(angle) * ringR + (Math.random() - 0.5) * 4,
      });
    });
    return positions;
  }, [bubbles, containerWidth, containerHeight]);

  // ── seed physics state ──
  useEffect(() => {
    stateRef.current.clear();
    timeRef.current = 0; // reset clock on re-seed
    initialPositions.forEach((pos, id) => {
      const def = bubbles.find((b) => b.id === id);
      if (!def) return;
      stateRef.current.set(id, {
        id,
        x: pos.x,
        y: pos.y,
        vx: 0,
        vy: 0,
        baseRadius: def.radius,
        currentScale: 1,
        targetScale: 1,
        element: null,
      });
    });
  }, [initialPositions, bubbles]);

  // ── register card DOM element ──
  const registerCard = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      const s = stateRef.current.get(id);
      if (s && el) s.element = el;
    },
    [],
  );

  // ── continuous physics loop ──
  useEffect(() => {
    if (containerWidth === 0 || containerHeight === 0) return;

    let frame = 0;

    const loop = () => {
      timeRef.current += 1;
      const dt = 1;
      const arr = Array.from(stateRef.current.values());
      const hovered = hoveredRef.current;
      let hState: BubbleState | undefined;
      if (hovered) hState = stateRef.current.get(hovered);

      const cx = containerWidth / 2;
      const cy = containerHeight / 2;

      // ── idle / freeze tracking ──
      if (hovered) {
        idleFramesRef.current = 0;
      } else {
        idleFramesRef.current += 1;
      }
      const settled = timeRef.current > SETTLE_PERIOD;
      const idleFrames = idleFramesRef.current;
      const freezing = settled && idleFrames > FREEZE_DELAY;
      // ease from DAMPING_NORMAL → FREEZE_DAMPING over FREEZE_RAMP frames
      const rampT = freezing ? Math.min(1, (idleFrames - FREEZE_DELAY) / FREEZE_RAMP) : 0;
      const damping = settled
        ? DAMPING_NORMAL + (FREEZE_DAMPING - DAMPING_NORMAL) * rampT
        : DAMPING_INITIAL;
      // noise fades out during freeze ramp
      const baseNoise = settled ? 1 : Math.min(1, timeRef.current / SETTLE_PERIOD);
      const noiseScale = baseNoise * (1 - rampT);

      // ── scale targets ──
      arr.forEach((b) => {
        if (!hovered) {
          b.targetScale = 1;
        } else if (b.id === hovered) {
          b.targetScale = ACTIVE_SCALE;
        } else if (hState) {
          const dx = b.x - hState.x;
          const dy = b.y - hState.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const t = 1 - Math.min(1, dist / HOVER_INFLUENCE);
          b.targetScale = 1 - t * (1 - SQUEEZE_SCALE);
        }
        b.currentScale += (b.targetScale - b.currentScale) * SCALE_SMOOTHING;
      });

      // ── forces ──
      arr.forEach((b) => {
        if (!freezing) {
          b.vy -= BUOYANCY_BASE * (b.baseRadius / 200) * dt;
          b.vy += GRAVITY * dt;
          b.vx += (cx - b.x) * CENTER_STRENGTH * dt;
          b.vy += (cy - b.y) * CENTER_STRENGTH * dt;

          // organic noise — very subtle once settled
          const t = timeRef.current * 0.018;
          const seed = b.id.charCodeAt(0) + b.id.charCodeAt(b.id.length - 1);
          b.vx += Math.sin(t * 0.71 + seed) * Math.cos(t * 0.53 + seed * 0.6) * NOISE_STRENGTH * noiseScale * dt;
          b.vy += Math.cos(t * 0.63 + seed * 0.8) * Math.sin(t * 0.77 + seed) * NOISE_STRENGTH * noiseScale * dt;

          // hover repulsion
          if (hState && b.id !== hovered) {
            const dx = b.x - hState.x;
            const dy = b.y - hState.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < HOVER_INFLUENCE && dist > 1) {
              const f = (HOVER_REPULSION * 120) / (dist * dist);
              b.vx += (dx / dist) * f * dt;
              b.vy += (dy / dist) * f * dt;
            }
          }

          // soft boundary
          const m = b.baseRadius * 0.75;
          if (b.x < m) b.vx += BOUNDARY_STIFFNESS * dt;
          if (b.x > containerWidth - m) b.vx -= BOUNDARY_STIFFNESS * dt;
          if (b.y < m) b.vy += BOUNDARY_STIFFNESS * dt;
          if (b.y > containerHeight - m) b.vy -= BOUNDARY_STIFFNESS * dt;
        }

        // damping
        b.vx *= damping;
        b.vy *= damping;

        // clamp speed
        const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (spd > MAX_VELOCITY) {
          b.vx = (b.vx / spd) * MAX_VELOCITY;
          b.vy = (b.vy / spd) * MAX_VELOCITY;
        }

        // integrate
        b.x += b.vx * dt;
        b.y += b.vy * dt;
      });

      // ── collision resolution ──
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          const a = arr[i];
          const b = arr[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist =
            ((a.baseRadius + b.baseRadius) / 2) *
            ((a.currentScale + b.currentScale) / 2) +
            6;

          if (dist < minDist && dist > 0.001) {
            const nx = dx / dist;
            const ny = dy / dist;
            const dvn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            // velocity impulse only when approaching
            if (dvn < 0) {
              const jImp = ((1 + COLLISION_RESTITUTION) * dvn) / 2;
              a.vx += jImp * nx;
              a.vy += jImp * ny;
              b.vx -= jImp * nx;
              b.vy -= jImp * ny;
            }
            // always separate overlapping bubbles
            const overlap = minDist - dist;
            const correction = overlap * 0.5;
            a.x -= correction * nx;
            a.y -= correction * ny;
            b.x += correction * nx;
            b.y += correction * ny;
          }
        }
      }

      // ── write to DOM ──
      arr.forEach((b) => {
        if (b.element) {
          b.element.style.transform = `translate(${b.x}px, ${b.y}px) translate(-50%, -50%) scale(${b.currentScale})`;
        }
      });

      // ── connections & particles (throttled to every 3 frames) ──
      frame++;
      if (frame % 3 === 0) {
        const conns: Connection[] = [];
        const pts: Particle[] = [];
        const t2 = timeRef.current * 0.01;

        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            const a = arr[i];
            const b = arr[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONNECTION_THRESHOLD) {
              conns.push({
                from: a.id,
                to: b.id,
                fromX: a.x,
                fromY: a.y,
                toX: b.x,
                toY: b.y,
                opacity: Math.max(0, (1 - dist / CONNECTION_THRESHOLD) * 0.28),
              });
            }
          }

          const bub = arr[i];
          const pCount = bub.baseRadius > 180 ? 3 : 2;
          for (let p = 0; p < pCount; p++) {
            const orbitR = bub.baseRadius * 0.55 + p * 8;
            const speed = 0.25 + p * 0.12;
            const offset = (i * 2.1 + p * 3.7) % (Math.PI * 2);
            const angle = t2 * speed + offset;
            pts.push({
              id: `${bub.id}-p${p}`,
              bubbleId: bub.id,
              x: bub.x + Math.cos(angle) * orbitR,
              y: bub.y + Math.sin(angle) * orbitR * 0.7,
              size: 2 + p * 1.2,
              opacity: 0.25 + p * 0.15,
            });
          }
        }

        setConnections(conns);
        setParticles(pts);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [containerWidth, containerHeight]);

  return { registerCard, connections, particles, initialPositions } as const;
}
