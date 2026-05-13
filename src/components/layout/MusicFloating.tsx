'use client';

import { useMusic } from './MusicProvider';

export default function MusicFloating() {
  const { song, active, playing, toggle, prev, next, songs, stop } = useMusic();

  if (!song || !active) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-2.5 ring-2 ring-orange-400/40">
      <button onClick={prev} disabled={songs.length < 2}
        className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:scale-110 transition disabled:opacity-30">
        <svg className="w-3 h-3 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6z"/></svg>
      </button>

      <button onClick={toggle}
        className="w-8 h-8 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center hover:scale-110 transition shrink-0">
        {playing
          ? <svg className="w-4 h-4 text-orange-600 dark:text-orange-300" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
          : <svg className="w-4 h-4 text-orange-600 dark:text-orange-300 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        }
      </button>

      <button onClick={next} disabled={songs.length < 2}
        className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:scale-110 transition disabled:opacity-30">
        <svg className="w-3 h-3 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6h2v12h-2V6z"/></svg>
      </button>

      <button onClick={stop}
        className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:scale-110 transition">
        <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
      </button>

      <div className="overflow-hidden max-w-[120px]">
        <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap animate-marquee inline-flex gap-x-6">
          <span>{song.title}{song.artist ? ` · ${song.artist}` : ''}</span>
          <span>{song.title}{song.artist ? ` · ${song.artist}` : ''}</span>
          <span>{song.title}{song.artist ? ` · ${song.artist}` : ''}</span>
        </p>
      </div>
    </div>
  );
}
