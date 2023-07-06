import Link from 'next/link';

const SideBar = () => {
  return (
    <>
      <div className="flex w-full z-50  fixed -bottom-0 md:top-[80px] lg:w-52  md:w-32 md:flex-col text-sm bg-slate-400">
        <h1 className="flex my-2">
          <div>🦄</div>
          <Link href={'/events'}>尋找潛水活動</Link>
        </h1>

        <h1 className="flex my-2">
          <div>🦄</div>
          <Link href={'/create-event'}>建立潛水活動 </Link>
        </h1>

        <h1 className="flex my-2">
          <div>🦄</div>
          <Link href={'/portal'}>管理潛水活動 </Link>
        </h1>

        <h1 className="flex my-2">
          <div>🦄</div>
          <Link href={'/messages'}>訊息</Link>
        </h1>

        <h1 className="flex my-2">
          <div>🦄</div>
          <Link href={'/locator'}>我的潛水員地圖</Link>
        </h1>

        <h1 className="flex my-2">
          <div>🦄</div>
          <Link href={`/profile/${'userID'}`}>個人檔案</Link>
        </h1>
      </div>
    </>
  );
};

export default SideBar;
