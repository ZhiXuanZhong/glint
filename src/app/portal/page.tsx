'use client';
import firebaseConfig from '@/app/utils/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface Event {
  rating: number;
  title: string;
  organizer: string;
  levelSuggection: string;
  status: string;
  description: string;
  createdTime: {
    seconds: number;
    nanoseconds: number;
  };
  endTime: number;
  mainImage: string;
  locations: string[];
  startTime: number;
  organizerType: string;
  organizerLevel: string;
  category: string;
  id: string;
}

const Page = () => {
  const [events, setEvents] = useState();
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const eventsRef = collection(db, 'users', userID, 'events');

  const getInfo = async (eventID: string) => {
    const response = await fetch(`/api/event/${eventID}`, { next: { revalidate: 5 } });
    const data = await response.json();
    return data;
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
      console.log(updatedArr);
    };

    getEventList().then((res) => getDetail(res));
  }, []);

  return (
    <>
      <h2>我發起的活動</h2>
      <h2>即將展開的活動</h2>
      <h2>蒐藏</h2>
      <h2>已結束的活動</h2>
    </>
  );
};

export default Page;
