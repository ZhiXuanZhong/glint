import { headers } from 'next/headers';
import Image from 'next/image';
import { Key } from 'react';
import { convertLocationCode } from '@/app/utils/convertLocationCode';
import { convertCategoryCode } from '@/app/utils/convertCategoryCode';
import formatDate from '@/app/utils/formatDate';
import UserInfo from '@/components/UserInfo/UserInfo';
import ApplyButton from '@/components/ApplyButton/ApplyButton';
import FavoriteButton from '@/components/FavoriteButton/FavoriteButton';
import RegistrationList from '@/components/RegistrationList/RegistrationList';
import StaticCalendar from '@/components/StaticCalendar/StaticCalendar';

import { MdPool, MdOutlineLocalPolice, MdOutlineLayers, MdLocationOn, MdOutlineCalendarMonth } from 'react-icons/md';
import Link from 'next/link';
import FollowUserButton from '@/components/FollowUserButton/FollowUserButton';

export default async function Page({ params }: { params: { eventID: string } }) {
  // FIXME: workaround! server component can't fetch relative path
  // https://github.com/vercel/next.js/issues/46840
  const headersData = headers();
  const protocol = headersData.get('x-forwarded-proto');
  const host = headersData.get('host');

  async function getInfo(eventID: string) {
    const response = await fetch(`${protocol}://${host}/api/event/${eventID}`, { next: { revalidate: 5 } });
    return response.json();
  }

  async function getRating(userID: string) {
    const response = await fetch(`${protocol}://${host}/api/rating/${userID}`, { next: { revalidate: 60 } });
    return response.json();
  }

  const getProfile = async (userID: string) => {
    const response = await fetch(`${protocol}://${host}/api/profile/${userID}`, { next: { revalidate: 30 } });
    return response.json();
  };

  const parseProfile = (obj: UsersProfile, propertyName: keyof UsersProfile): UsersProfile => {
    if (obj.hasOwnProperty(propertyName)) {
      return {
        ...obj,
        [propertyName]: obj[propertyName],
      };
    }
    return obj;
  };

  const eventInfos = await getInfo(params.eventID);
  const { rating, reviewCount } = await getRating(eventInfos.data.organizer);
  // FIXME 這邊因為api回傳的格式是{id:{...data}}，property是變動的比較難取
  const rawOrganizerProfile = await getProfile(eventInfos.data.organizer);
  const organizerProfile = rawOrganizerProfile[eventInfos.data.organizer];
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  console.log(eventInfos);

  return (
    <div className="mx-4 flex h-screen flex-col p-10 md:mx-auto md:max-w-3xl lg:max-w-5xl">
      <h1 className="mb-6 border-b py-3 text-2xl font-semibold text-moonlight-900">{eventInfos.data.title}</h1>
      <div className="flex flex-col pb-20 md:flex md:flex-row">
        {/* left column starts here */}
        <div className="md:w-2/6 md:pr-3 ">
          <div className="mb-5">
            <div className="mb-6 flex items-center">
              <MdPool className="mr-1 text-xl" />
              <div className="text-xl font-medium text-moonlight-950">嚮導</div>
            </div>
            <div className="mx-auto flex w-full flex-col items-center rounded-sm  p-4 shadow-md shadow-moonlight-100">
              <UserInfo userID={eventInfos.data.organizer} size={80} />
              <div className="flex flex-col">
                <div className="mt-2 flex w-full flex-wrap gap-3">
                  <FollowUserButton />
                  <Link href={`/messages/${eventInfos.data.organizer}`}>
                    <button className="w-full rounded-sm border border-transparent bg-blue-400 py-1 text-base text-white hover:bg-sunrise-600 hover:transition-all md:w-24">發送訊息</button>
                  </Link>
                </div>
                <div className="mt-3 flex flex-col rounded-sm bg-moonlight-100 p-2">
                  <div className="text-center text-3xl font-black text-moonlight-800">{rating ? rating.toFixed(1) : ''}</div>
                  <div className="pt-1 text-center text-xs font-light text-gray-500">根據{reviewCount}篇評價</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="mt-3 flex items-center border-t border-t-moonlight-50 pt-2 text-xl font-medium text-moonlight-950">
              <MdOutlineLocalPolice className="mr-1 text-xl" />
              <div>活動建議</div>
            </div>
            <div className="mt-2 w-full text-sm font-light text-moonlight-800">{eventInfos.data.levelSuggection}</div>
          </div>

          <div className="mb-10">
            <div>
              <div className="mt-3 flex  items-center border-t border-t-moonlight-50 pt-2 text-xl font-medium text-moonlight-950">
                <MdOutlineLayers className="mr-1 text-xl" />
                <div>類型</div>
              </div>
            </div>
            <div className="mt-2 w-fit rounded-sm bg-moonlight-500 px-3 py-1 text-sm font-light text-white">{convertCategoryCode(eventInfos.data.category)}</div>
          </div>

          <div className="mb-10">
            <div className="mt-3 flex  items-center border-t border-t-moonlight-50 pt-2 text-xl font-medium text-moonlight-950">
              <MdLocationOn className="mr-1 text-xl" />
              <div>地點</div>
            </div>
            {eventInfos.data.locations?.map((location: string, index: Key) => (
              <div key={index} className="mt-2 w-fit rounded-sm bg-moonlight-500 px-3 py-1 text-sm font-light text-white">
                {convertLocationCode(location)}
              </div>
            ))}
          </div>

          <div>
            <div className="mb-3 mt-3 flex items-center border-t border-t-moonlight-50 pt-2 text-xl font-medium text-moonlight-950">
              <MdOutlineCalendarMonth className="mr-1 text-xl" />
              <div>時間</div>
            </div>
            <StaticCalendar start={eventInfos.data.startTime} end={eventInfos.data.endTime} />
          </div>
          {eventInfos.data.organizer !== userID && (
            <div className="mt-2 flex flex-col gap-3 border-t border-t-moonlight-50 pt-4">
              <ApplyButton eventID={params.eventID} />
              <FavoriteButton eventID={params.eventID} />
            </div>
          )}
        </div>
        {/* right column starts here */}
        <div className="order-first md:order-none md:w-4/6 md:pl-3">
          <div className=" shadow-sm">
            <Image width={0} height={0} sizes="100vw" style={{ width: '100%', height: '250px', objectFit: 'cover' }} src={eventInfos.data.mainImage} alt={'event picture'} />
          </div>
          <h2 className="mt-3 pb-3 pt-2 text-xl font-medium text-moonlight-950">活動詳情</h2>
          <div className="whitespace-pre-line py-3 text-sm leading-tight tracking-wide text-moonlight-900">{eventInfos.data.description}</div>
          <div className="mb-16 py-3">
            <RegistrationList eventID={params.eventID} organizerID={eventInfos.data.organizer} />
          </div>
        </div>
      </div>
    </div>
  );
}
