'use client';
import { useVideo } from '@100mslive/react-sdk';

const Peer = ({ peer }) => {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack,
  });
  return (
    <div className="flex">
      <video ref={videoRef} className="h-80 w-80" autoPlay muted playsInline />
      <div className="peer-name">
        {peer.name} {peer.isLocal ? '(You)' : ''}
      </div>
    </div>
  );
};

export default Peer;
