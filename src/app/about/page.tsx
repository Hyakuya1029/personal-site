import type { Metadata } from 'next';

const websiteTechs = [
  { name: 'Next.js', desc: '前端与后端框架', gradient: 'from-gray-700 to-black dark:from-gray-600 dark:to-gray-900' },
  { name: 'TypeScript', desc: '类型安全的开发语言', gradient: 'from-blue-500 to-blue-700' },
  { name: 'Tailwind CSS', desc: '原子化 CSS 样式方案', gradient: 'from-cyan-400 to-cyan-600' },
  { name: 'Supabase', desc: '数据库与后端服务', gradient: 'from-emerald-400 to-emerald-600' },
];

function TechIcon({ name }: { name: string }) {
  switch (name) {
    case 'Next.js': return <span className="text-sm font-extrabold">N</span>;
    case 'TypeScript': return <span className="text-sm font-extrabold tracking-tight">TS</span>;
    case 'Tailwind CSS': return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 6c-2.67 0-4.33 1.33-5 4 .67-1.33 1.78-1.83 3.33-1.5.72.16 1.24.69 1.82 1.28C13.1 10.73 14.18 12 16.5 12c2.67 0 4.33-1.33 5-4-.67 1.33-1.78 1.83-3.33 1.5-.72-.16-1.24-.69-1.82-1.28C15.4 7.27 14.32 6 12 6zM7.5 12c-2.67 0-4.33 1.33-5 4 .67-1.33 1.78-1.83 3.33-1.5.72.16 1.24.69 1.82 1.28C8.6 16.73 9.68 18 12 18c2.67 0 4.33-1.33 5-4-.67 1.33-1.78 1.83-3.33 1.5-.72-.16-1.24-.69-1.82-1.28C10.9 13.27 9.82 12 7.5 12z" />
      </svg>
    );
    case 'Supabase': return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.9 2.5L5 14h5.5l-1.4 7.5L19 10h-5.5l.4-7.5z" />
      </svg>
    );
    default: return <span className="text-sm font-bold">{name.charAt(0)}</span>;
  }
}

export const metadata: Metadata = {
  title: '关于',
  description: '关于本网站的技术栈与开发信息',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">关于</h1>
      </header>

      {/* ════════════════════════════════════════════
          1. 网站概况 — 架构与部署
          ════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 dark:text-gray-100">
          <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          部署架构
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* GitHub */}
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          >
            <svg className="w-8 h-8 text-gray-700 dark:text-gray-300 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">GitHub</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">代码托管</div>
            </div>
          </a>

          {/* Vercel */}
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          >
            <svg className="w-8 h-8 text-gray-700 dark:text-gray-300 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 22.525H0l12-21.05 12 21.05z" />
            </svg>
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">Vercel</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">构建与部署</div>
            </div>
          </a>

          {/* Cloudflare */}
          <a href="https://www.cloudflare.com" target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          >
            <svg className="w-8 h-8 text-gray-700 dark:text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
            </svg>
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">Cloudflare</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">DNS 解析</div>
            </div>
          </a>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          2. 技术栈
          ════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 dark:text-gray-100">
          <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          技术栈
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400 leading-loose mb-6">
          <strong className="text-gray-800 dark:text-gray-200">本网站通过 AI Agent 全自动开发。</strong>
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {websiteTechs.map((tech) => (
            <div key={tech.name}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors group"
            >
              <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${tech.gradient} flex items-center justify-center text-white shadow group-hover:shadow-md transition-shadow`}>
                <TechIcon name={tech.name} />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1">{tech.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{tech.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 leading-loose">
          此外还使用了 react-markdown、gray-matter 等技术实现网站功能和视觉效果。
        </p>
      </section>
    </main>
  );
}
