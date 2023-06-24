import { headers } from 'next/headers';
import { Key } from 'react';
import UserInfo from '@/app/components/UserInfo/UserInfo';

export default async function Page({ params }: { params: { eventID: string } }) {
  // FIXME: workaround! server component can't fetch relative path
  // https://github.com/vercel/next.js/issues/46840
  const headersData = headers();
  const protocol = headersData.get('x-forwarded-proto');
  const host = headersData.get('host');

  async function getInfo(eventID: string) {
    const response = await fetch(`${protocol}://${host}/api/event/${eventID}`, { cache: 'no-cache' });
    return response.json();
  }

  async function getRating(userID: string) {
    const response = await fetch(`${protocol}://${host}/api/rating/${userID}`, { cache: 'no-cache' });
    return response.json();
  }

  const eventInfos = await getInfo(params.eventID);
  const { rating } = await getRating(eventInfos.data.organizer);

  console.log(eventInfos);

  return (
    <>
      <h1 className="text-3xl">活動詳情</h1>
      <h2>活動嚮導</h2>
      <UserInfo imageURL={`https://placehold.co/50x50?text=Avatar`} name={'Jacqueline Yu'} level={'SSI Level 1'} licence={false} />
      <div>organizer rating: {rating ? rating : ''}</div>
      {/* personal info card component gose here */}
      <h2>建議等級</h2>
      <div>{eventInfos.data.levelSuggection}</div>
      <h2>活動類型</h2>
      <div>{eventInfos.data.category}</div>
      <h2>活動地點</h2>
      <div>
        {eventInfos.data.locations.map((location: string, index: Key) => (
          <div key={index}>{location}</div>
        ))}
      </div>
      {/* Pending - 活動時間 */}
      {/* Pending - 申請加入 btn */}
      {/* Pending - 蒐藏 btn */}
      <h2>活動詳情</h2>
      <picture>
        <img src={eventInfos.data.mainImage} alt="Dive event image" />
      </picture>
      <p>{eventInfos.data.description}</p>
      <h2>已加入活動</h2>

      <h2>等待清單</h2>
    </>
  );
}
