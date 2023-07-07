import Image from 'next/image';
const UserInfo = ({ imageURL, name, level, licence, children }: Info) => {
  return (
    <div className="m-2 flex w-fit items-start ">
      <Image width={100} height={100} src={imageURL} alt={'avatar'} style={{ borderRadius: '999px', height: 'auto', width: '60px' }} className="mt-2 border border-white shadow-sm" />
      <div className="ml-2">
        <div className="font-black text-gray-950">{name}</div>
        <div className="font-thin text-gray-700">{level}</div>
        <div className="text-gray-700">{licence ? '執照已上傳' : '執照未上傳'}</div>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
};

export default UserInfo;
