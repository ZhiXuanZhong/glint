'use client';
import classNames from '@/app/utils/classNames';
import { formatTime } from '@/app/utils/formatDate';

const MessageBubble = ({ message }: { message: Message }) => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';

  return (
    <>
      {message.type === 'text' && (
        <div>
          <div className={classNames('bg-slate-300 max-w-xs rounded-lg p-3 m-1', message.userID === userID ? 'ml-auto' : null)}>
            <div className={classNames('text-sm font-semibold', message.userID === userID ? 'hidden' : null)}>{message.username}</div>
            {message.data}
          </div>
          <div className={classNames('text-xs m-1  font-semibold', message.userID === userID ? 'text-right' : null)}>{formatTime(message.timestamp)}</div>
        </div>
      )}
      {message.type === 'image' && (
        <div>
          <div className={classNames('bg-slate-300 max-w-xs rounded-lg p-3 m-1', message.userID === userID ? 'ml-auto' : null)}>
            <div className={classNames('text-sm font-semibold', message.userID === userID ? 'hidden' : null)}>{message.username}</div>
            <picture>
              <img src={message.data} alt="message picture" className=" rounded" />
            </picture>
          </div>
          <div className={classNames('text-xs m-1  font-semibold', message.userID === userID ? 'text-right' : null)}>{formatTime(message.timestamp)}</div>
        </div>
      )}
      {message.type === 'audio' && (
        <div>
          <div className={classNames('bg-slate-300 max-w-xs rounded-lg p-3 m-1', message.userID === userID ? 'ml-auto' : null)}>
            <div className={classNames('text-sm font-semibold', message.userID === userID ? 'hidden' : null)}>{message.username}</div>
            <audio src={message.data} controls />
          </div>
          <div className={classNames('text-xs m-1  font-semibold', message.userID === userID ? 'text-right' : null)}>{formatTime(message.timestamp)}</div>
        </div>
      )}
    </>
  );
};

export default MessageBubble;
