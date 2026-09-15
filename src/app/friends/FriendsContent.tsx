'use client';

import { useEffect, useState } from 'react';
import FriendList from './FriendList';
import ApplyForm from './ApplyForm';

interface Friend {
  id: number;
  name: string;
  avatar: string;
  url: string;
  description: string;
  tags: string[];
}

export default function FriendsContent() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/friends')
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setFriends(json.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const allTags = Array.from(new Set(friends.flatMap(f => f.tags)));

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {error ? (
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm">
          友链加载失败，请刷新页面重试
        </p>
      ) : friends.length > 0 ? (
        <FriendList friends={friends} allTags={allTags} />
      ) : (
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm">
          还没有友链，来成为第一个吧
        </p>
      )}
      <ApplyForm />
    </>
  );
}
