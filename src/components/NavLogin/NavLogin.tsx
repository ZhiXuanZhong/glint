'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/app/utils/firebaseConfig';
import { useAuthStore } from '@/store/authStore';

import { BiUserCircle } from 'react-icons/bi';
import { MdPerson } from 'react-icons/md';
import { ImExit } from 'react-icons/im';
import ProfileButton from '../ProfileButton/ProfileButton';

const NavLogin = () => {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [authUser, updateAuthUser] = useAuthStore((state) => [
    state.authUser,
    state.updateAuthUser,
  ]);
  const [authProfile, updateAuthProfile] = useAuthStore((state) => [
    state.authProfile,
    state.updateAuthProfile,
  ]);

  const handleLogout = () => {
    const auth = getAuth(app);
    signOut(auth)
      .then(() => {
        console.log('Sign-out successful.');
        // Sign-out successful.
        updateAuthUser('');
        updateAuthProfile(null);
      })
      .catch((error) => {
        // An error happened.
      });
  };

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {loaded && authProfile ? (
        <div className="">
          <button
            className="relative mr-7 flex cursor-pointer items-center rounded-sm border border-moonlight-50 px-4 py-1 shadow-sm transition-colors hover:border-moonlight-400 hover:bg-gray-100"
            onClick={() => setOpen((prev) => !prev)}
          >
            <Image
              width="50"
              height="50"
              src={authProfile?.avatarURL}
              alt="logo"
              style={{ objectFit: 'contain' }}
              className="rounded-full border border-white"
            />
            <div className="mx-2 line-clamp-1">{authProfile?.username}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>

            <ul
              className={`absolute right-0 top-[60px] w-fit rounded-sm bg-white shadow-xl ${
                open ? 'block' : 'hidden'
              }`}
            >
              <Link href={`/profile/${authUser}`}>
                <li className="flex w-full items-center justify-end px-3 py-4 text-center text-[17px] hover:bg-gray-100">
                  <div className="mr-2 text-3xl md:text-xl">
                    <MdPerson />
                  </div>
                  個人檔案
                </li>
              </Link>
              <li
                className="flex w-full items-center justify-end px-3 py-4 text-center hover:bg-gray-100"
                onClick={handleLogout}
              >
                <div className="mr-2 text-3xl md:text-xl">
                  <ImExit />
                </div>
                登出
              </li>
            </ul>
          </button>
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

{
  /* <Link href={`/profile/${userID}`}>
</Link> */
}
