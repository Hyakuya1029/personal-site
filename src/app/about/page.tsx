'use client';

import { useState } from 'react';
import FilterPill from '@/components/ui/FilterPill';

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface WebsiteTech {
  name: string;
  description: string;
}

const websiteTechs: WebsiteTech[] = [
  {
    name: 'Next.js',
    description: '网站的前后端框架',
  },
  {
    name: 'TypeScript',
    description: '类型安全的开发语言',
  },
  {
    name: 'Tailwind CSS',
    description: '网站的样式方案',
  },
  {
    name: 'Supabase',
    description: '数据库与后端服务',
  },
];

const skills: Skill[] = [
  { name: 'Java', level: 1, category: '后端' },
  { name: 'C++', level: 1, category: '后端' },
  { name: 'Web', level: 1, category: '前端' },
  { name: 'HTML', level: 1, category: '前端' },
  { name: 'CSS', level: 1, category: '前端' },
  { name: 'Vue', level: 1, category: '前端' },
  { name: 'Node.js', level: 1, category: '后端' },
  { name: 'MySQL', level: 1, category: '数据库' },
  { name: 'PostgreSQL', level: 1, category: '数据库' },
  { name: 'Oracle Database', level: 1, category: '数据库' },
];

const timeline: TimelineItem[] = [
  { year: '2024', title: '大学入学', description: '学习 Java 和基础编程' },
];

const categories = Array.from(new Set(skills.map(s => s.category)));

export default function AboutPage() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const filteredSkills = activeCategory === '全部'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  const renderTechIcon = (name: string) => {
    switch (name) {
      case 'Next.js':
        return <span className="text-sm font-extrabold">N</span>;
      case 'TypeScript':
        return (
          <span className="text-sm font-extrabold tracking-tight">TS</span>
        );
      case 'Tailwind CSS':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 6c-2.67 0-4.33 1.33-5 4 .67-1.33 1.78-1.83 3.33-1.5.72.16 1.24.69 1.82 1.28C13.1 10.73 14.18 12 16.5 12c2.67 0 4.33-1.33 5-4-.67 1.33-1.78 1.83-3.33 1.5-.72-.16-1.24-.69-1.82-1.28C15.4 7.27 14.32 6 12 6zM7.5 12c-2.67 0-4.33 1.33-5 4 .67-1.33 1.78-1.83 3.33-1.5.72.16 1.24.69 1.82 1.28C8.6 16.73 9.68 18 12 18c2.67 0 4.33-1.33 5-4-.67 1.33-1.78 1.83-3.33 1.5-.72-.16-1.24-.69-1.82-1.28C10.9 13.27 9.82 12 7.5 12z" />
          </svg>
        );
      case 'Supabase':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.9 2.5L5 14h5.5l-1.4 7.5L19 10h-5.5l.4-7.5z" />
          </svg>
        );
      default:
        return <span className="text-sm font-bold">{name.charAt(0)}</span>;
    }
  };

  const techGradient = (name: string) => {
    switch (name) {
      case 'Next.js':
        return 'from-gray-700 to-black dark:from-gray-600 dark:to-gray-900';
      case 'TypeScript':
        return 'from-blue-500 to-blue-700';
      case 'Tailwind CSS':
        return 'from-cyan-400 to-cyan-600';
      case 'Supabase':
        return 'from-emerald-400 to-emerald-600';
      default:
        return 'from-sky-400 to-sky-600';
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">关于</h1>
      </header>

      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 dark:text-gray-100">
          <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          关于网站
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {websiteTechs.map((tech) => (
            <div
              key={tech.name}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors group"
            >
              <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${techGradient(tech.name)} flex items-center justify-center text-white shadow group-hover:shadow-md transition-shadow`}>
                {renderTechIcon(tech.name)}
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1">
                {tech.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {tech.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 leading-loose">
          <strong className="text-gray-700 dark:text-gray-200">* 本网站通过agent代理进行全自动开发</strong><br />
          此外网站还使用了 react-markdown、gray-matter 等技术实现各种视觉效果以及网站功能
        </p>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 dark:text-gray-100">
          <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
          个人简介
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">基本信息</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <span>Hyakuya</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <span>学生</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <span className="break-all">hyakuya_site@qq.com</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </span>
                <span>软件工程</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">自我介绍</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-loose">
              一个不会敲代码、不会做项目的计算机专业废柴；<br />
              跟着兴趣走，享受过程，随心而动，收获结果；<br />
              在这个网站里，分享自己喜欢和感兴趣的东西。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 dark:text-gray-100">
          <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          技能栈
        </h2>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <FilterPill
            label="全部"
            isActive={activeCategory === '全部'}
            onClick={() => setActiveCategory('全部')}
          />
          {categories.map(cat => (
            <FilterPill
              key={cat}
              label={cat}
              isActive={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>

        <div className="space-y-4">
          {filteredSkills.map((skill, i) => (
            <div
              key={skill.name}
              className="group stagger-item"
              style={{ animationDelay: `${i * 0.08}s` }}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium transition-colors ${
                  hoveredSkill === skill.name ? 'text-sky-600' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {skill.name}
                </span>
                <span className={`text-sm transition-colors ${
                  hoveredSkill === skill.name ? 'text-sky-600' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {skill.level}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-sky-400 to-sky-500 rounded-full transition-all duration-500 ${
                    hoveredSkill === skill.name ? 'shadow-lg shadow-sky-200' : ''
                  }`}
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 dark:text-gray-100">
          <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          时间线
        </h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={item.year} className="flex gap-6">
                <div className="relative">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold
                    transition-all duration-300
                    ${index === timeline.length - 1 
                      ? 'bg-gradient-to-br from-sky-500 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}
                  `}>
                    {item.year.slice(-2)}
                  </div>
                  {index === timeline.length - 1 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-sky-400 rounded-full border-2 border-white animate-pulse" />
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{item.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}