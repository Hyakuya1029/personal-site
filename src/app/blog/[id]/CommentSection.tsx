'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getLocationText } from '@/lib/getLocationText';

interface Comment {
  id: string;
  post_id: string;
  name: string;
  email: string;
  content: string;
  created_at: string;
  parent_id: string | null;
  country: string;
  region: string;
}

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [replyName, setReplyName] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('获取评论失败:', error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent, isReply: boolean = false) => {
    e.preventDefault();
    
    const submitName = isReply ? replyName : name;
    const submitEmail = isReply ? replyEmail : email;
    const submitContent = isReply ? replyContent : content;

    if (!submitName.trim() || !submitContent.trim()) {
      alert('请填写完整信息');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const commentData: Record<string, unknown> = {
        post_id: postId,
        name: submitName.trim(),
        email: submitEmail.trim(),
        content: submitContent.trim(),
      };

      if (isReply && replyTo) {
        commentData.parent_id = replyTo.id;
      }

      // 通过 API 路由提交评论（服务端获取IP和地理信息）
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || '提交失败');
      }
      
      if (isReply) {
        setReplyName('');
        setReplyEmail('');
        setReplyContent('');
        setReplyTo(null);
      } else {
        setName('');
        setEmail('');
        setContent('');
      }
      await fetchComments();
    } catch (error) {
      console.error('提交评论失败:', error);
      alert('提交失败，请重试');
    }
    
    setIsSubmitting(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const offset = 8 * 60 * 60 * 1000;
    const shanghaiTime = new Date(date.getTime() + offset);
    return shanghaiTime.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      second: '2-digit',
    }) + ' (UTC+8)';
  };

  const handleReply = (comment: { id: string; name: string }) => {
    setReplyTo(comment);
    setReplyName('');
    setReplyEmail('');
    setReplyContent('');
    setTimeout(() => {
      const replyForm = document.getElementById('reply-form');
      if (replyForm) {
        replyForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = replyForm.querySelector('input');
        if (firstInput) firstInput.focus();
      }
    }, 100);
  };

  const cancelReply = () => {
    setReplyTo(null);
    setReplyName('');
    setReplyEmail('');
    setReplyContent('');
  };

  const getReplies = (parentId: string) => {
    return comments.filter(c => c.parent_id === parentId);
  };

  const getRepliedComment = () => {
    if (!replyTo) return null;
    return comments.find(c => c.id === replyTo.id);
  };

  const getTopLevelComments = () => {
    return comments.filter(c => !c.parent_id);
  };


  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6">评论 ({comments.filter(c => !c.parent_id).length})</h2>

      {/* 回复表单 - 有回复时显示在顶部 */}
      {replyTo && (
        <div id="reply-form" className="mb-6 p-4 md:p-6 bg-gradient-to-r from-sky-50 to-sky-100 border-2 border-sky-300 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span className="text-sky-700 font-semibold">回复 @{replyTo.name}</span>
            </div>
            <button
              onClick={cancelReply}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-lg transition flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              取消回复
            </button>
          </div>
          {/* 被回复的评论内容预览 */}
          {getRepliedComment() && (
            <div className="mb-4 p-3 bg-white border border-gray-200 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">
                <span className="font-medium text-gray-700">{getRepliedComment()?.name}</span> 的评论：
              </div>
              <div className="text-sm text-gray-600 line-clamp-2">
                {getRepliedComment()?.content}
              </div>
            </div>
          )}
          <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={replyName}
                onChange={(e) => setReplyName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                placeholder="你的姓名 *"
                required
              />
              <input
                type="text"
                value={replyEmail}
                onChange={(e) => setReplyEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                placeholder="你的邮箱（选填）"
              />
            </div>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition resize-none"
              placeholder={`回复 @${replyTo.name}...`}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? '提交中...' : '提交回复'}
            </button>
          </form>
        </div>
      )}

      {/* 主评论表单 - 没有回复时显示 */}
      {!replyTo && (
        <form onSubmit={(e) => handleSubmit(e, false)} className="mb-8 p-4 md:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                姓名 *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                placeholder="请输入姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                邮箱
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                placeholder="(选填)如果希望我联系您，请填入你的邮箱"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              评论内容 *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition resize-none"
              placeholder="写下你的评论..."
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? '提交中...' : '发表评论'}
          </button>
        </form>
      )}

      {/* 评论列表 */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            <p>加载评论中...</p>
          </div>
        ) : getTopLevelComments().length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>暂无评论，快来发表第一条评论吧！</p>
          </div>
        ) : (
          getTopLevelComments().map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* 主评论 */}
              <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {comment.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">{comment.name}</h4>
                      {getLocationText(comment.country, comment.region) && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                           来自 {getLocationText(comment.country, comment.region)}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">{comment.content}</p>
                    <button
                      onClick={() => handleReply({ id: comment.id, name: comment.name })}
                      className="text-sm text-sky-600 hover:text-sky-800 mt-2"
                    >
                      回复
                    </button>
                  </div>
                </div>
              </div>

              {/* 回复列表 */}
              {getReplies(comment.id).length > 0 && (
                <div className="ml-4 md:ml-8 space-y-3 pl-2 md:pl-4 border-l-2 border-gray-200">
                  {getReplies(comment.id).map((reply) => (
                    <div key={reply.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {reply.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{reply.name}</h4>
                            {getLocationText(reply.country, reply.region) && (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                来自 {getLocationText(reply.country, reply.region)}
                              </span>
                            )}
                            <span className="text-xs text-gray-400">{formatDate(reply.created_at)}</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}