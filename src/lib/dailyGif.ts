/*
 * 每日表情包：用「上海时区的日期」当种子，从精选集里挑一张。
 *
 * 为什么用日期当种子：
 *   同一天所有访客看到同一张 —— 这正是「每日」该有的效果，而且结果可被缓存。
 *   日期一变自动换新，不需要任何定时任务、也不需要数据库。
 */

export interface DailyGifItem {
  /** public/daily-gif/ 下的文件名。支持 .webp / .gif / .mp4 */
  file: string;
  /** 可选配文，显示在卡片底部 */
  caption?: string;
}

/*
 * ══════════ 素材清单 ══════════
 *
 * 加一张新图只要两步：
 *   1. 把文件放进 public/daily-gif/（文件名建议纯英文/数字，避免空格）
 *   2. 在下面数组里加一行
 *
 * 顺序无所谓 —— 日期是通过哈希和它对应的，不是按顺序轮播。
 * 所以你可以随时往中间插、往后面加，不会打乱已过去的日期。
 *
 * 示例：
 *   { file: 'cat-typing.webp', caption: '它在替我写代码' },
 *   { file: 'spinning-fish.mp4' },
 */
export const DAILY_GIFS: DailyGifItem[] = [
  { file: 'nwsk.png', caption: '奶蛙思考' },
  { file: 'nwdx.webp', caption: '奶蛙大笑' },
  { file: 'nwnn.webp', caption: '奶蛙扭捏' },
];

// 开发期兜底：漏写扩展名会让 /daily-gif/xxx 直接 404，
// 在页面上表现为「素材缺失」，很容易误判成接口坏了。
if (process.env.NODE_ENV !== 'production') {
  const missing = DAILY_GIFS.filter((i) => !/\.[a-z0-9]{2,5}$/i.test(i.file));
  if (missing.length > 0) {
    console.warn(
      '[每日表情包] 这些条目缺少扩展名，访问会 404：',
      missing.map((i) => i.file).join('、')
    );
  }
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
function hashString(input: string): number {
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

export interface DailyGifResult {
  /** 今天（上海时区）的日期标识 */
  date: string;
  /** 素材总数 */
  total: number;
  /** 今天的文件名，空清单时为 null */
  file: string | null;
  caption?: string;
  /** 浏览器可访问的路径 */
  src: string | null;
}

export function getDailyGif(date: Date = new Date()): DailyGifResult {
  const dateKey = dayKey(date);
  const total = DAILY_GIFS.length;

  // 还没有素材：返回空结果，前端显示「待补充」而不是报错
  if (total === 0) {
    return { date: dateKey, total: 0, file: null, src: null };
  }

  const item = DAILY_GIFS[hashString(dateKey) % total];

  return {
    date: dateKey,
    total,
    file: item.file,
    caption: item.caption,
    src: `/daily-gif/${item.file}`,
  };
}
