'use client';
import firebaseConfig from '@/app/utils/firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const RevokeButton = ({ userID, eventID }: { userID: string; eventID: string }) => {
  const handleClick = async () => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    await deleteDoc(doc(db, 'events', eventID, 'participants', userID));
    console.log(`${userID} deleted from ${eventID}`);
  };

  return (
    <button className="m-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>
      取消加入
    </button>
  );
};

export default RevokeButton;
