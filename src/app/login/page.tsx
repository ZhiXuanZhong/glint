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
      <div className="pt-6 text-center">
        <Link href={'/signup'} className="text-sunrise-600 hover:text-sunrise-400">
          馬上註冊
        </Link>
      </div>
      <div className="flex flex-col items-center pt-6 text-left">
        <div>或是</div>
        <div>使用另一組測試帳號</div>
        <table className="border">
          <thead>
            <tr>
              <th>Name</th>
              <th>David Chu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Email</td>
              <td>admin@demo.com</td>
            </tr>
            <tr>
              <td>Password</td>
              <td>admin@demo.com</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
