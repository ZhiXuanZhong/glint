'use client';

import VideoChat from '../VideoChat/VideoChat';
import AudioMessage from '../AudioMessage/AudioMessage';
import { Key, useState } from 'react';

const Messages = ({ conversation }: { conversation: Conversation[] }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const toggleStreaming = () => {
    setIsStreaming(!isStreaming);
  };

  const getMicrophonePermission = async () => {
    if (audioStream) return setAudioStream(null);

    if ('MediaRecorder' in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        setAudioStream(streamData);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert('裝置不支援語音功能');
    }
  };

  return (
    <>
      {isStreaming && <VideoChat toggleStreaming={toggleStreaming} />}
      <div>
        {conversation?.map((data: Conversation, index: Key) => {
          return <div key={index}>{data.message}</div>;
        })}
      </div>
      <div className="fixed bottom-0 w-full outline outline-1">
        <input type="text" placeholder="對話框框放這邊" />
        <button className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded">送出</button>
        <button className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded" onClick={getMicrophonePermission}>
          傳送語音
        </button>
        <button className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded">傳送圖片</button>
        <button className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded" onClick={toggleStreaming}>
          視訊聊聊
        </button>
        {audioStream && <AudioMessage stream={audioStream} />}
      </div>
    </>
  );
};

export default Messages;
