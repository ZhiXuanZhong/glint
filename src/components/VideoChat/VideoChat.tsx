'use client';
import VideoPeer from '../VideoPeer/VideoPeer';
import { useHMSActions, selectIsConnectedToRoom, useHMSStore, selectPeers, selectPeerCount } from '@100mslive/react-sdk';
import { useEffect, useState } from 'react';
import { ScaleLoader } from 'react-spinners';

const VideoChat = ({ toggleStreaming }: { toggleStreaming: () => void }) => {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const peers = useHMSStore(selectPeers);
  const count = useHMSStore(selectPeerCount);
  const [loading, setLoading] = useState(true);
  const [connectionState, setConnectionState] = useState('等待對方加入');

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

  // 不是自己的視訊源進來時，會有空白，為了美觀先用白底div擋掉
  useEffect(() => {
    if (count > 1) {
      setConnectionState('建立連線中');
      setTimeout(() => {
        setLoading(false);
      }, 4000);
    }
  }, [count]);

  return (
    <div className="relative">
      {peers.length > 0 && (
        <div className="flex flex-row-reverse justify-center shadow-md">
          {peers.map((peer, index) => (
            <VideoPeer key={index} peer={peer} hmsActions={hmsActions} />
          ))}
          {loading && (
            <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-2 bg-white">
              <ScaleLoader color="#ff690e" />
              <div className="text-lg tracking-wider text-sunrise-500">{connectionState}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoChat;
