'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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

  useEffect(() => {
    supabase
      .from('friend_applications')
      .select('id, name, avatar, url, description, tags')
      .eq('status', 'approved')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setFriends(data);
        setLoading(false);
      });
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
      {friends.length > 0 ? (
        <FriendList friends={friends} allTags={allTags} />
      ) : (
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm">
          暂无友链，来成为第一个吧
        </p>
      )}
      <ApplyForm />
    </>
  );
}
