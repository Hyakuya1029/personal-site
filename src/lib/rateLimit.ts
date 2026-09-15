/*
 * 极简内存滑动窗口限流。
 *
 * ⚠️ 局限：Vercel 等 Serverless 环境下每个函数实例有自己的内存，
 * 实例会冷启动/回收，因此这只是"抬高门槛"的第一道防线，不是精确配额。
 * 真正的强限流需要 Redis / Upstash 之类的共享存储。
 * 它的作用是挡掉脚本式的连续刷提交（以及由此触发的邮件轰炸）。
 */

type Bucket = number[];

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }

  recent.push(now);
  buckets.set(key, recent);

  // 防止 Map 无限增长：偶尔清理已过期的 key
  if (buckets.size > 1000) {
    const stale: string[] = [];
    buckets.forEach((times, key) => {
      if (times.every((t) => now - t >= windowMs)) stale.push(key);
    });
    stale.forEach((key) => buckets.delete(key));
  }

  return true;
}
