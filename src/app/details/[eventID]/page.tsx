import { headers } from 'next/headers';
import { Key } from 'react';
import UserInfo from '@/components/UserInfo/UserInfo';
import RegistrationList from '@/components/RegistrationList/RegistrationList';

interface UsersProfile {
  createdAt: { seconds: number; nanoseconds: number };
  avatarURL: string;
  firstDive: number;
  location: string;
  hasLicence: boolean;
  username: string;
  bio: string;
  level: string;
}

interface Applicants {
  level: string;
  name: string;
  applyTime: number[];
  id: string;
}

interface Participants {
  level: string;
  name: string;
  id: string;
}

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

  const eventInfos = await getInfo(params.eventID);
  const { rating } = await getRating(eventInfos.data.organizer);
  console.log(eventInfos);

  return (
    <>
      <h1 className="text-3xl">活動詳情</h1>
      <h2 className="font-bold text-xl">活動嚮導</h2>
      <UserInfo imageURL={`https://placehold.co/50x50?text=Avatar`} name={'Jacqueline Yu'} level={'SSI Level 1'} licence={false} />
      <div>organizer rating: {rating ? rating : ''}</div>
      <h2 className="font-bold text-xl">建議等級</h2>
      <div>{eventInfos.data.levelSuggection}</div>
      <h2 className="font-bold text-xl">活動類型</h2>
      <div>{eventInfos.data.category}</div>
      <h2 className="font-bold text-xl">活動地點</h2>
      <div>
        {eventInfos.data.locations?.map((location: string, index: Key) => (
          <div key={index}>{location}</div>
        ))}
      </div>
      {/* Pending - 活動時間 */}
      {/* Pending - 申請加入 btn */}
      {/* Pending - 蒐藏 btn */}
      <h2 className="font-bold text-xl">活動詳情</h2>
      <picture>
        <img src={eventInfos.data.mainImage} alt="Dive event image" />
      </picture>
      <p>{eventInfos.data.description}</p>
      {/* 活動清單要即時互動，用client component來做比較好 */}
      <RegistrationList eventID={params.eventID} />
    </>
  );
}
