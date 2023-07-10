'use client';
import Image from 'next/image';
import classNames from '@/app/utils/classNames';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SizedInfo {
  userID: string;
  size?: number;
  children?: React.ReactNode;
}

const UserInfo = ({ userID, children, size = 60 }: SizedInfo) => {
  const [profile, setProfile] = useState<UsersProfile>();

  useEffect(() => {
    const initData = async () => {
      const profileData = await fetch(`/api/profile/${userID}`).then((res) => res.json());
      const profile = await profileData[userID];
      setProfile(profile);
    };

    initData();
  }, []);

  return (
    <div className="flex w-fit flex-wrap items-start justify-center lg:flex lg:flex-wrap lg:items-start">
      {profile && (
        <Image
          quality={100}
          width={size}
          height={size}
          src={profile.avatarURL}
          alt={'avatar'}
          style={{ borderRadius: '999px', objectFit: 'cover' }}
          className={classNames('aspect-[1/1] border border-white shadow-sm', size === 60 ? 'mt-2' : null)}
        />
      )}

      {profile && (
        <div className="ml-2">
          <div className="font-black text-gray-950">
            <Link href={`/profile/${userID}`}>{profile.username}</Link>
          </div>
          <div className="font-thin text-gray-700">{profile.level}</div>
          <div className="text-gray-700">{profile.hasLicence ? '執照已上傳' : '執照未上傳'}</div>
          <div className="mt-1">{children}</div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
