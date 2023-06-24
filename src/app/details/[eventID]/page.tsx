import { headers } from 'next/headers';
import { Key } from 'react';
import UserInfo from '@/app/components/UserInfo/UserInfo';

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
    const response = await fetch(`${protocol}://${host}/api/rating/${userID}`, { next: { revalidate: 5 } });
    return response.json();
  }

  async function getProfile(userID: string) {
    const response = await fetch(`${protocol}://${host}/api/profile/${userID}`, { next: { revalidate: 5 } });
    return response.json();
  }

  async function getProfiles(data: { applicants: Applicants[]; participants: Participants[] }) {
    const profiles = {};
    const allParticipants = [...data.applicants, ...data.participants];

    for (const person of allParticipants) {
      const profile = await getProfile(person.id);
      Object.assign(profiles, profile);
    }

    return profiles;
  }

  const eventInfos = await getInfo(params.eventID);
  const { rating } = await getRating(eventInfos.data.organizer);
  const usersProfile: { [id: string]: UsersProfile } = await getProfiles(eventInfos);

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
        {eventInfos.data.locations.map((location: string, index: Key) => (
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
      <h2 className="font-bold text-xl">已加入活動</h2>
      {eventInfos.participants.map((participant: { name: string; level: string; id: string }, index: Key) => (
        <div key={index} className="shadow-md m-3 rounded-lg bg-gray-50">
          <picture>
            <img src={usersProfile[participant.id].avatarURL} alt="Avatar" />
          </picture>
          <div>{participant.name}</div>
          <div>{participant.level}</div>
          <button className="m-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">取消加入</button>
        </div>
      ))}

      <h2 className="font-bold text-xl">等待清單</h2>
      {eventInfos.applicants.map((applicant: { name: string; level: string; id: string }, index: Key) => (
        <div key={index} className="shadow-md m-3 rounded-lg bg-gray-50">
          <picture>
            <img src={usersProfile[applicant.id].avatarURL} alt="Avatar" />
          </picture>
          <div>{applicant.name}</div>
          <div>{applicant.level}</div>
          <button className="m-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">接受加入</button>
        </div>
      ))}
    </>
  );
}
