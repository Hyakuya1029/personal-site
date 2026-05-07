'use client';

import { useState } from 'react';
import AboutCard from '@/components/AboutCard';
import CalendarCard from '@/components/CalendarCard';
import { PlaceholderCard1, PlaceholderCard2, PlaceholderCard3, PlaceholderCard4 } from '@/components/PlaceholderCards';

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleMouseEnter = (cardId: string) => {
    setHoveredCard(cardId);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  const getCardClassName = (cardId: string) => {
    if (hoveredCard === null) {
      return '';
    }
    if (hoveredCard === cardId) {
      return '';
    }
    return 'scale-90 opacity-70';
  };

  return (
    <main className="min-h-screen p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-6">
          <div 
            className={`animate-float transition-all duration-300 ${getCardClassName('about')}`}
            onMouseEnter={() => handleMouseEnter('about')}
            onMouseLeave={handleMouseLeave}
          >
            <AboutCard isHovered={hoveredCard === 'about'} />
          </div>
          
          <div 
            className={`animate-pulse-glow transition-all duration-300 ${getCardClassName('calendar')}`}
            onMouseEnter={() => handleMouseEnter('calendar')}
            onMouseLeave={handleMouseLeave}
          >
            <CalendarCard isHovered={hoveredCard === 'calendar'} />
          </div>
          
          <div 
            className={`animate-float-slow transition-all duration-300 ${getCardClassName('portfolio')}`}
            onMouseEnter={() => handleMouseEnter('portfolio')}
            onMouseLeave={handleMouseLeave}
          >
            <PlaceholderCard2 isHovered={hoveredCard === 'portfolio'} />
          </div>
          
          <div 
            className={`animate-float-fast transition-all duration-300 ${getCardClassName('ideas')}`}
            onMouseEnter={() => handleMouseEnter('ideas')}
            onMouseLeave={handleMouseLeave}
          >
            <PlaceholderCard3 isHovered={hoveredCard === 'ideas'} />
          </div>
          
          <div 
            className={`animate-breathe transition-all duration-300 ${getCardClassName('favorites')}`}
            onMouseEnter={() => handleMouseEnter('favorites')}
            onMouseLeave={handleMouseLeave}
          >
            <PlaceholderCard4 isHovered={hoveredCard === 'favorites'} />
          </div>
          
          <div 
            className={`animate-float transition-all duration-300 ${getCardClassName('placeholder1')}`}
            onMouseEnter={() => handleMouseEnter('placeholder1')}
            onMouseLeave={handleMouseLeave}
            style={{ animationDelay: '1s' }}
          >
            <PlaceholderCard1 isHovered={hoveredCard === 'placeholder1'} />
          </div>
        </div>
      </div>
    </main>
  );
}