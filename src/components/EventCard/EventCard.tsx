'use client';
import formatDate from '@/app/utils/formatDate';
import Link from 'next/link';
import ApplyButton from '../ApplyButton/ApplyButton';
import WithdrawButton from '../WithdrawButton/WithdrawButton';
import ReviewButton from '../ReviewButton/ReviewButton';
import Image from 'next/image';
import { convertLocationCode } from '@/app/utils/convertLocationCode';
import { convertCategoryCode } from '@/app/utils/convertCategoryCode';
import UserInfo from '../UserInfo/UserInfo';
import Rating from '../Rating/Rating';
import classNames from '@/app/utils/classNames';

const EventCard = ({
  event,
  portal = false,
  edit = false,
  cancel = false,
  withdraw = false,
  apply = false,
  review = false,
  updateWithdraw,
  toggleReviewModal,
  hasReview,
  children,
}: EventCardProps) => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';

  return (
    <div className="flex flex-col overflow-hidden rounded-md border shadow-md lg:h-64 lg:flex-row">
      {/* left pic */}
      <div className="h-52 lg:h-auto lg:w-[550px]">
        <Image width={0} height={0} sizes="100vw" src={event.mainImage} alt={'event picture'} className="h-full w-full  object-cover " />
      </div>

      {/* right col */}
      <div className="w-full border p-3">
        {/* upper-right */}
        <div className="flex flex-wrap justify-between">
          <div className="mb-2">
            <h1 className=" mb-1 text-lg font-semibold text-moonlight-900">{event.title}</h1>
            <div className="text-moonlight-800">
              {formatDate(event.startTime)} - {formatDate(event.endTime)}
            </div>
            <p className=" text-moonlight-800">{event.levelSuggection}</p>
            <div className="mt-2 flex gap-3">
              <div className="my-1 w-fit rounded-sm bg-moonlight-500 px-3 py-1 text-sm font-light text-white">{convertCategoryCode(event.category)}</div>
              {event.locations?.map((location: string, index: number) => (
                <div key={index} className="my-1 w-fit rounded-sm bg-moonlight-500 px-3 py-1 text-sm font-light text-white">
                  {convertLocationCode(location)}
                </div>
              ))}
            </div>
          </div>
          <div className="ml-auto flex items-end">
            <Link
              href={`/details/${event.id}`}
              className="mb-3 w-full min-w-[100px] rounded-sm border border-transparent bg-sunrise-400 px-4 py-2 font-bold text-white transition-all hover:border hover:border-sunrise-500 hover:bg-white hover:text-sunrise-500 hover:shadow-md"
            >
              查看活動
            </Link>
          </div>
        </div>
        {/* lower-right */}
        <div className={classNames('flex items-center justify-between pt-3', children ? 'border-t' : null)}>
          <div>{children}</div>
          <div>
            {!portal && (
              <div className={classNames('w-36', !children ? 'hidden' : null)}>
                <Rating userID={event.organizer} />
              </div>
            )}
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
