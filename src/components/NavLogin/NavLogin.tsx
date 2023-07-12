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

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {loaded && userID ? (
        <div className="mr-7 flex items-center rounded-md border border-moonlight-50 px-4 py-1">
          <Image
            width="50"
            height="50"
            src={
              'https://firebasestorage.googleapis.com/v0/b/glint-3041c.appspot.com/o/profile-image%2FrGd4NQzBRHgYUTdTLtFaUh8j8ot1_1688897462022?alt=media&token=7ed93d0e-f052-4078-aec6-8a286dd3d1cf'
            }
            alt="logo"
            style={{ objectFit: 'contain' }}
            className="rounded-full border border-white"
          />
          <div className="ml-2">{'倔強的小葡萄'}</div>
          {/* <Image width="45" height="45" src={userID.photoURL} alt="logo" style={{ objectFit: 'contain' }} className="rounded-full border border-white" />
          <div className="ml-2">{userID.displayName}</div> */}
        </div>
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
