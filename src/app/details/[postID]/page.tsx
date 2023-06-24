import { headers } from 'next/headers';
import { Key } from 'react';

export default async function Page({ params }: { params: { postID: string } }) {
  // FIXME: workaround! server component can't fetch relative path
  // https://github.com/vercel/next.js/issues/46840
  const headersData = headers();
  const protocol = headersData.get('x-forwarded-proto');
  const host = headersData.get('host');

  // const fetchData = async () => {
  //   const response = await fetch(`${protocol}://${host}/api/event/${params.postID}`, { next: { revalidate: 1 } });
  //   return response.json();
  // };
  // const eventInfos = await fetchData();
  // console.log(eventInfos);

  // const fetchRating = async (id) => {
  //   const response = await fetch(`${protocol}://${host}/api/rating/${id}`, { next: { revalidate: 1 } });
  //   return response.json();
  // };
  // const rating = await fetchRating();
  // console.log(rating);

  async function getInfo(eventID: string) {
    const response = await fetch(`${protocol}://${host}/api/event/${eventID}`, { cache: 'no-cache' });
    return response.json();
  }

  async function getRating(userID: string) {
    const response = await fetch(`${protocol}://${host}/api/rating/${userID}`, { cache: 'no-cache' });
    return response.json();
  }

  const eventInfos = await getInfo(params.postID);
  const { rating } = await getRating(eventInfos.data.organizer);

  return (
    <>
      <h1 className="text-3xl">活動詳情</h1>
      <h2>活動嚮導</h2>
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
      <h2>活動詳情</h2>
      <picture>
        <img src={eventInfos.data.mainImage} alt="Dive event image" />
      </picture>
      <p>{eventInfos.data.description}</p>
      <div>評分：{(rating.ratingSum / rating.reviewCount).toFixed(1)}</div>
    </>
  );
}
