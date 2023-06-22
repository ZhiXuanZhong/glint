'use client';

interface Event {
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

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString('zh');
  return formattedDate;
};

const EventResults = ({ events }: { events: Array<Event> | undefined }) => {
  return (
    <div>
      {events &&
        events.map((event: Event, index: number) => (
          <div key={index} className="shadow-md m-6 rounded-lg bg-gray-50">
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
        ))}
    </div>
  );
};

export default EventResults;
