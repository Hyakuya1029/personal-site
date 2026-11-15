/*
 * 今日表情包 —— 选图逻辑。
 *
 * 素材不在代码里、也不在 git 里，而是放在 Supabase Storage 的 daily-gif bucket。
 * 加一张表情包 = 往 bucket 里传一张图，不用改代码、不用推送、不用等部署。
 *
 * 选哪一张：拿「上海时区的今天」这个字符串算哈希，对文件总数取余。
 *   同一天所有访客看到同一张 —— 这正是「每日」该有的效果，而且结果可被缓存。
 *   日期一变自动换新，不需要定时任务、也不需要数据库表。
 *
 * 代价：文件数量一变（加/删图），当天的选择可能会跟着变。不影响使用，知道就行。
 */

export interface MemeFile {
  /** bucket 内的文件名，例如 nwdx.webp */
  name: string;
  /** 公开访问地址 */
  url: string;
}

const TZ = 'Asia/Shanghai';

/** 取上海时区的 YYYY-MM-DD，作为「今天」的唯一标识 */
export function dayKey(date: Date = new Date()): string {
  // en-CA 的输出格式正好是 YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/** FNV-1a + 收尾混合：把一个日期字符串稳定地映射成一个整数 */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }

  // 收尾混合（avalanche）。
  // 不加这一步，只在末尾不同的字符串（日期正好如此）会得到相邻的哈希值，
  // 取模后表现为「昨天第 5 张、今天第 4 张、明天第 3 张」这种倒着数的观感。
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b);
  h ^= h >>> 16;

  return h >>> 0;
}

/** 从文件列表里挑出今天这一张；列表为空时返回 null */
export function pickForDay(files: MemeFile[], date: Date = new Date()): MemeFile | null {
  if (files.length === 0) return null;
  return files[hashString(dayKey(date)) % files.length];
}

/**
 * 距离上海时区下一个零点还有多少秒。
 * 用来给接口设缓存的 s-maxage —— 今天的答案到明天零点才会变，没必要每个请求都算一遍。
 */
export function secondsUntilNextDay(date: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const pick = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const elapsed = pick('hour') * 3600 + pick('minute') * 60 + pick('second');

  // 至少给 60 秒，避免刚好卡在零点时算出 0 导致不缓存
  return Math.max(60, 86400 - elapsed);
}
