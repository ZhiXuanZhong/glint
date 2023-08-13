'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import clientAPI from '@/app/utils/clientAPI';
import 'dayjs/locale/zh-tw';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
dayjs.locale('zh-tw');
dayjs.extend(relativeTime);

interface ConversationCard {
  data: Conversation;
  authUser: string;
  messagesChunk: Message[];
}

const ConversationCard = ({ data, authUser, messagesChunk }: ConversationCard) => {
  const [recieverProfile, setRecieverProfile] = useState<UsersProfile>();

  useEffect(() => {
    const reciever = data.userIDs.filter((userID) => userID !== authUser)[0];
    clientAPI.getProfile(reciever).then((profile) => setRecieverProfile(profile[reciever]));
  }, []);

  return (
    <div className="flex flex-col border-b lg:w-[450px]">
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="w-[60px]">
          {recieverProfile && (
            <Image
              width={60}
              height={60}
              src={recieverProfile.avatarURL}
              alt={'avatar'}
              className="aspect-square rounded-full object-cover"
            />
          )}
        </div>
        {recieverProfile && (
          <div className="hidden w-full flex-col justify-center md:flex">
            <div className="line-clamp-1font-bold text-moonlight-900">
              {recieverProfile.username}
            </div>
            <div className="text-moonlight-700">
              {messagesChunk
                ?.filter((message) => message.conversationID === data.conversationID)
                .slice(-1)
                .map((data, index) => {
                  return (
                    <div className="hidden lg:flex lg:items-center lg:justify-between" key={index}>
                      <div className="line-clamp-1 max-w-[280px]">
                        {data.userID === authUser ? `You: ${data.data}` : data.data}
                      </div>
                      <div className="text-sm">{dayjs(data.timestamp).fromNow()}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationCard;
