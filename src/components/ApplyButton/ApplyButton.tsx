'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import db from '@/app/utils/firebaseConfig';

const ApplyButton = ({ eventID, organizerID }: { eventID: string; organizerID: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [applyState, setApplyState] = useState<string | null>(null);
  const [authUser] = useAuthStore((state) => [state.authUser]);
  const [authProfile] = useAuthStore((state) => [state.authProfile]);

  const handleApply = async () => {
    const applicantsRef = doc(db, 'events', eventID, 'applicants', authUser);

    await setDoc(applicantsRef, {
      name: authProfile!.username,
      level: authProfile!.level,
      applyTime: serverTimestamp(),
    });
  };

  useEffect(() => {
    if (authUser && authUser !== organizerID) setLoaded(true);
  }, [authUser, organizerID]);

  useEffect(() => {
    if (!loaded) return;

    const applicantsRef = doc(db, 'events', eventID, 'applicants', authUser);
    const applicantsCollection = collection(db, 'events', eventID, 'applicants');
    const participantsRef = doc(db, 'events', eventID, 'participants', authUser);

    const getApplyState = async () => {
      const [applicantsSnap, participantsSnap] = await Promise.all([
        getDoc(applicantsRef),
        getDoc(participantsRef),
      ]);

      if (applicantsSnap.exists()) {
        setApplyState('waiting');
      } else if (participantsSnap.exists()) {
        setApplyState('joined');
      } else {
        setApplyState('apply');
      }
    };

    const applyStateUnsubs = onSnapshot(applicantsCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          setApplyState('waiting');
        }
        if (change.type === 'removed') {
          setApplyState('apply');
        }
      });
    });

    getApplyState();

    return () => {
      applyStateUnsubs();
    };
  }, [loaded]);

  return (
    <>
      {applyState === 'apply' && (
        <button
          className="w-full min-w-[100px] rounded-sm border border-transparent bg-sunrise-400 py-1 font-bold text-white transition-all hover:border hover:border-sunrise-500 hover:bg-white hover:text-sunrise-500 hover:shadow-md"
          onClick={handleApply}
        >
          申請加入
        </button>
      )}
      {applyState === 'waiting' && (
        <button
          className="w-full min-w-[100px] rounded-sm border border-transparent bg-gray-600 py-1 font-bold text-white"
          disabled
        >
          等待審核
        </button>
      )}
      {applyState === 'joined' && (
        <button
          className="w-full min-w-[100px] rounded-sm  border-2 bg-gray-100 py-1 font-bold text-sunrise-500"
          disabled
        >
          已加入
        </button>
      )}
    </>
  );
};

export default ApplyButton;
