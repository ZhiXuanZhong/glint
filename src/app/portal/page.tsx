'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

import { collection, getDocs } from 'firebase/firestore';
import db from '@/app/utils/firebaseConfig';

import EventCard from '@/components/EventCard/EventCard';
import { Tab, Tabs } from '@/components/Tabs/Tabs';
import clientAPI from '../utils/clientAPI';

interface UserEvent {
  endTime: number;
  hasReview: boolean;
  isFavorite: boolean;
  startTime: number;
  status: string;
  type: string;
  id: string;
}

const Page = () => {
  const router = useRouter();
  const [authUser] = useAuthStore((state) => [state.authUser]);
  const [userEvents, setUserEvents] = useState<UserEvent[] | null>(null);
  const [eventsDetail, setEventsDetail] = useState<Event[] | null>(null);

  const [ongoingEvents, upcomingEvents, endedEvents, favoriteEvents] = [
    userEvents?.filter((event) => event.startTime <= Date.now() && event.endTime > Date.now()),
    userEvents?.filter((event) => event.startTime >= Date.now()),
    userEvents?.filter((event) => event.endTime <= Date.now()),
    userEvents?.filter((event) => event.isFavorite),
  ];

  const getEventsDetail = async (userEvents: UserEvent[]) => {
    const eventsDetailPromises = userEvents.map((event) => clientAPI.getEvent(event.id!));

    const eventsDetail = await Promise.all(eventsDetailPromises);

    const eventsDetailObject = eventsDetail.reduce((acc, eventDetail) => {
      acc[eventDetail.id] = eventDetail;
      return acc;
    }, {} as { [key: string]: Event });

    return eventsDetailObject;
  };

  useEffect(() => {
    if (!authUser) router.push('/login');
  }, []);

  useEffect(() => {
    if (!authUser) return;

    // 取回user collection內所有活動清單，並包含
    // ID(用來抓event資料)
    // 時間(用來抓即將展開、以結束)
    // status 用來判斷能否退出 waiting, confirm
    // isFavorite 用來判斷是不是蒐藏
    // hasReview 用來確定是否可以留言

    const getEventList = async () => {
      const eventsRef = collection(db, 'users', authUser, 'events');
      const events: UserEvent[] = [];
      const res = await getDocs(eventsRef);
      res.forEach((doc) => {
        const event = doc.data() as UserEvent;
        event.id = doc.id;
        events.push(event);
      });
      return events;
    };

    const fetchData = async () => {
      const list = await getEventList();
      const eventsDetail = await getEventsDetail(list);
      return { list, eventsDetail };
    };

    fetchData().then(({ list, eventsDetail }) => {
      setUserEvents(list);
      setEventsDetail(eventsDetail);
    });
  }, [authUser]);

  if (!(userEvents && eventsDetail)) return;

  return (
    <div className="pt-10">
      <Tabs>
        <Tab label="參與的活動">
          <div className="flex flex-col gap-4 py-4">
            <div className="mt-3 flex flex-col gap-2">
              <h2 className="mb-2 text-lg font-medium">進行中的活動</h2>
              {ongoingEvents?.length ? (
                ongoingEvents.map((event, index) => {
                  return (
                    <EventCard
                      key={index}
                      event={eventsDetail[event.id as keyof typeof eventsDetail]}
                      portal
                    />
                  );
                })
              ) : (
                <div className="text-gray-700">目前尚無活動</div>
              )}
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <h2 className="mb-2 text-lg font-medium">即將展開</h2>
              {upcomingEvents?.length ? (
                upcomingEvents.map((event, index) => {
                  return (
                    <EventCard
                      key={index}
                      event={eventsDetail[event.id as keyof typeof eventsDetail]}
                      portal
                    />
                  );
                })
              ) : (
                <div className="text-gray-700">目前尚無活動</div>
              )}
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <h2 className="mb-2 text-lg font-medium">已結束</h2>
              {endedEvents?.length ? (
                endedEvents.map((event, index) => {
                  return (
                    <EventCard
                      key={index}
                      event={eventsDetail[event.id as keyof typeof eventsDetail]}
                      portal
                    />
                  );
                })
              ) : (
                <div className="text-gray-700">目前尚無活動</div>
              )}
            </div>
          </div>
        </Tab>
        <Tab label="蒐藏清單">
          <div className="flex flex-col gap-4 py-4">
            <div className="mt-3 flex flex-col gap-2">
              <h2 className="mb-2 text-lg font-medium">已蒐藏的活動</h2>
              {favoriteEvents?.length ? (
                favoriteEvents.map((event, index) => {
                  return (
                    <EventCard
                      key={index}
                      event={eventsDetail[event.id as keyof typeof eventsDetail]}
                      portal
                    />
                  );
                })
              ) : (
                <div className="text-gray-700">目前尚無活動</div>
              )}
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Page;
