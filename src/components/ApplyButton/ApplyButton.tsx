'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import db from '@/app/utils/firebaseConfig';

interface ApplyButtonConfig {
  [key: string]: {
    text: string;
    className: string;
    disabled: boolean;
  };
}

const ApplyButton = ({ eventID, organizerID }: { eventID: string; organizerID: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [applyState, setApplyState] = useState<string>('apply');
  const [authUser] = useAuthStore((state) => [state.authUser]);
  const [authProfile] = useAuthStore((state) => [state.authProfile]);

  const applyButtonConfig: ApplyButtonConfig = {
    apply: {
      text: '申請加入',
      className:
        'w-full min-w-[100px] rounded-sm border border-transparent bg-sunrise-400 py-1 font-bold text-white transition-all hover:border hover:border-sunrise-500 hover:bg-white hover:text-sunrise-500 hover:shadow-md',
      disabled: false,
    },
    waiting: {
      text: '等待審核',
      className:
        'w-full min-w-[100px] rounded-sm border border-transparent bg-gray-600 py-1 font-bold text-white',
      disabled: true,
    },
    joined: {
      text: '已加入',
      className:
        'w-full min-w-[100px] rounded-sm  border-2 bg-gray-100 py-1 font-bold text-sunrise-500',
      disabled: true,
    },
  };

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

    const applicantsCollection = collection(db, 'events', eventID, 'applicants');
    const participantsCollection = collection(db, 'events', eventID, 'participants');

    const applyStateUnsubs = onSnapshot(applicantsCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' && change.doc.id === authUser) {
          setApplyState('waiting');
        }
        if (change.type === 'removed' && change.doc.id === authUser) {
          setApplyState('apply');
        }
      });
    });

    const joinedStateUnsubs = onSnapshot(participantsCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' && change.doc.id === authUser) {
          setApplyState('joined');
        }
        if (change.type === 'removed' && change.doc.id === authUser) {
          setApplyState('apply');
        }
      });
    });

    return () => {
      applyStateUnsubs();
      joinedStateUnsubs();
    };
  }, [loaded]);

  return (
    <>
      {authUser && organizerID !== authUser && (
        <button
          className={applyButtonConfig[applyState].className}
          onClick={applyButtonConfig[applyState].disabled ? undefined : handleApply}
          disabled={applyButtonConfig[applyState].disabled}
        >
          {applyButtonConfig[applyState].text}
        </button>
      )}
    </>
  );
};

export default ApplyButton;
