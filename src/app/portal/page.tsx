'use client';
import firebaseConfig from '@/app/utils/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';

const Page = () => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const eventsRef = collection(db, 'users', userID, 'events');

  useEffect(() => {
    const getEvents = async () => {
      const res = await getDocs(eventsRef);
      res.forEach((doc) => console.log(doc.data()));
    };

    getEvents();
  }, []);

  return (
    <>
      <div>Page</div>
      <div>User&quot;s events go here</div>
    </>
  );
};

export default Page;
