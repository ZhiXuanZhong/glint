'use client';

import Link from 'next/link';
import { MdPerson } from 'react-icons/md';

const ProfileButton = ({ authUser }: { authUser: string }) => {
  return (
    <div>
      <Link href={authUser ? `/profile/${authUser}` : `/login`}>
        <div className="text-3xl md:text-xl">
          <MdPerson />
        </div>
        <div className="hidden pl-3 text-[17px] md:flex">個人檔案</div>
      </Link>
    </div>
  );
};

export default ProfileButton;
