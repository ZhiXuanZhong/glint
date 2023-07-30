'use client';
import db from '@/app/utils/firebaseConfig';
import { doc, deleteDoc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

const ConfirmButton = ({
  userID,
  eventID,
  accept,
}: {
  userID: string;
  eventID: string;
  accept: boolean;
}) => {
  const userRef = doc(db, 'events', eventID, 'applicants', userID);
  const participantsRef = doc(db, 'events', eventID, 'participants', userID);

  const handleAccept = async () => {
    const userData = (await getDoc(userRef)).data();
    await deleteDoc(userRef);
    await setDoc(participantsRef, { ...userData, approvedTime: serverTimestamp() });

    const userEventRef = doc(db, 'users', userID, 'events', eventID);
    const userEventSnap = await getDoc(userEventRef);

    if (userEventSnap.exists()) {
      updateDoc(userEventRef, {
        type: 'joined',
      });
    } else {
      await setDoc(userEventRef, {
        type: 'joined',
      });
    }
  };

  const handleReject = async () => {
    await deleteDoc(userRef);
  };

  return (
    <>
      {accept ? (
        <button
          className="rounded-md bg-sunrise-400 px-4 py-1 text-xs text-white hover:bg-sunrise-500 hover:transition-all"
          onClick={handleAccept}
        >
          接受加入
        </button>
      ) : (
        <button
          className="rounded-md bg-gray-400 px-4 py-1 text-xs text-white hover:bg-red-500 hover:transition-all"
          onClick={handleReject}
        >
          拒絕
        </button>
      )}
    </>
  );
};

export default ConfirmButton;
