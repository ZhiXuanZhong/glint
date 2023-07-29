'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

import { collection, doc, getDoc, onSnapshot, query, setDoc, updateDoc } from 'firebase/firestore';
import db from '@/app/utils/firebaseConfig';

const FavoriteButton = ({ eventInfo }: { eventInfo: Event }) => {
  const [loaded, setLoaded] = useState(false);
  const [authUser] = useAuthStore((state) => [state.authUser]);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleClick = async () => {
    const eventRef = doc(db, 'users', authUser, 'events', eventInfo.id);
    const response = await getDoc(eventRef);

    if (response.exists()) {
      await updateDoc(eventRef, {
        isFavorite: !isFavorite,
      });
    } else {
      await setDoc(eventRef, {
        type: 'favorite',
        status: 'waiting',
        startTime: eventInfo.startTime,
        endTime: eventInfo.endTime,
        isFavorite: true,
      });
    }
  };

  useEffect(() => {
    if (authUser) setLoaded(true);
  }, [authUser]);

  useEffect(() => {
    if (!loaded) return;

    const userEventsRef = collection(db, 'users', authUser, 'events');
    const unsubscribe = onSnapshot(query(userEventsRef), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.doc.id === eventInfo.id) {
          setIsFavorite(change.doc.data().isFavorite);
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, [loaded]);

  return !isFavorite ? (
    <button
      className="rounded-sm border border-transparent bg-moonlight-600 px-4 py-1 text-white transition-colors hover:bg-slate-400"
      onClick={handleClick}
    >
      蒐藏
    </button>
  ) : (
    <button
      className="rounded-sm border border-moonlight-200 px-4 py-1 text-moonlight-600 transition-colors hover:bg-slate-400"
      onClick={handleClick}
    >
      移除蒐藏
    </button>
  );
};

export default FavoriteButton;
