'use client';

import { useState } from 'react';

export default function ApplyForm() {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const valid = name.trim() && url.trim() && description.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/friends/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          url: url.trim(),
          description: description.trim(),
          email: email.trim() || undefined,
          avatar: avatar.trim() || undefined,
          tags: tags
            .split(/[,，]/)
            .map(t => t.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setName(''); setUrl(''); setDescription(''); setEmail(''); setAvatar(''); setTags('');
      setDone(true);
    } catch {
      alert('提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-12 max-w-md mx-auto">
      {done ? (
        <div className="text-center bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-2xl p-8">
          <p className="text-sky-700 dark:text-sky-300 font-medium">申请已提交，审核通过后显示</p>
          <button
            onClick={() => setDone(false)}
            className="mt-4 text-sm text-sky-500 hover:text-sky-600 underline"
          >
            再申请一个
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-300">
            申请友链
          </h3>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
            「<span className="text-red-500">*</span>」为必填项，未标注则为非必填项 <br />
            网站链接：你想交换的网页的链接，以「https://」开头 <br />
            网页描述：你对交换网页的描述，简单轻松即可 <br />
            头像链接：任意图片链接，或者可以联系我提供帮助，留空则使用默认图标 <br />
            联系邮箱：可以联系你的邮箱，最好填上，便于链接错误的交流与网站维护 <br />
            标签：你的网页内容可能包括什么，多个标签可以以逗号分隔 
          </p>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
              网站名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Hyakuyaの小站"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
              网站链接 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. https://hyakuya.cc.cd"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
              网站描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="e.g. 个人网站，分享自己喜欢和感兴趣的东西"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-sm resize-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
              头像链接
            </label>
            <input
              type="text"
              placeholder="e.g. https://github.com/Hyakuya1029.png"
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
              联系邮箱
            </label>
            <input
              type="text"
              placeholder="e.g. hyakuyasite@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
              标签
            </label>
            <input
              type="text"
              placeholder="e.g. 技术，Java，生活，游戏"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!valid || submitting}
            className="w-full px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white text-sm font-medium transition-all disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            {submitting ? '提交中...' : '提交申请'}
          </button>
        </form>
      )}
    </div>
  );
}
