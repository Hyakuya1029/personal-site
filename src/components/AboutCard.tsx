'use client';

import Card from './Card';
import Image from 'next/image';

interface AboutCardProps {
  isHovered?: boolean;
}

export default function AboutCard({ isHovered = false }: AboutCardProps) {
  return (
    <Card width="w-80" height="h-64" className="relative overflow-hidden" isHovered={isHovered}>
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full opacity-20" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-3">
          博主
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">关于我</h3>
        <p className="text-xs text-gray-500 mb-3">
          Hyakuya<br />
        开发者 / 创作者
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Trae全自动开发测试中...<br />
          在这里记录我的学习和生活
        </p>
      </div>
    </Card>
  );
}