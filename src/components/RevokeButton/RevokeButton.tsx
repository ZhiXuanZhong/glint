'use client';
import db from '@/app/utils/firebaseConfig';
import { doc, deleteDoc, updateDoc, deleteField } from 'firebase/firestore';

const RevokeButton = ({ userID, eventID }: { userID: string; eventID: string }) => {
  const handleClick = async () => {
    await deleteDoc(doc(db, 'events', eventID, 'participants', userID));

    const userEventsRef = doc(db, 'users', userID, 'events', eventID);
    await updateDoc(userEventsRef, {
      type: deleteField(),
    });
  };

  return (
    <button
      className="rounded-md bg-gray-400 px-4 py-1 text-xs text-white hover:bg-red-500 hover:transition-all"
      onClick={handleClick}
    >
      取消加入
    </button>
  );
};

export default RevokeButton;
