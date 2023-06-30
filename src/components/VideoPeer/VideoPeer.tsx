'use client';
import { useVideo, useAVToggle } from '@100mslive/react-sdk';

const VideoPeer = ({ peer, hmsActions }: { peer: any; hmsActions: any }) => {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack,
  });

  const handleLeave = () => {
    hmsActions.leave();
  };

  const { isLocalAudioEnabled, isLocalVideoEnabled, toggleAudio, toggleVideo } = useAVToggle();

  return (
    <div>
      <video ref={videoRef} className="w-[400px] h-[300px] m-3" autoPlay muted playsInline />

      {peer.isLocal && (
        <div className="control-bar">
          <button className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded" onClick={handleLeave}>
            結束視訊
          </button>
          <button className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded" onClick={toggleAudio}>
            {isLocalAudioEnabled ? '靜音' : '取消靜音'}
          </button>
          <button className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded" onClick={toggleVideo}>
            {isLocalVideoEnabled ? '關閉視訊' : '開啟視訊'}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPeer;
