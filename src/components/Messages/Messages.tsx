'use client';

import { useState } from 'react';

const Messages = ({ conversation }) => {
  const [isStreaming, setIsStreaming] = useState(false);

  const handleStreaming = () => {
    setIsStreaming(!isStreaming);
  };

  return (
    <>
      {isStreaming && (
        <div className="flex justify-center outline outline-1">
          <div className="w-[400px] h-[300px] bg-red-200  m-3"></div>
          <div className="w-[400px] h-[300px] bg-red-200  m-3"></div>
        </div>
      )}
      <div>
        {conversation?.map((data, index) => {
          return <div key={index}>{data.message}</div>;
        })}
      </div>
      <div className="fixed bottom-0 w-full outline outline-1">
        <input type="text" placeholder="對話框框放這邊" />
        <button className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded">送出</button>
        <button className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded">傳送語音</button>
        <button className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded">傳送圖片</button>
        <button className="m-1 bg-gray-600  text-white font-bold py-2 px-4 rounded" onClick={handleStreaming}>
          視訊聊聊
        </button>
      </div>
    </>
  );
};

export default Messages;
