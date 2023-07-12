'use client';
import { app as fireApp } from '@/app/utils/firebaseConfig';
import fireMediaUpload from '@/app/utils/fireMediaUpload';
import { SetStateAction } from 'react';

interface ImageMessageProps {
  inputImage: File | null;
  setInputImage: (value: SetStateAction<File | null>) => void;
  sendMessage: Function;
}

const ImageMessage = ({ inputImage, setInputImage, sendMessage }: ImageMessageProps) => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';

  const sendImage = async () => {
    if (inputImage) {
      try {
        // 先以 `${userID}_${Date.now()}}` 當檔名建立url
        // 再回到上層取用發訊息的function
        // 再清空inputImage讓UI隱藏
        const fileURL = await fireMediaUpload(inputImage, 'message-image', `${userID}_${Date.now()}`);
        await sendMessage('image', fileURL);
        setInputImage(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      {inputImage && (
        <picture>
          <img alt="preview image" src={URL.createObjectURL(inputImage)} className="w-96" />
        </picture>
      )}
      <button className="m-1 w-96 rounded bg-blue-500 px-4 py-2  text-white hover:bg-blue-600 active:bg-blue-700" onClick={sendImage}>
        送出
      </button>
      <button
        className="m-1 w-96 rounded bg-orange-500 px-4 py-2  text-white hover:bg-orange-600 active:bg-orange-700"
        onClick={() => {
          setInputImage(null);
        }}
      >
        取消
      </button>
    </div>
  );
};

export default ImageMessage;
