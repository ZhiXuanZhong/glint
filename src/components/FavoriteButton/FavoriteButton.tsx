'use client';

import firebaseConfig from '@/app/utils/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const FavoriteButton = ({ eventID }: { eventID: string }) => {
  const app = initializeApp(firebaseConfig);
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  const db = getFirestore(app);
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
    <button className="m-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>
      蒐藏{eventID}
    </button>
  ) : (
    <button className="m-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>
      已加入蒐藏{eventID}
    </button>
  );
};

export default FavoriteButton;
