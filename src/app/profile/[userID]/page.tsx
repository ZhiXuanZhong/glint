'use client';

import { useEffect, useState } from 'react';
import UserInfo from '@/components/UserInfo/UserInfo';
import Link from 'next/link';
import db from '@/app/utils/firebaseConfig';
import { DocumentData, QueryDocumentSnapshot, collection, doc, getCountFromServer, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import formatDate from '@/app/utils/formatDate';
import Image from 'next/image';
import EventCard from '@/components/EventCard/EventCard';
import FollowUserButton from '@/components/FollowUserButton/FollowUserButton';

interface Licence {
  imageURL: string;
  uploadTime: number;
}

interface FollowCount {
  followersCount: number;
  followingsCount: number;
}

const Page = ({ params }: { params: { userID: string } }) => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  const [profile, setProfile] = useState<UsersProfile>();
  const [rating, setRating] = useState<UserRating>();
  const [licence, setLicence] = useState<Licence>();
  const [followCount, setFollowCount] = useState<FollowCount>();
  const [futureEvents, setFutureEvents] = useState<Event[]>();

  // 取得單筆profile資料
  const getProfile = async (id: string) => {
    const response = await fetch(`/api/profile/${id}`, { next: { revalidate: 5 } });
    return response.json();
  };

  const getRating = async (id: string) => {
    const response = await fetch(`/api/rating/${id}`, { next: { revalidate: 5 } });
    return response.json();
  };

  const getFutureEvents = async (userID: string) => {
    const events: Event[] = [];

    const eventsRef = collection(db, 'events');
    const queryEvents = query(eventsRef, where('organizer', '==', userID), where('endTime', '>=', Date.now()));
    const snapshot = await getDocs(queryEvents);
    snapshot.forEach((event) => {
      const eventWithID = { ...event.data(), id: event.id };
      events.push(eventWithID as Event);
    });

    const sortedEvents = events.sort((a, b) => a.startTime - b.startTime);

    return sortedEvents;
  };

  useEffect(() => {
    const initData = async () => {
      const [profileRes, ratingRes, followersCountRes, followingsCountRes] = await Promise.all([
        getProfile(params.userID),
        getRating(params.userID),
        getCountFromServer(followersRef),
        getCountFromServer(followingsRef),
      ]);

      setProfile({ ...profileRes[params.userID], id: params.userID });
      setRating(ratingRes);

      const followersCount = followersCountRes.data().count;
      const followingsCount = followingsCountRes.data().count;
      setFollowCount({ followersCount, followingsCount });

      const futureEventsResponse = await getFutureEvents(params.userID);
      setFutureEvents(futureEventsResponse);
    };

    const licenceRef = doc(db, 'users', params.userID, 'licence', 'info');
    const licenceUnsub = onSnapshot(licenceRef, (doc) => {
      setLicence(doc.data() as Licence);
    });

    const followersRef = collection(db, 'users', params.userID, 'followers');
    const followingsRef = collection(db, 'users', params.userID, 'followings');

    initData();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-10 md:mx-auto md:max-w-3xl lg:max-w-5xl lg:flex-row">
      <div className="flex w-full flex-col lg:w-2/6">
        <div>
          <div className="mx-auto flex min-h-[200px] w-full flex-col items-center  rounded-sm p-4 shadow-md shadow-moonlight-100">
            <div className="min-h-[76px]">
              {profile?.id && <UserInfo imageURL={profile?.avatarURL} name={profile?.username} level={profile?.level} licence={profile?.hasLicence} size={70} userID={profile.id} />}
            </div>
            <div className="flex min-h-[126px] flex-col">
              <div className="mt-2 flex w-full flex-wrap gap-3">
                {profile && (
                  <>
                    <FollowUserButton userID={params.userID} />
                    <Link href={`/messages/${profile.id}`}>
                      <button className="w-full rounded-sm border border-transparent bg-blue-400 py-1 text-base text-white hover:bg-sunrise-600 hover:transition-all md:w-24">發送訊息</button>
                    </Link>
                  </>
                )}
              </div>
              {rating && (
                <div className="mt-3 flex flex-col rounded-sm bg-moonlight-100 p-2">
                  <div className="text-center text-3xl font-black text-moonlight-800">{rating?.rating}</div>
                  <div className="pt-1 text-center text-xs font-light text-gray-500">根據{rating?.reviewCount}篇評價</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 rounded-sm p-4 shadow-md shadow-moonlight-100">
          <div className="flex min-h-[44px] flex-col items-center">
            <div className="w-20 text-center text-sm text-moonlight-600">粉絲人數</div>
            <div className="text-moonlight-900">{followCount?.followersCount}</div>
          </div>

          <div className="flex min-h-[44px] flex-col items-center">
            <div className="w-20 text-center text-sm text-moonlight-600">關注中</div>
            <div className="text-moonlight-900">{followCount?.followingsCount}</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-sm p-4 shadow-md shadow-moonlight-100">
          <div>
            <div className="mb-1 text-sm text-moonlight-600">常駐城市</div>
            <div className="font-medium text-moonlight-950">{profile?.location}</div>
          </div>

          <div>
            <div className="mb-1 text-sm text-moonlight-600">簡介</div>
            <div className="whitespace-pre-wrap font-medium text-moonlight-950">{profile?.bio}</div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col lg:w-4/6">
        <div>
          <div className="mb-5 rounded border border-moonlight-200 p-4">
            <div className="mb-3 text-xl font-medium text-moonlight-950">執照內容</div>

            <div className="flex">
              <div className="w-1/2">
                <div className="mb-2 min-h-[48px]">
                  <div className="mb-1 text-sm text-moonlight-600">等級</div>
                  <div>{profile?.level}</div>
                </div>

                <div className="mb-2 min-h-[48px]">
                  <div className="mb-1 text-sm text-moonlight-600">最近更新日期</div>
                  <div>{formatDate(licence?.uploadTime)}</div>
                </div>
              </div>

              <div className="min-h-[220px] w-1/2">
                <div className="mb-1 w-full text-sm text-moonlight-600">執照影像</div>
                {licence && <Image width={700} height={400} src={licence.imageURL} alt={'licence'} priority style={{ objectFit: 'contain', maxWidth: '100%' }} />}
              </div>
            </div>
          </div>

          <div className="mb-5 w-full rounded border border-moonlight-200 p-4">
            <div className="mb-3 text-xl font-medium text-moonlight-950">未來的行程</div>
            {futureEvents?.map((event, index) => {
              return (
                <div className="mb-3 rounded-sm" key={index}>
                  <EventCard event={event} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
