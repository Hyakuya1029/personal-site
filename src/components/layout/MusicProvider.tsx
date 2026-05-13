'use client';

import { createContext, useContext, useState, useRef, useCallback, type ReactNode } from 'react';

interface Song {
  title: string;
  artist: string;
  audio_url: string;
}

interface MusicContextValue {
  songs: Song[];
  setSongs: (songs: Song[]) => void;
  index: number;
  playing: boolean;
  active: boolean;
  toggle: () => void;
  prev: () => void;
  next: () => void;
  stop: () => void;
  song: Song | null;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be inside MusicProvider');
  return ctx;
}

export default function MusicProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setPlaying(false);
    setActive(false);
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); }
  }, []);

  const playIndex = useCallback((i: number, list: Song[]) => {
    stop();
    const audio = new Audio(list[i].audio_url);
    audio.addEventListener('ended', () => {
      const next = (i + 1) % list.length;
      setIndex(next);
      playIndex(next, list);
    });
    audio.play().catch(() => {});
    audioRef.current = audio;
    setPlaying(true);
    setActive(true);
  }, [stop]);

  const toggle = useCallback(() => {
    if (playing) {
      pause();
      setPlaying(false);
      return;
    }
    if (songs.length === 0) return;
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
      setActive(true);
      return;
    }
    playIndex(index, songs);
  }, [playing, pause, songs, index, playIndex]);

  const prev = useCallback(() => {
    if (songs.length < 2) return;
    const i = (index - 1 + songs.length) % songs.length;
    setIndex(i);
    if (playing) playIndex(i, songs);
  }, [songs, index, playing, playIndex]);

  const next = useCallback(() => {
    if (songs.length < 2) return;
    const i = (index + 1) % songs.length;
    setIndex(i);
    if (playing) playIndex(i, songs);
  }, [songs, index, playing, playIndex]);

  return (
    <MusicContext.Provider value={{
      songs, setSongs, index, playing, active, toggle, prev, next, stop,
      song: songs[index] ?? null,
    }}>
      {children}
    </MusicContext.Provider>
  );
}
