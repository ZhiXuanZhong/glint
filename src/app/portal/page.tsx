'use client';
import db from '@/app/utils/firebaseConfig';
import { collection, getDocs, getFirestore, onSnapshot } from 'firebase/firestore';
import { Key, useEffect, useState } from 'react';
import EventCard from '@/components/EventCard/EventCard';

const Page = () => {
  const groupedEvents = {};
  const [events, setEvents] = useState<any | null>(null);
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';

  const eventsRef = collection(db, 'users', userID, 'events');

  const getInfo = async (eventID: string) => {
    const response = await fetch(`/api/event/${eventID}`, { next: { revalidate: 5 } });
    const data = await response.json();
    return data;
  };

  const groupedObjects = (events: PortalEvent[]) => {
    const groupedData = events.reduce((result, obj) => {
      const { type } = obj;

      if (!result[type]) {
        result[type] = [];
      }
      result[type].push(obj);

      return result;
    }, {} as Record<string, any[]>);
    return groupedData;
  };

  useEffect(() => {
    // 取回collection內所有活動清單
    const getEventList = async () => {
      const events: Event[] = [];
      const res = await getDocs(eventsRef);
      res.forEach((doc) => {
        const event = doc.data() as Event;
        event.id = doc.id;
        events.push(event);
      });
      return events;
    };

    // 依照取回活動分別請求活動詳情
    const getDetail = async (arr: Event[]) => {
      const updatedArr = await Promise.all(
        arr.map(async (obj) => {
          const updatedData = await getInfo(obj.id);
          return { ...obj, ...updatedData };
        })
      );
      return updatedArr;
    };

    getEventList()
      .then((res) => getDetail(res))
      .then((data) => groupedObjects(data))
      .then((result) => Object.assign(groupedEvents, result))
      .then(() => setEvents(groupedEvents));
  }, []);

  return (
    <>
      <h2>目前的活動 - joined startTime&lt;Date.now()&lt;endTime </h2>
      {events?.joined
        .filter((event: PortalEvent) => Date.now() > event.data.startTime && Date.now() < event.data.endTime)
        .map((event: PortalEvent, index: Key) => (
          <EventCard event={event.data} key={index} />
        ))}

      <h2>我發起的活動 - hosted</h2>
      {events?.hosted.map((event: PortalEvent, index: Key) => (
        <EventCard event={event.data} key={index} />
      ))}

      <h2>即將展開的活動 - joined Date.now()&lt;startTime</h2>
      {events?.joined
        .filter((event: PortalEvent) => Date.now() < event.data.startTime)
        .map((event: PortalEvent, index: Key) => (
          <EventCard event={event.data} key={index} />
        ))}

      <h2>已結束的活動 - joined Date.now()&gt;endTime </h2>
      {events?.joined
        .filter((event: PortalEvent) => Date.now() > event.data.endTime)
        .map((event: PortalEvent, index: Key) => (
          <EventCard event={event.data} key={index} />
        ))}

      <h2>等待確認 - pending</h2>
      {events?.pending.map((event: PortalEvent, index: Key) => (
        <EventCard event={event.data} key={index} />
      ))}

      <h2>蒐藏 - favorite</h2>
      {events?.favorites.map((event: PortalEvent, index: Key) => (
        <EventCard event={event.data} key={index} />
      ))}

      <h2>被拒絕 - rejected</h2>
      {events?.rejected.map((event: PortalEvent, index: Key) => (
        <EventCard event={event.data} key={index} />
      ))}

      <h2>活動取消 - canceled</h2>
      {events?.canceled.map((event: PortalEvent, index: Key) => (
        <EventCard event={event.data} key={index} />
      ))}
    </>
  );
};

export default Page;
