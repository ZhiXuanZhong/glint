'use client';

import VideoChat from '../VideoChat/VideoChat';
import AudioMessage from '../AudioMessage/AudioMessage';
import ImageMessage from '../ImageMessage/ImageMessage';
import { Key, useRef, useState } from 'react';

const Messages = ({ conversations }: { conversations: Conversation[] }) => {
  const inputImageRef = useRef<HTMLInputElement>(null);
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const addFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (target.files && target.files[0]) {
      setInputImage(target.files[0]);
    }
  };

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
    <div className="flex flex-col h-full">
      <div className=" h-10 flex justify-center items-center bg-zinc-200">Conversation name</div>
      {isStreaming && <VideoChat toggleStreaming={toggleStreaming} />}
      <div className="mt-auto overflow-auto"></div>
      {/* 聊天室功能UI */}
      <div className=" outline">
        <input type="text" placeholder="對話框框放這邊" />
        <button className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded">送出</button>

        <button className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded" onClick={getMicrophonePermission}>
          傳送語音
        </button>

        <button
          className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            inputImageRef.current?.click();
          }}
        >
          傳送圖片
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={inputImageRef}
          onChange={addFile}
          onClick={(event) => {
            (event.target as HTMLInputElement).value = '';
          }}
        />

        <button className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded" onClick={toggleStreaming}>
          視訊聊聊
        </button>

        {audioStream && <AudioMessage stream={audioStream} />}
        {inputImage && <ImageMessage inputImage={inputImage} setInputImage={setInputImage} />}
      </div>
    </div>
  );
};

export default Messages;
