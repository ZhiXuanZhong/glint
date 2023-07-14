'use client';

import { useEffect, useState } from 'react';

const Rating = ({ userID }: { userID: string }) => {
  const [rating, setRating] = useState<UserRating>();

  const getRating = async (id: string) => {
    const response = await fetch(`/api/rating/${id}`, { next: { revalidate: 5 } });
    return response.json();
  };

  useEffect(() => {
    const initData = async () => {
      const ratingRes = await getRating(userID);
      setRating(ratingRes);
    };

    initData();
  }, []);

  return (
    <>
      {rating && (
        <div className="flex cursor-pointer flex-col rounded-sm bg-moonlight-100 p-2">
          <div className="text-center text-3xl font-black text-moonlight-800">{rating ? rating.rating.toFixed(1) : ''}</div>
          <div className="pt-1 text-center text-xs font-light text-gray-500">根據{rating.reviewCount}篇評價</div>
        </div>
      )}
    </>
  );
};

export default Rating;
