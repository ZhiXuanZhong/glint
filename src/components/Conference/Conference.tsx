'use client';
import { selectPeers, useHMSStore } from '@100mslive/react-sdk';
import Peer from '../Peers/Peer';

const Conference = () => {
  const peers = useHMSStore(selectPeers);
  return (
    <div className="conference-section">
      <h2>Conference</h2>

      <div className="flex">
        {peers.map((peer) => (
          <Peer key={peer.id} peer={peer} />
        ))}
      </div>
    </div>
  );
};

export default Conference;
