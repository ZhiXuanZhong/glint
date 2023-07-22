'use client';

import db from '@/app/utils/firebaseConfig';
import { useAuthStore } from '@/store/authStore';
import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const FollowUserButton = ({ userID }: { userID: string }) => {
  const [authUser] = useAuthStore((state) => [state.authUser]);
  const [isFollow, setIsFollow] = useState(false);

  const unfollowUser = async () => {
    await deleteDoc(doc(db, 'users', authUser, 'followings', userID));
    await deleteDoc(doc(db, 'users', userID, 'followers', authUser));
  };

  const followUser = async () => {
    await setDoc(doc(db, 'users', authUser, 'followings', userID), {
      addedTime: serverTimestamp(),
    });

    await setDoc(doc(db, 'users', userID, 'followers', authUser), {
      addedTime: serverTimestamp(),
    });
  };

  useEffect(() => {
    const userfollowingsRef = collection(db, 'users', authUser, 'followings');
    const unsubscribeFollowing = onSnapshot(query(userfollowingsRef), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log(change.doc.id, change.type, userID);
        if (change.doc.id === userID) {
          switch (change.type) {
            case 'added':
              console.log('here');
              setIsFollow(true);
              break;
            case 'removed':
              setIsFollow(false);
              break;
          }
        }
      });
    });

    return () => {
      unsubscribeFollowing();
    };
  }, [authUser, userID]);

  return (
    <>
      {isFollow ? (
        <button
          className="w-full rounded-sm border border-blue-400 py-1 text-base text-blue-400 hover:border-gray-600 hover:bg-gray-600 hover:text-white hover:transition-all md:w-24"
          onClick={unfollowUser}
        >
          已追蹤
        </button>
      ) : (
        <button className="w-full rounded-sm border border-transparent bg-blue-400 py-1 text-base text-white hover:bg-sunrise-600 hover:transition-all md:w-24" onClick={followUser}>
          追蹤
        </button>
      )}
    </>
  );
};

export default FollowUserButton;
