'use client';
import VideoPeer from '../VideoPeer/VideoPeer';
import { useHMSActions, selectIsConnectedToRoom, useHMSStore, selectPeers, selectPeerCount } from '@100mslive/react-sdk';
import { useEffect } from 'react';

const VideoChat = ({ toggleStreaming }: { toggleStreaming: () => void }) => {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const peers = useHMSStore(selectPeers);
  const count = useHMSStore(selectPeerCount);

  const hmsActions = useHMSActions();
  const roomCode = 'gbf-dwyt-slf';

  const initStream = async () => {
    // use room code to fetch auth token
    const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });

    try {
      await hmsActions.join({ userName: 'test', authToken });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    window.onunload = () => {
      if (isConnected) {
        hmsActions.leave();
      }
    };
  }, [hmsActions, isConnected]);

  useEffect(() => {
    initStream();

    return () => {
      hmsActions.leave();
      toggleStreaming();
    };
  }, []);

  return (
    <>
      <div className="flex flex-row-reverse justify-center shadow-md">
        {peers.map((peer, index) => (
          <VideoPeer key={index} peer={peer} hmsActions={hmsActions} />
        ))}
      </div>
    </>
  );
};

export default VideoChat;
