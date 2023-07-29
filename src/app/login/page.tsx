'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/authStore';
import { EmailLogin } from '@/components/Login/Login';

const Page = () => {
  const router = useRouter();

  const [authUser] = useAuthStore((state) => [state.authUser]);

  useEffect(() => {
    if (authUser) router.back();
  }, [authUser]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center pt-12">
        <EmailLogin />
      </div>
      <div className="pt-6 text-center text-sunrise-600 hover:text-sunrise-400">
        <Link href={'/signup'}>馬上註冊</Link>
      </div>
    </div>
  );
};

export default Page;
