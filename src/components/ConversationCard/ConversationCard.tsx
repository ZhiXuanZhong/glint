'use client';

import { useEffect, useState } from 'react';

const ConversationCard = ({ data }: { data: Conversation }) => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  // infos保留群組對話的擴充性，目前先以單一個實作
  const [infos, setInfos] = useState<UsersProfile[] | null>(null);

  const fetchProfiles = async (userIDs: string[]) => {
    const resultArray = [];

    for (const user of userIDs) {
      // 這邊限制不去取自己的資料
      if (user !== userID) {
        try {
          const response = await fetch(`/api/profile/${user}`);
          const profileData = await response.json();
          resultArray.push(profileData[user]);
        } catch (error) {
          console.error(`Error fetching profile for userID ${user}:`, error);
        }
      }
    }

    setInfos(resultArray);
  };

  useEffect(() => {
    fetchProfiles(data.userIDs);
  }, []);
  return (
    <div className="flex flex-col m-3 border-red-500 border">
      <div className="flex">
        {infos?.map((user, index) => {
          return (
            <picture key={index} className="p-1">
              <img src={user.avatarURL} alt="avatar" className=" rounded-full" />
            </picture>
          );
        })}
        <div>
          {infos?.map((user, index) => (
            <div key={index} className=" font-bold">
              {user.username}
            </div>
          ))}
          <p className="text-red-500 font-black">latest chat text gose here (WIP)</p>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
