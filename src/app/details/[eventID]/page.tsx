import Image from 'next/image';
import Link from 'next/link';
import {
  MdPool,
  MdOutlineLocalPolice,
  MdOutlineLayers,
  MdLocationOn,
  MdOutlineCalendarMonth,
} from 'react-icons/md';

import UserInfo from '@/components/UserInfo/UserInfo';
import FollowUserButton from '@/components/FollowUserButton/FollowUserButton';
import StaticCalendar from '@/components/StaticCalendar/StaticCalendar';
import ApplyButton from '@/components/ApplyButton/ApplyButton';
import FavoriteButton from '@/components/FavoriteButton/FavoriteButton';
import RegistrationList from '@/components/RegistrationList/RegistrationList';

import serverAPI from '@/app/utils/serverAPI';
import { convertLocationCode } from '@/app/utils/convertLocationCode';
import { convertCategoryCode } from '@/app/utils/convertCategoryCode';

export default async function Page({ params }: { params: { eventID: string } }) {
  const eventInfo = (await serverAPI.getEventInfo(params.eventID)).data as Event;
  const { rating, reviewCount } = await serverAPI.getRating(eventInfo.organizer);

  return (
    <div className="mx-4 flex h-screen flex-col p-10 md:mx-auto md:max-w-3xl lg:max-w-5xl">
      <h1 className="mb-6 border-b py-3 text-2xl font-semibold text-moonlight-900">
        {eventInfo.title}
      </h1>
      <div className="flex flex-col pb-20 md:flex md:flex-row">
        <div className="md:w-2/6 md:min-w-[250px] md:pr-3">
          <div className="mb-5">
            <div className="mb-6 flex items-center">
              <MdPool className="mr-1 text-xl" />
              <div className="text-xl font-medium text-moonlight-950">嚮導</div>
            </div>
            <div className="mx-auto flex w-full flex-col items-center rounded-sm  p-4 shadow-md shadow-moonlight-100">
              <div className="min-h-[80px]">
                <UserInfo userID={eventInfo.organizer} size={80} />
              </div>
              <div className="flex flex-col">
                <div className="mt-2 flex w-full flex-wrap justify-center gap-3">
                  <FollowUserButton userID={eventInfo.organizer} />
                  <Link
                    href={`/messages/${eventInfo.organizer}`}
                    className="w-full rounded-sm border border-transparent bg-blue-400 py-1 text-center
                    text-white hover:bg-sunrise-600 hover:transition-all md:w-24"
                  >
                    <button>發送訊息</button>
                  </Link>
                </div>
                <div className="mt-3 flex flex-col rounded-sm bg-moonlight-100 p-2">
                  <div className="text-center text-3xl font-black text-moonlight-800">
                    {rating.toFixed(1)}
                  </div>
                  <div className="pt-1 text-center text-xs font-light text-gray-500">
                    根據{reviewCount}篇評價
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="mt-3 flex items-center border-t border-t-moonlight-50 pt-2 text-xl font-medium text-moonlight-950">
              <MdOutlineLocalPolice className="mr-1 text-xl" />
              <div>活動建議</div>
            </div>
            <div className="mt-2 w-full text-sm font-light text-moonlight-800">
              {eventInfo.levelSuggection}
            </div>
          </div>

          <div className="mb-10">
            <div>
              <div className="mt-3 flex  items-center border-t border-t-moonlight-50 pt-2 text-xl font-medium text-moonlight-950">
                <MdOutlineLayers className="mr-1 text-xl" />
                <div>類型</div>
              </div>
            </div>
            <div className="mt-2 w-fit rounded-sm bg-moonlight-500 px-3 py-1 text-sm font-light text-white">
              {convertCategoryCode(eventInfo.category)}
            </div>
          </div>

          <div className="mb-10">
            <div className="mt-3 flex  items-center border-t border-t-moonlight-50 pt-2 text-xl font-medium text-moonlight-950">
              <MdLocationOn className="mr-1 text-xl" />
              <div>地點</div>
            </div>
            {eventInfo.locations?.map((location: string, index: number) => (
              <div
                key={index}
                className="mt-2 w-fit rounded-sm bg-moonlight-500 px-3 py-1 text-sm font-light text-white"
              >
                {convertLocationCode(location)}
              </div>
            ))}
          </div>

          <div>
            <div className="mb-3 mt-3 flex items-center border-t border-t-moonlight-50 pt-2 text-xl font-medium text-moonlight-950">
              <MdOutlineCalendarMonth className="mr-1 text-xl" />
              <div>時間</div>
            </div>
            <StaticCalendar
              start={new Date(eventInfo.startTime)}
              end={new Date(eventInfo.endTime)}
            />
          </div>

          <div className="mt-2 flex flex-col gap-3 border-t border-t-moonlight-50 pt-4">
            <ApplyButton eventID={params.eventID} organizerID={eventInfo.organizer} />
            <FavoriteButton eventInfo={eventInfo} />
          </div>
        </div>

        <div className="order-first md:order-none md:w-4/6 md:pl-3">
          <div className=" shadow-sm">
            <Image
              width={550}
              height={250}
              style={{ width: '100%', height: '250px', objectFit: 'cover' }}
              src={eventInfo.mainImage}
              alt={'event picture'}
            />
          </div>
          <h2 className="mt-3 pb-3 pt-2 text-xl font-medium text-moonlight-950">活動詳情</h2>
          <div className="whitespace-pre-line py-3 text-sm leading-tight tracking-wide text-moonlight-900">
            {eventInfo.description}
          </div>
          <div className="mb-16 py-3">
            <RegistrationList eventID={params.eventID} organizerID={eventInfo.organizer} />
          </div>
        </div>
      </div>
    </div>
  );
}
