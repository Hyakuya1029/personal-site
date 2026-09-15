/* 服务端输入校验工具 —— 客户端的 maxLength 只是体验优化，不能当安全边界 */

export function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  // 去掉首尾空白并硬截断，避免超长内容写库
  return value.trim().slice(0, maxLength);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return value.length <= 120 && EMAIL_RE.test(value);
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function cleanTagList(value: unknown, maxTags: number, maxTagLength: number): string[] {
  const raw = Array.isArray(value) ? value : [];
  const seen = new Set<string>();
  for (const item of raw) {
    const tag = cleanText(item, maxTagLength);
    if (tag) seen.add(tag);
    if (seen.size >= maxTags) break;
  }
  return Array.from(seen);
}
