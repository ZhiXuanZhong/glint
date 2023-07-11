'use client';
import { useVideo, useAVToggle } from '@100mslive/react-sdk';
import { MdVideocam, MdVideocamOff, MdMic, MdMicOff } from 'react-icons/md';

const VideoPeer = ({ peer, hmsActions }: { peer: any; hmsActions: any }) => {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack,
  });

  const handleLeave = () => {
    hmsActions.leave();
  };

  const { isLocalAudioEnabled, isLocalVideoEnabled, toggleAudio, toggleVideo } = useAVToggle();

  return (
    <div className="relative">
      <video ref={videoRef} className="m-3 h-[300px] w-[400px] overflow-hidden rounded-sm border border-moonlight-50" autoPlay muted playsInline />

      {peer.isLocal && (
        <div className="control-bar absolute bottom-4 flex w-full justify-center px-4">
          <button className="m-1 rounded-sm border bg-white px-4 py-2 text-2xl text-moonlight-700 opacity-90" onClick={toggleAudio}>
            {isLocalAudioEnabled ? <MdMic className="text-green-600" /> : <MdMicOff className="text-red-600" />}
          </button>
          <button className="m-1 rounded-sm border bg-white px-4 py-2 text-2xl text-moonlight-700 opacity-90" onClick={toggleVideo}>
            {isLocalVideoEnabled ? <MdVideocam className="text-green-600" /> : <MdVideocamOff className="text-red-600" />}
          </button>
          <button
            className="m-1 ml-auto rounded-sm border bg-white px-4 py-2 text-moonlight-700 opacity-90 transition-colors hover:border-transparent hover:bg-sunrise-600 hover:text-white"
            onClick={handleLeave}
          >
            結束視訊
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPeer;
