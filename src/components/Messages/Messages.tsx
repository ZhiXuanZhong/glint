'use client';

import db from '@/app/utils/firebaseConfig';
import VideoChat from '../VideoChat/VideoChat';
import AudioMessage from '../AudioMessage/AudioMessage';
import ImageMessage from '../ImageMessage/ImageMessage';
import MessageBubble from '../MessageBubble/MessageBubble';
import { Key, use, useEffect, useRef, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useProfilesStore } from '@/store/messageUserProfilesStore';
import Image from 'next/image';
import { FaMicrophone, FaRegImage, FaVideo } from 'react-icons/fa';
import { PiChatsThin } from 'react-icons/pi';
import { useAuthStore } from '@/store/authStore';
import classNames from '@/app/utils/classNames';

const Messages = ({ messages, currentConversation }: { messages: Message[]; currentConversation: string }) => {
  const [authUser] = useAuthStore((state) => [state.authUser]);
  const [authProfile] = useAuthStore((state) => [state.authProfile]);

  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  const username = 'Admin';
  const inputImageRef = useRef<HTMLInputElement>(null);
  const inputTextRef = useRef<HTMLInputElement>(null);
  const dummyRef = useRef<HTMLDivElement>(null);
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [profiles] = useProfilesStore((state) => [state.profiles]);

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
      userID: authUser,
      username: authProfile.username,
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
    <div className="flex h-full w-full flex-col">
      <div className="flex min-h-[80px] items-center justify-between border-b bg-white px-5 shadow-sm">
        {profiles
          .filter((profile) => profile.conversationID === currentConversation)
          .map((profile, index) => {
            return (
              <div className="flex h-20 items-center gap-3" key={index}>
                <Image width={50} height={50} src={profile.avatarURL} alt="avatar" className="h-12 w-12 rounded-full border border-moonlight-50 object-cover" />
                <div className=" text-moonlight-950">{profile.username}</div>
              </div>
            );
          })}
        <div
          className="m-1 ml-auto flex cursor-pointer items-center justify-center gap-2 rounded
          border border-transparent bg-sunrise-400 px-5 py-2 font-bold text-white 
          transition-all hover:border hover:border-sunrise-500 hover:bg-white hover:text-sunrise-500 hover:shadow-md
          "
          onClick={toggleStreaming}
        >
          <div>視訊聊聊</div>
          <FaVideo className="text-2xl" />
        </div>
      </div>
      {isStreaming && <VideoChat toggleStreaming={toggleStreaming} />}
      <div className={classNames('mt-auto overflow-auto', messages.length ? null : 'mb-auto')}>
        {messages.length ? (
          messages.map((message, index) => <MessageBubble key={index} message={message} authUser={authUser} />)
        ) : (
          <div className="flex w-full flex-col items-center justify-center">
            <PiChatsThin className="text-9xl text-moonlight-800 opacity-50" />
            <div className="select-none text-xl font-medium text-moonlight-900 opacity-60">說聲Hello，開啟旅程吧！</div>
          </div>
        )}
        <div ref={dummyRef}></div>
      </div>
      {/* 文字外的媒體呈現區塊 */}
      {audioStream && <AudioMessage stream={audioStream} sendMessage={sendMessage} />}
      {inputImage && <ImageMessage inputImage={inputImage} setInputImage={setInputImage} sendMessage={sendMessage} />}
      {/* 聊天室功能UI */}
      <div className="flex h-12 w-full items-center px-4">
        <form
          className="flex grow items-center"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input className="grow rounded-full border border-slate-300 py-1 pl-3 pr-3 shadow-sm focus:outline-none" type="text" placeholder="輸入訊息..." ref={inputTextRef} />

          <div className="flex px-2">
            <div className=" cursor-pointer rounded-md p-3 text-2xl hover:bg-moonlight-300" onClick={getMicrophonePermission}>
              <FaMicrophone />
            </div>
            <div
              className=" cursor-pointer rounded-md p-3 text-2xl hover:bg-moonlight-300"
              onClick={() => {
                inputImageRef.current?.click();
              }}
            >
              <FaRegImage />
            </div>
          </div>

          <button
            className="rounded bg-gray-600 px-10 py-2 font-bold text-white"
            onClick={() => {
              if (inputTextRef.current && inputTextRef.current.value !== '') {
                sendMessage('text', inputTextRef.current?.value);
                inputTextRef.current.value = '';
              }
            }}
          >
            送出
          </button>
        </form>

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
      </div>
    </div>
  );
};

export default Messages;
