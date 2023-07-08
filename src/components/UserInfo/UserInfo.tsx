import Image from 'next/image';
import classNames from '@/app/utils/classNames';
import Link from 'next/link';

interface SizedInfo extends Info {
  size?: number;
}

const UserInfo = ({ userID, imageURL, name, level, licence, children, size = 60 }: SizedInfo) => {
  return (
    <div className="flex w-fit flex-wrap items-start justify-center lg:flex lg:flex-wrap lg:items-start">
      <Image
        width={size}
        height={size}
        src={imageURL}
        alt={'avatar'}
        style={{ borderRadius: '999px', objectFit: 'cover' }}
        className={classNames('aspect-[1/1] border border-white shadow-sm', size === 60 ? 'mt-2' : null)}
      />
      <div className="ml-2">
        <div className="font-black text-gray-950">
          <Link href={`/profile/${userID}`}>{name}</Link>
        </div>
        <div className="font-thin text-gray-700">{level}</div>
        <div className="text-gray-700">{licence ? '執照已上傳' : '執照未上傳'}</div>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
};

export default UserInfo;
