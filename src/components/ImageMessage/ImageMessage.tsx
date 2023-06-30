'use client';
import { app as fireApp } from '@/app/utils/firebaseConfig';
import fireMediaUpload from '@/app/utils/fireMediaUpload';
import { SetStateAction } from 'react';

interface ImageMessageProps {
  inputImage: File | null;
  setInputImage: (value: SetStateAction<File | null>) => void;
}

const ImageMessage = ({ inputImage, setInputImage }: ImageMessageProps) => {
  const sendImage = async () => {
    fireApp;
    // FIXME 這邊的檔案名要跟訊息doc.id一樣
    if (inputImage) {
      try {
        await fireMediaUpload(inputImage, 'message-image', String(Date.now()));
        setInputImage(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {inputImage && (
        <picture>
          <img alt="preview image" src={URL.createObjectURL(inputImage)} className="w-96" />
        </picture>
      )}
      <button className="m-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white  py-2 px-4 rounded" onClick={sendImage}>
        送出
      </button>
      <button
        className="m-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white  py-2 px-4 rounded"
        onClick={() => {
          setInputImage(null);
        }}
      >
        取消
      </button>
    </>
  );
};

export default ImageMessage;
