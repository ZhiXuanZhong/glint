'use client';
import classNames from '@/app/utils/classNames';
import { formatTime } from '@/app/utils/formatDate';

const MessageBubble = ({ message, authUser }: { message: Message; authUser: string }) => {
  return (
    <>
      {message.type === 'text' && (
        <div>
          <div className={classNames('m-1 w-fit max-w-xs rounded-lg bg-slate-300 p-3', message.userID === authUser ? 'ml-auto' : null)}>
            <div className={classNames('relative text-sm font-semibold', message.userID === authUser ? 'hidden' : null)}>{message.username}</div>
            {message.data}
          </div>
          <div className={classNames('m-1 text-xs  font-semibold', message.userID === authUser ? 'text-right' : null)}>{formatTime(message.timestamp)}</div>
        </div>
      )}
      {message.type === 'image' && (
        <div>
          <div className={classNames('m-1 w-fit max-w-xs cursor-pointer rounded-lg bg-slate-300 p-3', message.userID === authUser ? 'ml-auto' : null)}>
            <div className={classNames('text-sm font-semibold', message.userID === authUser ? 'hidden' : null)}>{message.username}</div>
            <picture>
              <img src={message.data} alt="message picture" className=" rounded" />
            </picture>
          </div>
          <div className={classNames('m-1 text-xs  font-semibold', message.userID === authUser ? 'text-right' : null)}>{formatTime(message.timestamp)}</div>
        </div>
      )}
      {message.type === 'audio' && (
        <div>
          <div className={classNames('m-1 w-fit max-w-xs rounded-lg bg-slate-300 p-3', message.userID === authUser ? 'ml-auto' : null)}>
            <div className={classNames('text-sm font-semibold', message.userID === authUser ? 'hidden' : null)}>{message.username}</div>
            <audio src={message.data} controls />
          </div>
          <div className={classNames('m-1 text-xs  font-semibold', message.userID === authUser ? 'text-right' : null)}>{formatTime(message.timestamp)}</div>
        </div>
      )}
    </>
  );
};

export default MessageBubble;
