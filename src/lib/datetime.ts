/*
 * Supabase 的时间戳有两种形态：
 *   timestamptz 列 → "2026-05-15T14:32:58.24581+00:00"  （带偏移）
 *   timestamp   列 → "2026-05-15T14:34:28.515383"       （无偏移，按 UTC 存储）
 *
 * JS 的 new Date() 会把"无偏移"的字符串按**浏览器本地时区**解析，
 * 于是同一个时间在不同访客的机器上会得到不同结果。
 * 这里统一补上 Z，确保任何情况下都按 UTC 解析。
 *
 * 注意：对已经带时区的字符串不做任何处理，
 * 所以即使将来把数据库列改成 timestamptz，本函数依然正确。
 */
export function parseDbTimestamp(value: string): Date {
  if (!value) return new Date(NaN);

  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
  // 只有完整的 date-time 字符串才补 Z，纯日期（"2026-05-15"）保持原样
  if (hasTimezone || !value.includes('T')) return new Date(value);

  return new Date(`${value}Z`);
}
