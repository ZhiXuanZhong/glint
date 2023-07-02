'use client';

import db from '@/app/utils/firebaseConfig';
import VideoChat from '../VideoChat/VideoChat';
import AudioMessage from '../AudioMessage/AudioMessage';
import ImageMessage from '../ImageMessage/ImageMessage';
import MessageBubble from '../MessageBubble/MessageBubble';
import { Key, use, useEffect, useRef, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';

const Messages = ({ messages, currentConversation }: { messages: Message[]; currentConversation: string }) => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  const username = 'Admin';
  const inputImageRef = useRef<HTMLInputElement>(null);
  const inputTextRef = useRef<HTMLInputElement>(null);
  const dummyRef = useRef<HTMLDivElement>(null);
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

  const sendMessage = async (type: string, data?: string) => {
    const messagesDetailsRef = collection(db, 'messages', currentConversation, 'details');

    const message = {
      userID: userID,
      username: 'Admin',
      timestamp: Date.now(),
      type,
      data,
    };

    await addDoc(messagesDetailsRef, message);
  };

  useEffect(() => {
    dummyRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className=" h-10 flex justify-center items-center bg-zinc-200">{currentConversation}</div>
      {isStreaming && <VideoChat toggleStreaming={toggleStreaming} />}
      <div className="mt-auto overflow-auto">
        {messages?.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        <div ref={dummyRef}></div>
      </div>
      {/* 聊天室功能UI */}
      <div className=" outline">
        <>
          <input type="text" placeholder="對話框框放這邊" ref={inputTextRef} />
          <button
            className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              if (inputTextRef.current && inputTextRef.current.value !== '') {
                sendMessage('text', inputTextRef.current?.value);
                inputTextRef.current.value = '';
              }
            }}
          >
            送出
          </button>
        </>

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
