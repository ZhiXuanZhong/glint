'use client';
import firebaseConfig from '@/app/utils/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getFirestore, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';

const Page = () => {
  useEffect(() => {
    console.log('first');
  }, []);
  return (
    <>
      <div>Page</div>
      <div>User's events go here</div>
    </>
  );
};

export default Page;
