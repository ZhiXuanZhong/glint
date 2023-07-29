'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

const MessageUserButton = ({ userID }: { userID: string }) => {
  const [authUser] = useAuthStore((state) => [state.authUser]);

  if (authUser === userID || !authUser) return;

  return (
    <Link
      href={`/messages/${userID}`}
      className="w-full rounded-sm border border-transparent bg-blue-400 py-1 text-center
    text-white hover:bg-sunrise-600 hover:transition-all md:w-24"
    >
      <button>發送訊息</button>
    </Link>
  );
};

export default MessageUserButton;
