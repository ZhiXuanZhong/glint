'use client';
import db from '@/app/utils/firebaseConfig';
import { getFirestore, onSnapshot } from 'firebase/firestore';
import { doc, deleteDoc, getDoc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const ApplyButton = ({ eventID }: { eventID: string }) => {
  const [applyState, setApplyState] = useState('');

  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  const applicantsRef = doc(db, 'events', eventID, 'applicants', userID);
  const applicantsCollection = collection(db, 'events', eventID, 'applicants');
  const participantsRef = doc(db, 'events', eventID, 'participants', userID);

  useEffect(() => {
    const getApplyState = async () => {
      const [applicantsSnap, participantsSnap] = await Promise.all([getDoc(applicantsRef), getDoc(participantsRef)]);

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

    return applyStateUnsubs;
  }, []);

  const handleApply = async () => {
    const response = await fetch(`/api/profile/${userID}`);
    const profile = await response.json();

    await setDoc(applicantsRef, {
      name: profile[userID].username,
      level: profile[userID].level,
      applyTime: serverTimestamp(),
    });
  };

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
        <button className="w-full min-w-[100px] rounded-sm border border-transparent bg-gray-600 py-1 font-bold text-white" disabled>
          等待審核
        </button>
      )}
      {applyState === 'joined' && (
        <button className="w-full min-w-[100px] rounded-sm  border-2 bg-gray-100 py-1 font-bold text-sunrise-500" disabled>
          已加入
        </button>
      )}
    </>
  );
};

export default ApplyButton;
