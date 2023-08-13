'use client';

import fireMediaUpload from '@/app/utils/fireMediaUpload';
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
    const media = new MediaRecorder(stream, { mimeType: mimeType });
    mediaRecorder.current = media;
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

      mediaRecorder.current.stop();
      mediaRecorder.current.onstop = () => {
        audioBlob.current = new Blob(audioChunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob.current);
        setAudio(audioUrl);
        setAudioChunks([]);
      };
    }
  };

  const handleAudioUpload = async () => {
    if (audioBlob.current) {
      const fileURL = await fireMediaUpload(
        audioBlob.current,
        'message-audio',
        `${userID}_${Date.now()}`
      );
      await sendMessage('audio', fileURL);
      setAudio(null);
    }
  };

  return (
    <div className="flex justify-end pr-3">
      {audio && <audio src={audio} controls></audio>}
      {audio && (
        <button
          className="m-1 rounded bg-blue-500 px-4 py-2  text-white hover:bg-blue-600 active:bg-blue-700"
          onClick={handleAudioUpload}
        >
          送出語音
        </button>
      )}
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        className="m-1 rounded bg-orange-500 px-4 py-2  text-white hover:bg-orange-600 active:bg-orange-700"
      >
        {isRecording ? '錄音中...' : '按下錄音'}
      </button>
    </div>
  );
};

export default AudioMessage;
