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
        <button className="m-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleApply}>
          申請加入{eventID}
        </button>
      )}
      {applyState === 'waiting' && (
        <button className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded" disabled>
          等待審核{eventID}
        </button>
      )}
      {applyState === 'joined' && (
        <button className="m-1 bg-gray-100 text-orange-400 font-bold py-2 px-4 rounded border-2" disabled>
          已加入{eventID}
        </button>
      )}
    </>
  );
};

export default ApplyButton;
