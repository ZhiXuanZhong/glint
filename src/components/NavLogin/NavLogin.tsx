'use client';
import Link from 'next/link';
import Image from 'next/image';
import { BiUserCircle } from 'react-icons/bi';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';

const NavLogin = () => {
  // const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  //   const userID = '';

  const [loaded, setLoaded] = useState(false);
  const userID = useAuthStore((state) => state.authUser);
  const [authUser, updateAuthUser] = useAuthStore((state) => [state.authProfile, state.authProfile]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {loaded && authUser ? (
        <Link href={`/profile/${userID}`}>
          <div className="mr-7 flex cursor-pointer items-center rounded-md border border-moonlight-50 px-4 py-1">
            <Image width="50" height="50" src={authUser?.avatarURL} alt="logo" style={{ objectFit: 'contain' }} className="rounded-full border border-white" />
            <div className="ml-2">{authUser?.username}</div>
          </div>
        </Link>
      ) : (
        <div>
          <Link href="/login">
            <button className="mr-7 flex items-center justify-center rounded-md border border-moonlight-900 px-8 py-2 pl-7 text-moonlight-950 transition-colors hover:bg-moonlight-200">
              <BiUserCircle className="mr-2 text-2xl" />
              登入
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default NavLogin;
