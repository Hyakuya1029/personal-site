'use client';

import { useEffect, useRef, useState } from 'react';

/*
 * 统一的数据请求 hook：loading / error 一次搞定，调用方只管拿 data。
 *
 * 同时内置「请求去重 + 短期缓存」：
 *   同一个 URL 在 TTL 内只会真正发出一次请求。
 *   所以页面上多个组件需要同一份数据时（比如 AboutCard 和 InfoSection 都要 /api/stats），
 *   只会打一次接口，其余组件复用同一个 Promise。
 *
 * 约定：所请求的接口返回 { success: true, data } 这层信封，
 * hook 会自动拆掉信封，只把 data 交给调用方。
 */

interface CacheEntry {
  at: number;
  promise: Promise<unknown>;
}

const cache = new Map<string, CacheEntry>();

const DEFAULT_TTL_MS = 30_000;

function fetchOnce<T>(url: string, ttlMs: number): Promise<T> {
  const now = Date.now();
  const hit = cache.get(url);

  // 命中缓存：直接复用那次请求（可能还在飞行中）
  if (hit && now - hit.at < ttlMs) {
    return hit.promise as Promise<T>;
  }

  const promise = fetch(url)
    .then((res) => res.json())
    .then((json) => {
      if (!json || json.success !== true) {
        throw new Error(json?.error || '请求失败');
      }
      return json.data as T;
    });

  cache.set(url, { at: now, promise });

  // 失败就把缓存清掉，下次请求还能重试
  promise.catch(() => {
    if (cache.get(url)?.promise === promise) cache.delete(url);
  });

  return promise;
}

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
}

export function useApiData<T>(url: string, ttlMs: number = DEFAULT_TTL_MS): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({ data: null, loading: true, error: false });
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    setState({ data: null, loading: true, error: false });

    fetchOnce<T>(url, ttlMs)
      .then((data) => {
        if (aliveRef.current) setState({ data, loading: false, error: false });
      })
      .catch((err) => {
        console.warn(`[useApiData] ${url} 请求失败:`, err);
        if (aliveRef.current) setState({ data: null, loading: false, error: true });
      });

    return () => {
      aliveRef.current = false;
    };
  }, [url, ttlMs]);

  return state;
}
