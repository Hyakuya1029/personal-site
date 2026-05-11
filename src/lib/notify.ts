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
  type: 'comment' | 'message';
  name: string;
  content: string;
  email?: string;
  postId?: string;
  country?: string;
  region?: string;
}

export async function sendNotification(payload: NotifyPayload) {
  if (!transporter || !notifyEmail) return;

  const { type, name, content, email, postId, country, region } = payload;

  const label = type === 'comment' ? '评论' : '留言';
  const location = [country, region].filter(Boolean).join(' ');

  const subject = `[个人站点] 新${label}来自 ${name}`;
  const body = [
    `类型：${label}`,
    `昵称：${name}`,
    email && `邮箱：${email}`,
    type === 'comment' && postId && `文章：${postId}`,
    `内容：${content}`,
    location && `位置：${location}`,
  ].filter(Boolean).join('\n');

  transporter.sendMail({
    from: qqEmail,
    to: notifyEmail,
    subject,
    text: body,
  }).then(
    () => console.log('[notify] 邮件发送成功'),
    (err) => console.error('[notify] 邮件发送失败:', err.message)
  );
}
