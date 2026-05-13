'use client';

import { useEffect } from 'react';
import Card from './Card';
import { supabase } from '@/lib/supabase';
import { useMusic } from '@/components/layout/MusicProvider';

interface MusicCardProps {
  isHovered?: boolean;
}

export default function MusicCard({ isHovered = false }: MusicCardProps) {
  const { songs, song, playing, toggle, prev, next, setSongs } = useMusic();

  useEffect(() => {
    supabase
      .from('music')
      .select('title, artist, audio_url')
      .eq('active', true)
      .order('created_at', { ascending: true })
      .then(({ data }) => { if (data && data.length > 0) setSongs(data); });
  }, [setSongs]);

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/20" isHovered={isHovered}>
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-1 mb-3">
          <button onClick={prev} disabled={songs.length < 2}
            className="w-7 h-7 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center hover:scale-110 transition disabled:opacity-30">
            <svg className="w-4 h-4 text-orange-600 dark:text-orange-300" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6z"/></svg>
          </button>
          <button onClick={toggle}
            className="w-10 h-10 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center hover:scale-110 transition">
            {playing
              ? <svg className="w-5 h-5 text-orange-600 dark:text-orange-300" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
              : <svg className="w-5 h-5 text-orange-600 dark:text-orange-300 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            }
          </button>
          <button onClick={next} disabled={songs.length < 2}
            className="w-7 h-7 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center hover:scale-110 transition disabled:opacity-30">
            <svg className="w-4 h-4 text-orange-600 dark:text-orange-300" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6h2v12h-2V6z"/></svg>
          </button>
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">音乐</h3>
        {song ? (
          <div className="w-full overflow-hidden">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed whitespace-nowrap animate-marquee inline-flex gap-x-6">
              <span>{song.title}{song.artist ? ` · ${song.artist}` : ''}</span>
              <span>{song.title}{song.artist ? ` · ${song.artist}` : ''}</span>
              <span>{song.title}{song.artist ? ` · ${song.artist}` : ''}</span>
            </p>
          </div>
        ) : (
          <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">暂无歌曲</p>
        )}
      </div>
    </Card>
  );
}
