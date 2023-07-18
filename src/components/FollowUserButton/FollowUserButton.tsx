'use client';

import { useState } from 'react';

const FollowUserButton = ({ setFollowCount }: { setFollowCount: Function }) => {
  const [isFollow, setFollow] = useState(false);
  return isFollow ? (
    <button
      className="w-full rounded-sm border border-blue-400 py-1 text-base text-blue-400 hover:border-gray-600 hover:bg-gray-600 hover:text-white hover:transition-all md:w-24"
      onClick={() => {
        setFollow(!isFollow);
        setFollowCount((prev) => ({ ...prev, followersCount: 1 }));
      }}
    >
      已追蹤
    </button>
  ) : (
    <button
      className="w-full rounded-sm border border-transparent bg-blue-400 py-1 text-base text-white hover:bg-sunrise-600 hover:transition-all md:w-24"
      onClick={() => {
        setFollow(!isFollow);
        setFollowCount((prev) => ({ ...prev, followersCount: 2 }));
      }}
    >
      追蹤
    </button>
  );
};

export default FollowUserButton;
