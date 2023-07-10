'use client';
import formatDate from '@/app/utils/formatDate';
import Link from 'next/link';
import ApplyButton from '../ApplyButton/ApplyButton';
import WithdrawButton from '../WithdrawButton/WithdrawButton';
import ReviewButton from '../ReviewButton/ReviewButton';
import Image from 'next/image';

const EventCard = ({ event, portal = false, edit = false, cancel = false, withdraw = false, apply = false, review = false, updateWithdraw, toggleReviewModal, hasReview }: EventCardProps) => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';

  return (
    <div className="flex flex-col rounded-md border shadow-md lg:flex-row">
      {/* left pic */}
      <div className="lg:w-[500px]">
        <Image width={0} height={0} sizes="100vw" src={event.mainImage} alt={'event picture'} className="h-48 w-full rounded-t-md object-cover lg:rounded-l-md lg:rounded-tr-none" />
      </div>

      {/* right col */}
      <div className="w-full border p-3">
        {/* upper-right */}
        <div className="flex justify-between">
          <div>
            <h1>{event.title}</h1>
            <div>
              {formatDate(event.startTime)} - {formatDate(event.endTime)}
            </div>
            <p>{event.levelSuggection}</p>
            <div>{event.category}</div>
            {event.locations?.map((location: string, index: number) => (
              <span key={index}>{location} </span>
            ))}
          </div>
          <div className="outline">
            <Link href={`/details/${event.id}`} className="text-sunrise-500">
              GO
            </Link>
          </div>
        </div>
        {/* lower-right */}
        <div className="flex justify-between outline">
          <div>user info card</div>
          <div>
            {!portal && <p>organizer rating: {event.rating}</p>}
            {portal && (
              <div>
                {/* 編輯活動        - waiting && organizer === userID */}
                {edit && <button className="m-1 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">編輯活動</button>}
                {/* 取消活動        - confirm && organizer === userID */}
                {cancel && <button className="m-1 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">取消活動</button>}
                {/* 退出活動        - confirm && organizer !== userID */}
                {withdraw && <WithdrawButton eventID={event.id} userID={userID} updateWithdraw={updateWithdraw} />}
                {/* 等待確認        - waiting && organizer !== userID */}
                {apply && <ApplyButton eventID={event.id} />}
                {/* 留下評價        - confirm && organizer !== userID && timeFrame[1] < today */}
                {review && <ReviewButton event={event} toggleReviewModal={toggleReviewModal} hasReview={hasReview} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
