'use client';
import { MdOutlineContentPasteSearch, MdOutlineAddCircleOutline, MdNewspaper, MdRecordVoiceOver, MdTravelExplore } from 'react-icons/md';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfileButton from '../ProfileButton/ProfileButton';
import classNames from '@/app/utils/classNames';
import { useEffect, useState } from 'react';

const SideBar = () => {
  const currentPage = usePathname().split('/')[1];

  return (
    <>
      <div
        className="fixed -bottom-0 z-50 flex h-14 w-full items-center justify-around 
        border-t border-r-moonlight-100 border-t-moonlight-100 bg-white text-moonlight-950 md:top-[80px] 
        md:h-full md:w-52 md:flex-col md:items-start md:justify-start md:border-r md:border-t md:px-2 md:pt-3"
      >
        {/* MdOutlineContentPasteSearch */}
        <div
          className={classNames(
            'flex h-9 rounded font-normal text-moonlight-950 transition-colors hover:bg-moonlight-100 hover:text-neutral-950 md:w-full',
            currentPage === 'events' ? 'text-sunrise-500' : null
          )}
        >
          <Link href={'/events'} className="flex items-center md:m-2 md:ml-6 ">
            <div className="text-3xl md:text-xl">
              <MdOutlineContentPasteSearch />
            </div>
            <div className="hidden pl-3 text-[17px] md:flex">尋找潛水活動</div>
          </Link>
        </div>

        {/* MdOutlineAddCircleOutline */}
        <div
          className={classNames(
            'flex h-9 rounded font-normal text-moonlight-950 transition-colors hover:bg-moonlight-100 hover:text-neutral-950 md:w-full',
            currentPage === 'create-event' ? 'text-sunrise-500' : null
          )}
        >
          <Link href={'/create-event'} className="flex items-center md:m-2 md:ml-6 ">
            <div className="text-3xl md:text-xl">
              <MdOutlineAddCircleOutline />
            </div>

            <div className="hidden pl-3 text-[17px] md:flex">建立潛水活動</div>
          </Link>
        </div>

        {/* MdNewspaper */}
        <div
          className={classNames(
            'flex h-9 rounded font-normal text-moonlight-950 transition-colors hover:bg-moonlight-100 hover:text-neutral-950 md:w-full',
            currentPage === 'portal' ? 'text-sunrise-500' : null
          )}
        >
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
        <div
          className={classNames(
            'flex h-9 rounded font-normal text-moonlight-950 transition-colors hover:bg-moonlight-100 hover:text-neutral-950 md:w-full',
            currentPage === 'messages' ? 'text-sunrise-500' : null
          )}
        >
          <Link href={'/messages'} className="flex items-center md:m-2 md:ml-6 ">
            <div className="text-3xl md:text-xl">
              <MdRecordVoiceOver />
            </div>
            <div className="hidden pl-3 text-[17px] md:flex">訊息</div>
          </Link>
        </div>

        {/* MdTravelExplore */}
        <div
          className={classNames(
            'flex h-9 rounded font-normal text-moonlight-950 transition-colors hover:bg-moonlight-100 hover:text-neutral-950 md:w-full',
            currentPage === 'locator' ? 'text-sunrise-500' : null
          )}
        >
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
      </div>
    </>
  );
};

export default SideBar;
