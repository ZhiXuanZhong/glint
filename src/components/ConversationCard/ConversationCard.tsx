'use client';

import { useProfilesStore } from '@/store/messageUserProfilesStore';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import 'dayjs/locale/zh-tw';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
dayjs.locale('zh-tw');
dayjs.extend(relativeTime);

const ConversationCard = ({ data, authUser, messagesChunk }: { data: Conversation; authUser: string; messagesChunk: Message[] }) => {
  const userID = authUser;
  // infos保留群組對話的擴充性，目前先以單一個實作
  const [infos, setInfos] = useState<UsersProfile[] | null>(null);
  const [profiles, addProfile] = useProfilesStore((state) => [state.profiles, state.addProfile]);

  function checkUserExists(userID: string, profiles: UsersProfile[]) {
    const userExists = profiles.some((profile) => profile.id === userID);
    return userExists;
  }

  const fetchProfiles = async (userIDs: string[]) => {
    const resultArray = [];

    for (const user of userIDs) {
      // 這邊限制不去取自己的資料

      if (checkUserExists(user, profiles)) return;

      if (user !== userID) {
        try {
          const response = await fetch(`/api/profile/${user}`);
          const profileData = await response.json();
          resultArray.push({ ...profileData[user], id: user, conversationID: data.conversationID });
        } catch (error) {
          console.error(`Error fetching profile for userID ${user}:`, error);
        }
      }
    }
    addProfile(resultArray);
    setInfos(resultArray);
  };

  useEffect(() => {
    fetchProfiles(data.userIDs);
  }, []);
  return (
    <div className="flex flex-col border-b lg:w-[450px]">
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="w-[60px]">
          {infos?.map((user, index) => {
            return <Image width={60} height={60} src={user.avatarURL} alt={'avatar'} className="aspect-square rounded-full object-cover" key={index} />;
          })}
        </div>
        {infos && (
          <div className="flex w-full flex-col justify-center">
            {infos.map((user, index) => (
              <div key={index} className="font-bold text-moonlight-900">
                {user.username}
              </div>
            ))}
            {/* <p className="text-moonlight-600">{messagesChunk?.map((data) => data.data)[0]}</p> */}
            <p className="text-moonlight-700">
              {messagesChunk
                ?.filter((message) => message.conversationID === data.conversationID)
                .slice(-1)
                .map((data) => {
                  return (
                    <div className="flex items-center justify-between">
                      <div className="line-clamp-1 max-w-[280px]">{data.userID === userID ? `You: ${data.data}` : data.data}</div>
                      <div className="text-sm">{dayjs(data.timestamp).fromNow()}</div>
                    </div>
                  );
                })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationCard;
