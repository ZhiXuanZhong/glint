'use client';
import db from '@/app/utils/firebaseConfig';
import { ChangeEvent } from 'react';
import { addDoc, collection, doc, getDoc, increment, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useState } from 'react';

const ReviewForm = ({ event, toggleReviewModal, updateReview }: { event: PortalEvent; toggleReviewModal: Function; updateReview: Function }) => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  const reviewRef = doc(db, 'users', userID, 'events', event.id);
  const organizerRatingDoc = doc(db, 'reviews', event.data.organizer);
  const organizerDetailsCollection = collection(db, 'reviews', event.data.organizer, 'details');

  const defaultInput = {
    rating: 10,
    comment: 'Amazing experience！',
  };

  const [reviewInput, setReviewInput] = useState(defaultInput);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setReviewInput({ ...reviewInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // 更新發起人分數
      await updateDoc(organizerRatingDoc, {
        ratingSum: increment(reviewInput.rating),
        reviewCount: increment(1),
      });

      // 把評價存入發起人datails內
      await addDoc(organizerDetailsCollection, {
        timestamp: serverTimestamp(),
        userID: userID,
        eventID: event.id,
        comment: reviewInput.comment,
        rating: reviewInput.rating,
      });

      // 更新user的活動紀錄為已評價
      await updateDoc(reviewRef, {
        hasReview: true,
      });

      // 更新local state推動畫面更新
      updateReview(event.id);

      // 關掉彈窗
      toggleReviewModal(null);
    } catch (error) {
      alert('發生錯誤，請稍後再試。');
    }
  };

  return (
    <div className="backdrop-blur-[2px] bg-white/30 h-screen w-screen fixed ">
      <div className="bg-slate-200 p-3 w-60 rounded flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
        <div>{event.data.title}</div>
        <div>eventID:</div>
        <div>{event.id}</div>
        <form className="flex flex-col items-center" onSubmit={(e) => e.preventDefault()}>
          <div>評分 1~10</div>
          <input type="number" min={1} max={10} name="rating" value={reviewInput.rating} onChange={handleInput} required />
          <div>評價</div>
          <input type="text" name="comment" value={reviewInput.comment} onChange={handleInput} required />
          <button className="m-2 p-2 bg-blue-200 cursor-pointer" onClick={handleSubmit}>
            送出評論
          </button>
        </form>
        <button
          className="m-2 p-2 bg-blue-200 cursor-pointer"
          onClick={() => {
            toggleReviewModal(null);
          }}
        >
          關閉
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
