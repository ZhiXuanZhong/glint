'use client';

import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { MdPerson } from 'react-icons/md';

const ProfileButton = () => {
  const userID = useAuthStore((state) => state.authUser);

  return (
    <div className="flex h-9 rounded font-normal text-moonlight-950 transition-colors hover:bg-moonlight-100 hover:text-neutral-950 md:w-full">
      <Link href={userID ? `/profile/${userID}` : `/login`} className="flex items-center md:m-2 md:ml-6 ">
        <div className="text-3xl md:text-xl">
          <MdPerson />
        </div>
        <div className="hidden pl-3 text-[17px] md:flex">個人檔案</div>
      </Link>
    </div>
  );
};

export default ProfileButton;
