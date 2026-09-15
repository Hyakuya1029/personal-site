import { createHash, timingSafeEqual } from 'crypto';

/*
 * 站长标识的判定。
 *
 * 旧做法是「拿填写的邮箱算哈希去比对」——但邮箱字段是任何人都能随意填的公开输入，
 * 拿它当身份凭据，等于允许任何人冒充站长。
 *
 * 现在改为：判定依据是「提交时是否提供了正确的站长密码」。
 * 密码只存在于服务端环境变量里，不进代码库、不下发到浏览器。
 */

const OWNER_EMAIL = (process.env.OWNER_EMAIL ?? '').trim().toLowerCase();
const OWNER_PASSWORD = process.env.OWNER_PASSWORD ?? '';

if (!OWNER_EMAIL || !OWNER_PASSWORD) {
  // 配置缺失时站长标识会静默失效，这里明确提示一次，避免「怎么没徽章」排查半天
  console.warn(
    '[owner] 站长标识未启用：请在环境变量中同时设置 OWNER_EMAIL 与 OWNER_PASSWORD' +
      `（当前 OWNER_EMAIL ${OWNER_EMAIL ? '已设置' : '缺失'}，OWNER_PASSWORD ${OWNER_PASSWORD ? '已设置' : '缺失'}）`
  );
}

function sha256(value: string): Buffer {
  return createHash('sha256').update(value, 'utf8').digest();
}

/** 定长比较：两侧先各自哈希成 32 字节，避免长度差异造成的信息泄漏 */
export function isValidOwnerPassword(password: string): boolean {
  if (!OWNER_PASSWORD || !password) return false;
  return timingSafeEqual(sha256(password), sha256(OWNER_PASSWORD));
}

/** 读取阶段：判断某条记录存的邮箱是否为站长邮箱 */
export function isOwnerEmail(email: string): boolean {
  if (!OWNER_EMAIL || !email) return false;
  return email.trim().toLowerCase() === OWNER_EMAIL;
}

/**
 * 写入阶段：决定这条记录该存哪个邮箱。
 *  - 密码正确          → 统一写入站长邮箱（读取时即可识别为站长）
 *  - 密码不对却填了站长邮箱 → 清空，杜绝冒充
 *  - 其余情况          → 原样保存访客自己填的邮箱
 *
 * 这样「邮箱 == 站长邮箱」就等价于「提交时密码正确」，标识无法被伪造。
 */
export function resolveStoredEmail(submittedEmail: string, password: string): string {
  if (isValidOwnerPassword(password)) return OWNER_EMAIL;

  const normalized = submittedEmail.trim().toLowerCase();
  if (OWNER_EMAIL && normalized === OWNER_EMAIL) return '';

  return submittedEmail.trim();
}
