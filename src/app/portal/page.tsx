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
  detail: Event;
}

const Page = () => {
  const router = useRouter();
  const [authUser] = useAuthStore((state) => [state.authUser]);
  const [userEvents, setUserEvents] = useState<UserEvent[] | null>(null);

  const [ongoingEvents, upcomingEvents, endedEvents, favoriteEvents] = [
    userEvents?.filter(
      (event) =>
        event.type && event.detail.startTime <= Date.now() && event.detail.endTime > Date.now()
    ),
    userEvents?.filter((event) => event.type && event.detail.startTime >= Date.now()),
    userEvents?.filter((event) => event.type && event.detail.endTime <= Date.now()),
    userEvents?.filter((event) => event.isFavorite),
  ];

  useEffect(() => {
    if (!authUser) router.push('/login');
  }, []);

  useEffect(() => {
    if (!authUser) return;

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

    const initData = async () => {
      const list = await getEventList();
      const eventsDetail = list.map(async (event) => ({
        ...event,
        detail: await clientAPI.getEvent(event.id!),
      }));
      const eventWithDetail = await Promise.all(eventsDetail);
      const updatedEvents = eventWithDetail.sort((a, b) => b.detail.startTime - a.detail.startTime);
      setUserEvents(updatedEvents);
      console.log(eventWithDetail);
    };

    initData();
  }, [authUser]);

  if (!userEvents) return;

  return (
    <div className="pt-10">
      <Tabs>
        <Tab label="參與的活動">
          <div className="flex flex-col gap-4 py-4">
            <div className="mt-3 flex flex-col gap-2">
              <h2 className="mb-2 text-lg font-medium">進行中的活動</h2>
              {ongoingEvents?.length ? (
                ongoingEvents.map((event, index) => {
                  return <EventCard key={index} event={event.detail} portal />;
                })
              ) : (
                <div className="text-gray-700">目前尚無活動</div>
              )}
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <h2 className="mb-2 text-lg font-medium">即將展開</h2>
              {upcomingEvents?.length ? (
                upcomingEvents.map((event, index) => {
                  return <EventCard key={index} event={event.detail} portal />;
                })
              ) : (
                <div className="text-gray-700">目前尚無活動</div>
              )}
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <h2 className="mb-2 text-lg font-medium">已結束</h2>
              {endedEvents?.length ? (
                endedEvents.map((event, index) => {
                  return <EventCard key={index} event={event.detail} portal />;
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
                  return <EventCard key={index} event={event.detail} portal />;
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
