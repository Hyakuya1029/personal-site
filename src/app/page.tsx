'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import AboutCard from '@/components/home/AboutCard';
import CalendarCard from '@/components/home/CalendarCard';
import Link from 'next/link';
import PortfolioCard from '@/components/home/PortfolioCard';
import MessagesCard from '@/components/home/MessagesCard';
import ClockCard from '@/components/home/ClockCard';
import AnnouncementCard from '@/components/home/AnnouncementCard';
import MusicCard from '@/components/home/MusicCard';
import { useBubblePhysics } from '@/hooks/useBubblePhysics';
import InfoSection from '@/components/home/InfoSection';

type CardItem = {
  id: string;
  href?: string;
  size: number;
  color: string;
  render: (isHovered: boolean) => React.ReactNode;
};

const BREAKPOINT = 768;

/* ── per-card accent colours (used for connections & particles) ── */
const CARD_COLORS: Record<string, string> = {
  about: '#6366f1',
  calendar: '#f59e0b',
  portfolio: '#3b82f6',
  messages: '#10b981',
  clock: '#06b6d4',
  announcement: '#f43f5e',
  music: '#f97316',
};

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [containerDim, setContainerDim] = useState({ w: 0, h: 800 });
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ── mobile detection ──
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── scroll-based bubble opacity ──
  useEffect(() => {
    if (isMobile) return;
    const handleScroll = () => {
      const vh = window.innerHeight;
      const op = Math.max(0, 1 - window.scrollY / (vh * 0.5));
      setScrollOpacity(op);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // ── measure container ──
  useEffect(() => {
    if (isMobile || !containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerDim({
        w: entry.contentRect.width,
        h: entry.contentRect.height,
      });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [isMobile]);

  // ── card definitions (stable ref via useMemo) ──
  const baseCards = useMemo<CardItem[]>(
    () => [
      { id: 'about',         size: 220, color: CARD_COLORS.about,         render: (h: boolean) => <AboutCard isHovered={h} /> },
      { id: 'calendar',      size: 200, color: CARD_COLORS.calendar,      render: (h: boolean) => <CalendarCard isHovered={h} /> },
      { id: 'clock',         size: 160, color: CARD_COLORS.clock,         render: (h: boolean) => <ClockCard isHovered={h} /> },
      { id: 'announcement', size: 170, color: CARD_COLORS.announcement, render: (h: boolean) => <AnnouncementCard isHovered={h} /> },
      { id: 'music',   size: 155, color: CARD_COLORS.music,          render: (h: boolean) => <MusicCard isHovered={h} /> },
      { id: 'portfolio',     size: 140, color: CARD_COLORS.portfolio,     href: '/portfolio', render: (h: boolean) => <PortfolioCard isHovered={h} /> },
      { id: 'messages',      size: 140, color: CARD_COLORS.messages,      href: '/messages', render: (h: boolean) => <MessagesCard isHovered={h} /> },
    ],
    [],
  );

  // ── physics hook ──
  const bubbleDefs = useMemo(
    () => baseCards.map((c) => ({ id: c.id, radius: c.size })),
    [baseCards],
  );

  const { registerCard, connections, particles, initialPositions } = useBubblePhysics(
    bubbleDefs,
    hoveredCard,
    containerDim.w,
    containerDim.h,
  );

  // ── bloom gate: hide cards until positions are ready, then trigger animation ──
  const [bloomReady, setBloomReady] = useState(false);
  useEffect(() => {
    if (initialPositions.size > 0 && !bloomReady) {
      const raf = requestAnimationFrame(() => setBloomReady(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [initialPositions.size, bloomReady]);

  const handleMouseEnter = useCallback((cardId: string) => setHoveredCard(cardId), []);
  const handleMouseLeave = useCallback(() => setHoveredCard(null), []);

  // ── visual class for hover (glow / z-index, not scale — scale is physics-driven) ──
  const getCardClassName = (cardId: string) => {
    if (hoveredCard === null) return '';
    if (hoveredCard === cardId) return 'bubble-active';
    return 'bubble-squeeze';
  };

  // ════════════════════════════════════════════
  //  Mobile grid layout (unchanged)
  // ════════════════════════════════════════════
  if (isMobile) {
    return (
      <>
      <main className="min-h-screen p-4">
        <div className="max-w-lg mx-auto">
          <div className="mb-4 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-center">
            <span className="text-xs text-amber-600 dark:text-amber-400">💡 在电脑端访问以获得更好的交互体验</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {baseCards.map((item, idx) => {
              const content = item.render(false);
              const card = <div className="w-full h-full">{content}</div>;
              const isLast = idx === baseCards.length - 1;
              const isOdd = baseCards.length % 2 !== 0;

              return (
                <div
                  key={item.id}
                  className={`aspect-square ${isLast && isOdd ? 'col-span-2 justify-self-center w-1/2' : ''}`}
                  onTouchStart={() => handleMouseEnter(item.id)}
                  onTouchEnd={handleMouseLeave}
                >
                  {item.href ? (
                    <Link key={item.id} href={item.href} className="block w-full h-full">
                      {card}
                    </Link>
                  ) : (
                    <div className="block w-full h-full">{card}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <InfoSection />
      </>
    );
  }

  // ════════════════════════════════════════════
  //  Desktop: sticky bubble + scroll section
  // ════════════════════════════════════════════
  return (
    <main>
      {/* Bubble section — sticky, fills viewport */}
      <section className="h-screen sticky top-0 overflow-hidden p-10">
        <div className="max-w-4xl mx-auto h-full" style={{ opacity: scrollOpacity, transition: 'opacity 0.1s linear' }}>
          <div ref={containerRef} className="relative h-full w-full">
          {/* ── SVG overlay: connections & orbiting particles ── */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
            {/* connection lines */}
            {connections.map((c) => (
              <line
                key={`${c.from}-${c.to}`}
                x1={c.fromX}
                y1={c.fromY}
                x2={c.toX}
                y2={c.toY}
                stroke="rgba(148,163,184,0.35)"
                strokeWidth={1.2}
                strokeDasharray="4 6"
                opacity={c.opacity}
              />
            ))}
            {/* orbiting particles */}
            {particles.map((p) => (
              <circle
                key={p.id}
                cx={p.x}
                cy={p.y}
                r={p.size}
                fill={CARD_COLORS[p.bubbleId] ?? '#94a3b8'}
                opacity={p.opacity}
              />
            ))}
          </svg>

          {/* ── cards ── */}
          {baseCards.map((item, index) => {
            const className = `bubble-wrap ${getCardClassName(item.id)}`;
            const pos = initialPositions.get(item.id);
            const style = pos
              ? { transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)` }
              : undefined;

            const inner = (
              <div
                className={`bubble-inner ${bloomReady ? 'bloom-start' : ''}`}
                style={{
                  width: `${item.size}px`,
                  height: `${item.size}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animationDelay: `${index * 0.06}s`,
                }}
              >
                <div style={{ width: '100%', height: '100%' }}>
                  {item.render(hoveredCard === item.id)}
                </div>
              </div>
            );

            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  ref={registerCard(item.id)}
                  className={className}
                  style={style}
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {inner}
                </Link>
              );
            }

            return (
              <div
                key={item.id}
                ref={registerCard(item.id)}
                className={className}
                style={style}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                {inner}
              </div>
            );
          })}
        </div>

          {/* scroll hint — minimal */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-5 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Info cards section */}
      <InfoSection />
    </main>
  );
}
