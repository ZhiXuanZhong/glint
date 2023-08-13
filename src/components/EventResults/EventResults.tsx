'use client';
import EventCard from '../EventCard/EventCard';
import UserInfo from '../UserInfo/UserInfo';

const EventResults = ({ events }: { events: Array<Event> }) => {
  return (
    <div className="flex flex-col gap-4">
      {events.length ? (
        <>
          {events.map((event) => (
            <EventCard event={event} key={crypto.randomUUID()}>
              <UserInfo userID={event.organizer} size={80} />
            </EventCard>
          ))}
          <div className="py-2 text-center text-sm text-gray-400">已無其他活動</div>
        </>
      ) : null}
    </div>
  );
};

export default EventResults;
