'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getLocationText } from '@/lib/getLocationText';

interface Message {
  id: number;
  name: string;
  content: string;
  country: string;
  region: string;
  created_at: string;
}

const WALL_COLORS = [
  'from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/20',
  'from-sky-50 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/20',
  'from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-green-900/20',
  'from-rose-50 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/20',
  'from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/20',
  'from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/20',
];

const BORDER_COLORS = [
  'border-amber-200 dark:border-amber-700',
  'border-sky-200 dark:border-sky-700',
  'border-emerald-200 dark:border-emerald-700',
  'border-rose-200 dark:border-rose-700',
  'border-violet-200 dark:border-violet-700',
  'border-orange-200 dark:border-orange-700',
];

const PIN_COLORS = [
  'bg-red-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-yellow-400',
  'bg-purple-400',
  'bg-pink-400',
];

const ROTATIONS = [-2, 1, -1, 2, -1.5, 0.5];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('获取留言失败:', error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), content: content.trim() }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || '提交失败');

      setName('');
      setEmail('');
      setContent('');
      await fetchMessages();
    } catch (error) {
      console.error('提交留言失败:', error);
      alert('提交失败，请重试');
    }
    setIsSubmitting(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          留言墙
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          每一条留言都是一张便签，贴在墙上成为独特的风景
        </p>
      </header>

      {/* Submit form */}
      <div className="mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          写一张便签
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="你的名字"
              maxLength={20}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-sm"
            />
          </div>
          <div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="(选填)如果希望我联系您，请填入你的邮箱"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-sm"
            />
          </div>
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="写下你想说的话..."
              rows={3}
              maxLength={500}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-sm resize-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {content.length}/500
            </span>
            <button
              type="submit"
              disabled={!name.trim() || !content.trim() || isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white text-sm font-medium transition-all disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              {isSubmitting ? '提交中...' : '贴到墙上'}
            </button>
          </div>
        </form>
      </div>

      {/* Message wall - sticky notes grid */}
      {isLoading ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <p>加载留言中...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <p className="text-lg">墙上还没有便签</p>
          <p className="text-sm mt-2">成为第一个留言的人吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {messages.map((msg, i) => {
            const location = getLocationText(msg.country, msg.region);

            return (
              <div
                key={msg.id}
                className="stagger-item"
                style={{
                  animationDelay: `${i * 0.08}s`,
                  transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)`,
                }}
              >
                <div
                  className={`relative bg-gradient-to-br ${WALL_COLORS[i % WALL_COLORS.length]} rounded-xl p-5 shadow-md border ${BORDER_COLORS[i % BORDER_COLORS.length]} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:rotate-0`}
                >
                  {/* Pin */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <div className={`w-5 h-5 rounded-full ${PIN_COLORS[i % PIN_COLORS.length]} shadow-md ring-2 ring-white dark:ring-gray-700`}>
                      <div className="w-2 h-2 rounded-full bg-white/60 absolute top-1 left-1" />
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mt-2 mb-4 whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                    <span className="font-medium text-gray-500 dark:text-gray-400">
                      — {msg.name}
                      {location && (
                        <span className="ml-1 text-green-600 text-[10px]">来自 {location}</span>
                      )}
                    </span>
                    <span>{formatDate(msg.created_at)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
