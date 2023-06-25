'use client';
import firebaseConfig from '@/app/utils/firebaseConfig';
import { doc, deleteDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const ConfirmButton = ({ userID, eventID, accept }: { userID: string; eventID: string; accept: boolean }) => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const userRef = doc(db, 'events', eventID, 'applicants', userID);
  const participantsRef = doc(db, 'events', eventID, 'participants', userID);

  const handleAccept = async () => {
    const userData = (await getDoc(userRef)).data();
    await setDoc(participantsRef, { ...userData, approvedTime: serverTimestamp() });
    await deleteDoc(userRef);
  };

  const handleReject = async () => {
    await deleteDoc(userRef);
    console.log(`${userID} deleted from ${eventID}`);
  };

  return (
    <>
      {accept ? (
        <button className="m-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleAccept}>
          接受加入
        </button>
      ) : (
        <button className="m-1 bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded" onClick={handleReject}>
          拒絕加入
        </button>
      )}
    </>
  );
};

export default ConfirmButton;
