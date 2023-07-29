'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import db from '@/app/utils/firebaseConfig';

interface FollowUserButton {
  userID: string;
  setFollowCount?: Function;
}

const FollowUserButton = ({ userID, setFollowCount }: FollowUserButton) => {
  const [authUser] = useAuthStore((state) => [state.authUser]);
  const [isFollow, setIsFollow] = useState(false);

  const unfollowUser = async () => {
    await deleteDoc(doc(db, 'users', authUser, 'followings', userID));
    await deleteDoc(doc(db, 'users', userID, 'followers', authUser));

    setFollowCount &&
      setFollowCount((prev: { followersCount: number }) => ({
        ...prev,
        followersCount: prev.followersCount - 1,
      }));
  };

  const followUser = async () => {
    await setDoc(doc(db, 'users', authUser, 'followings', userID), {
      addedTime: serverTimestamp(),
    });
    await setDoc(doc(db, 'users', userID, 'followers', authUser), {
      addedTime: serverTimestamp(),
    });

    setFollowCount &&
      setFollowCount((prev: { followersCount: number }) => ({
        ...prev,
        followersCount: prev.followersCount + 1,
      }));
  };

  useEffect(() => {
    if (!authUser) return;

    const userfollowingsRef = collection(db, 'users', authUser, 'followings');
    const unsubscribeFollowing = onSnapshot(query(userfollowingsRef), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.doc.id === userID) {
          switch (change.type) {
            case 'added':
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

  if (authUser === userID || !authUser) return;

  return (
    <>
      {isFollow ? (
        <button
          className="w-full rounded-sm border border-blue-400 py-1 text-base text-blue-400 
          hover:border-gray-600 hover:bg-gray-600 hover:text-white hover:transition-all md:w-24"
          onClick={unfollowUser}
        >
          已追蹤
        </button>
      ) : (
        <button
          className="w-full rounded-sm border border-transparent bg-blue-400 py-1 text-base text-white 
          hover:bg-sunrise-600 hover:transition-all md:w-24"
          onClick={followUser}
        >
          追蹤
        </button>
      )}
    </>
  );
};

export default FollowUserButton;
