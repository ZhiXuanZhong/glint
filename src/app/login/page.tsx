'use client';
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
      <div className="flex flex-col items-center py-24">
        <EmailLogin />
      </div>
    </div>
  );
};

export default Page;
