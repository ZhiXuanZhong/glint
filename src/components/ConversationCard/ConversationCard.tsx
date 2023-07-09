'use client';

import { useProfilesStore } from '@/store/messageUserProfilesStore';
import { useEffect, useState } from 'react';

const ConversationCard = ({ data }: { data: Conversation }) => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  // infos保留群組對話的擴充性，目前先以單一個實作
  const [infos, setInfos] = useState<UsersProfile[] | null>(null);
  const [profiles, addProfile] = useProfilesStore((state) => [state.profiles, state.addProfile]);

  const fetchProfiles = async (userIDs: string[]) => {
    const resultArray = [];

    for (const user of userIDs) {
      // 這邊限制不去取自己的資料
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
    <div className="flex flex-col border-t">
      <div className="flex">
        {infos?.map((user, index) => {
          return (
            <picture key={index} className="p-1">
              <img src={user.avatarURL} alt="avatar" className=" rounded-full" width={50} />
            </picture>
          );
        })}
        <div>
          {infos?.map((user, index) => (
            <div key={index} className=" font-bold">
              {user.username}
            </div>
          ))}
          <p className="font-black">latest chat text gose here (WIP)</p>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
