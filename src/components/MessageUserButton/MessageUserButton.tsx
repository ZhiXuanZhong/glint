'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import db from '@/app/utils/firebaseConfig';

const MessageUserButton = ({ userID }: { userID: string }) => {
  const router = useRouter();
  const [authUser] = useAuthStore((state) => [state.authUser]);
  const [hasRoom, setHasRoom] = useState(false);
  const chatroomRef = collection(db, 'messages');

  const createChatroom = async () => {
    await setDoc(doc(chatroomRef), {
      createdTime: serverTimestamp(),
      userIDs: [userID, authUser],
    });

    router.push(`/messages/${userID}`);
  };

  const handleClick = async () => {
    if (hasRoom) return router.push(`/messages/${userID}`);

    createChatroom();
  };

  useEffect(() => {
    if (!authUser) return;

    const chatroomQuery = query(chatroomRef, where('userIDs', 'array-contains', authUser));

    const unsubscribeChatroom = onSnapshot(chatroomQuery, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        (change.doc.data().userIDs as string[]).includes(userID) && setHasRoom(true);
      });
    });

    return () => {
      unsubscribeChatroom();
    };
  }, [authUser]);

  if (authUser === userID || !authUser) return;

  return (
    <div
      className="w-full rounded-sm border border-transparent bg-blue-400 py-1 text-center
    text-white hover:bg-sunrise-600 hover:transition-all md:w-24"
    >
      <button onClick={handleClick}>發送訊息</button>
    </div>
  );
};

export default MessageUserButton;
