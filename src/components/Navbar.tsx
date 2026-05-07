'use client';

import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: '首页', href: '/' },
  { name: '博客', href: '/blog' },
];

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            我的网站
          </Link>
          
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}