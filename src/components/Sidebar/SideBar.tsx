import { MdOutlineContentPasteSearch, MdOutlineAddCircleOutline, MdNewspaper, MdRecordVoiceOver, MdTravelExplore, MdPerson } from 'react-icons/md';
import Link from 'next/link';

const SideBar = () => {
  return (
    <>
      <div
        className="fixed -bottom-0 z-50 flex h-14 w-full items-center justify-around 
        border-t border-r-moonlight-100 border-t-moonlight-100 bg-white text-moonlight-950 md:top-[80px] 
        md:h-full md:w-52 md:flex-col md:items-start md:justify-start md:border-r md:border-t md:px-2 md:pt-3"
      >
        {/* MdOutlineContentPasteSearch */}
        <div className="flex h-9 rounded font-normal text-moonlight-950 transition-colors hover:bg-moonlight-100 hover:text-neutral-950 md:w-full">
          <Link href={'/events'} className="flex items-center md:m-2 md:ml-6 ">
            <div className="text-3xl md:text-xl">
              <MdOutlineContentPasteSearch />
            </div>
            <div className="hidden pl-3 text-[17px] md:flex">尋找潛水活動</div>
          </Link>
        </div>

        {/* MdOutlineAddCircleOutline */}
        <div className="flex h-9 rounded font-normal text-moonlight-950 transition-colors hover:bg-moonlight-100 hover:text-neutral-950 md:w-full">
          <Link href={'/create-event'} className="flex items-center md:m-2 md:ml-6 ">
            <div className="text-3xl md:text-xl">
              <MdOutlineAddCircleOutline />
            </div>

            <div className="hidden pl-3 text-[17px] md:flex">建立潛水活動</div>
          </Link>
        </div>

        {/* MdNewspaper */}
        <div className="flex h-9 rounded font-normal text-moonlight-950 transition-colors hover:bg-moonlight-100 hover:text-neutral-950 md:w-full">
          <Link href={'/portal'} className="flex items-center md:m-2 md:ml-6 ">
            <div className="text-3xl md:text-xl">
              <MdNewspaper />
            </div>
            <div className="hidden pl-3 text-[17px] md:flex">管理潛水活動</div>
          </Link>
        </div>

        <div className="hidden w-full items-center px-3 py-2 md:flex">
          <div className="flex-grow border-t border-moonlight-200"></div>
        </div>

        {/* MdRecordVoiceOver */}
        <div className="flex h-9 rounded font-normal text-moonlight-950 transition-colors hover:bg-moonlight-100 hover:text-neutral-950 md:w-full">
          <Link href={'/messages'} className="flex items-center md:m-2 md:ml-6 ">
            <div className="text-3xl md:text-xl">
              <MdRecordVoiceOver />
            </div>
            <div className="hidden pl-3 text-[17px] md:flex">訊息</div>
          </Link>
        </div>

        {/* MdTravelExplore */}
        <div className="flex h-9 rounded font-normal text-moonlight-950 transition-colors hover:bg-moonlight-100 hover:text-neutral-950 md:w-full">
          <Link href={'/locator'} className="flex items-center md:m-2 md:ml-6 ">
            <div className="text-3xl md:text-xl">
              <MdTravelExplore />
            </div>
            <div className="hidden pl-3 text-[17px] md:flex">我的潛水員地圖</div>
          </Link>
        </div>

        <div className="hidden w-full items-center px-3 py-2 md:flex">
          <div className="flex-grow border-t border-moonlight-200"></div>
        </div>

        {/* MdPerson */}
        <div className="flex h-9 rounded font-normal text-moonlight-950 transition-colors hover:bg-moonlight-100 hover:text-neutral-950 md:w-full">
          <Link href={`/profile/${'userID'}`} className="flex items-center md:m-2 md:ml-6 ">
            <div className="text-3xl md:text-xl">
              <MdPerson />
            </div>
            <div className="hidden pl-3 text-[17px] md:flex">個人檔案</div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SideBar;
