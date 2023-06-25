'use client';
import Link from 'next/link';

interface Event {
  rating: number;
  title: string;
  organizer: string;
  levelSuggection: string;
  status: string;
  description: string;
  createdTime: {
    seconds: number;
    nanoseconds: number;
  };
  endTime: number;
  mainImage: string;
  locations: string[];
  startTime: number;
  organizerType: string;
  organizerLevel: string;
  category: string;
  id: string;
}

const EventResults = ({ events }: { events: Array<Event> | undefined }) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('zh');
    return formattedDate;
  };

  return (
    <div>
      {events &&
        events.map((event: Event, index: number) => (
          <div key={index} className="shadow-md m-6 rounded-lg bg-gray-50">
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
          </div>
        ))}
    </div>
  );
};

export default EventResults;
