'use client';

import fireMediaUpload from '@/app/utils/fireMediaUpload';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { useRef, useState } from 'react';

const AudioMessage = ({ stream, sendMessage }: { stream: MediaStream; sendMessage: Function }) => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioBlob = useRef<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState<string | null>(null);

  const mimeType = 'audio/webm';

  const startRecording = async () => {
    setAudio(null);
    setIsRecording(true);
    //create new Media recorder instance using the stream
    const media = new MediaRecorder(stream, { mimeType: mimeType });
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();

    let localAudioChunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === 'undefined') return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      setIsRecording(false);
      //stops the recording instance
      mediaRecorder.current.stop();
      mediaRecorder.current.onstop = () => {
        //creates a blob file from the audiochunks data
        audioBlob.current = new Blob(audioChunks, { type: mimeType });
        //creates a playable URL from the blob file.
        const audioUrl = URL.createObjectURL(audioBlob.current);
        setAudio(audioUrl);
        setAudioChunks([]);
      };
    }
  };

  const handleAudioUpload = async () => {
    if (audioBlob.current) {
      // 先以 `${userID}_${Date.now()}}` 當檔名建立url
      // 再回到上層取用發訊息的function
      // 再清空audio讓UI隱藏
      const fileURL = await fireMediaUpload(audioBlob.current, 'message-audio', `${userID}_${Date.now()}`);
      await sendMessage('audio', fileURL);
      setAudio(null);
    }
  };

  return (
    <div className="flex">
      {audio && <audio src={audio} controls></audio>}
      {audio && (
        <button className="m-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white  py-2 px-4 rounded" onClick={handleAudioUpload}>
          送出語音
        </button>
      )}
      <button onMouseDown={startRecording} onMouseUp={stopRecording} className="m-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white  py-2 px-4 rounded">
        {isRecording ? '錄音中...' : '按下錄音'}
      </button>
    </div>
  );
};

export default AudioMessage;
