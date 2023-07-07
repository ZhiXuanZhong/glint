import Image from 'next/image';
const UserInfo = ({ imageURL, name, level, licence, children }: Info) => {
  return (
    <div className="m-2 flex items-center">
      <Image width={100} height={100} src={imageURL} alt={'avatar'} style={{ borderRadius: '999px', height: 'auto', width: '60px' }} className="border border-white shadow-sm" />
      <div className="ml-2">
        <div className=" font-black text-gray-900">{name}</div>
        <div className=" text-sm font-thin text-gray-500">{level}</div>
        <div className="text-xs text-gray-500">{licence ? '執照已上傳' : '執照未上傳'}</div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default UserInfo;
