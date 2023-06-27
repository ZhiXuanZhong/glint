'use client';
import db from '@/app/utils/firebaseConfig';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';

const WithdrawButton = ({ eventID, userID, updateWithdraw }: { eventID: string; userID: string; updateWithdraw: Function }) => {
  const participantsRef = doc(db, 'events', eventID, 'participants', userID);
  const userEventsRef = doc(db, 'users', userID, 'events', eventID);

  const handleWithdraw = async () => {
    await deleteDoc(participantsRef);
    await updateDoc(userEventsRef, {
      type: 'withdrawn',
    });
    updateWithdraw(eventID);
  };

  return (
    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 m-1 rounded" onClick={handleWithdraw}>
      退出活動(WIP) {eventID}
    </button>
  );
};

export default WithdrawButton;
