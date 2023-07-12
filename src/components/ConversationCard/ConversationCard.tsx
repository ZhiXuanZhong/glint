'use client';

import { useProfilesStore } from '@/store/messageUserProfilesStore';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const ConversationCard = ({ data }: { data: Conversation }) => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
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
          resultArray.push({ ...profileData[user], id: userID, conversationID: data.conversationID });
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
    <div className="flex flex-col border-b">
      <div className="flex h-16 items-center gap-3 px-4">
        {infos?.map((user, index) => {
          return (
            <div className="flex" key={index}>
              <Image width={60} height={60} src={user.avatarURL} alt={'avatar'} className="aspect-square rounded-full object-cover" />
            </div>
          );
        })}
        <div className="flex w-full flex-col justify-center">
          {infos?.map((user, index) => (
            <div key={index} className="text-xl font-bold text-moonlight-900">
              {user.username}
            </div>
          ))}
          {/* <p className="text-moonlight-600">latest chat text gose here (WIP)</p> */}
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
