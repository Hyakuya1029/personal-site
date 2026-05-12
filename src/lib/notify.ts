import nodemailer from 'nodemailer';

const qqEmail = process.env.QQ_EMAIL;
const qqPass = process.env.QQ_EMAIL_PASS;
const notifyEmail = process.env.NOTIFY_EMAIL;

const transporter = qqEmail && qqPass
  ? nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: true,
      auth: { user: qqEmail, pass: qqPass },
    })
  : null;

interface NotifyPayload {
  type: 'comment' | 'message' | 'friend_application';
  name: string;
  content: string;
  email?: string;
  postId?: string;
  url?: string;
  tags?: string[];
  country?: string;
  region?: string;
}

const typeLabel: Record<NotifyPayload['type'], string> = {
  comment: '评论',
  message: '留言',
  friend_application: '友链申请',
};

export async function sendNotification(payload: NotifyPayload) {
  if (!transporter || !notifyEmail) return;

  const { type, name, content, email, postId, url, tags, country, region } = payload;

  const label = typeLabel[type];
  const location = [country, region].filter(Boolean).join(' ');

  const subject = `[个人站点] 新${label}来自 ${name}`;
  const body = [
    `类型：${label}`,
    `昵称：${name}`,
    email && `邮箱：${email}`,
    url && `链接：${url}`,
    tags && tags.length > 0 && `标签：${tags.join(' / ')}`,
    type === 'comment' && postId && `文章：${postId}`,
    `内容：${content}`,
    location && `位置：${location}`,
  ].filter(Boolean).join('\n');

  try {
    await transporter.sendMail({
      from: qqEmail,
      to: notifyEmail,
      subject,
      text: body,
    });
    console.log('[notify] 邮件发送成功');
  } catch (err: any) {
    console.log('[notify] 邮件发送失败:', err.message);
  }
}
