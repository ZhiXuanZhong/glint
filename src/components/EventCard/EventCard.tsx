'use client';
import Link from 'next/link';
import ApplyButton from '../ApplyButton/ApplyButton';
import WithdrawButton from '../WithdrawButton/WithdrawButton';

const EventCard = ({ event, portal = false, edit = false, cancel = false, withdraw = false, apply = false, review = false, updateWithdraw }: EventCardProps) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('zh');
    return formattedDate;
  };

  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';

  return (
    <div className="shadow-md m-6 rounded-lg bg-gray-50">
      <h1>{event.title}</h1>
      <h1>Event ID:{event.id}</h1>
      <h1>organizerType:{event.organizerType}</h1>
      <p>event.organizer = {event.organizer}</p>
      <div>
        {formatDate(event.startTime)} - {formatDate(event.endTime)}
      </div>
      <p>{event.levelSuggection}</p>
      <div>{event.category}</div>
      {event.locations?.map((location: string, index: number) => (
        <span key={index}>{location} </span>
      ))}
      <p>organizer rating: {event.rating}</p>
      <Link href={`/details/${event.id}`} className="text-green-500 hover:text-green-300">
        Details
      </Link>
      {portal && (
        <div>
          {/* 編輯活動        - waiting && organizer === userID */}
          {edit && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-1 rounded">編輯活動</button>}
          {/* 取消活動        - confirm && organizer === userID */}
          {cancel && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-1 rounded">取消活動</button>}
          {/* 退出活動        - confirm && organizer !== userID */}
          {withdraw && <WithdrawButton eventID={event.id} userID={userID} updateWithdraw={updateWithdraw} />}
          {/* 等待確認        - waiting && organizer !== userID */}
          {apply && <ApplyButton eventID={event.id} />}
          {/* 留下評價        - confirm && organizer !== userID && timeFrame[1] < today */}
          {review && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-1 rounded">留下評價</button>}
        </div>
      )}
    </div>
  );
};

export default EventCard;
