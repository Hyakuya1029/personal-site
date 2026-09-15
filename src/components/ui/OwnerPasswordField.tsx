'use client';

import { useState } from 'react';

interface OwnerPasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/*
 * 站长标识开关：默认折叠成一个不起眼的小链接，普通访客不会看到多余字段。
 * 填入正确密码后，提交的内容才会带上「站长」徽章。
 */
export default function OwnerPasswordField({ value, onChange }: OwnerPasswordFieldProps) {
  const [open, setOpen] = useState(value !== '');

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-gray-300 dark:text-gray-600 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
        title="站长标识"
      >
        站长标识
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="站长密码"
        autoComplete="off"
        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all text-xs"
      />
      <button
        type="button"
        onClick={() => {
          onChange('');
          setOpen(false);
        }}
        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        取消
      </button>
    </div>
  );
}
