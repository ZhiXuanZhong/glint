'use client';
import JoinForm from '@/components/JoinForm/JoinForm';
import Conference from '@/components/Conference/Conference';
import { useEffect } from 'react';
import { selectIsConnectedToRoom, useHMSActions, useHMSStore, selectPeerCount } from '@100mslive/react-sdk';

const Page = () => {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const count = useHMSStore(selectPeerCount);
  const hmsActions = useHMSActions();

  useEffect(() => {
    window.onunload = () => {
      if (isConnected) {
        hmsActions.leave();
      }
    };
  }, [hmsActions, isConnected]);

  return (
    <div>
      {count}
      {isConnected ? <Conference /> : <JoinForm />}
    </div>
  );
};

export default Page;
