'use client';

import db from '@/app/utils/firebaseConfig';
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const FavoriteButton = ({ eventID }: { eventID: string }) => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  const userEventsRef = collection(db, 'users', userID, 'events');
  const eventRef = doc(db, 'users', userID, 'events', eventID);

  const [isFavorite, setIsFavorite] = useState(false);

  const handleClick = async () => {
    // 這邊要再加入如果活動不存在，就建立一個新活動
    //    { type: 'favorite',
    //     status: 'waiting',
    //     startTime: 1687094934335,
    //     endTime: 1687094934335,
    //     isFavorite: false,
    //   }

    await updateDoc(eventRef, {
      isFavorite: !isFavorite,
    });
  };

  useEffect(() => {
    const listenFavorite = async () => {
      const q = query(userEventsRef);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.doc.id === eventID) {
            setIsFavorite(change.doc.data().isFavorite);
          }
        });
      });
    };

    listenFavorite();

    return () => {
      listenFavorite();
    };
  }, []);

  return !isFavorite ? (
    <button className="rounded-sm bg-moonlight-600 px-4 py-1 text-white transition-colors hover:bg-slate-400" onClick={handleClick}>
      蒐藏
    </button>
  ) : (
    <button className="rounded-sm border border-moonlight-200 px-4 py-1 text-moonlight-600 transition-colors hover:bg-slate-400" onClick={handleClick}>
      移除蒐藏
    </button>
  );
};

export default FavoriteButton;
