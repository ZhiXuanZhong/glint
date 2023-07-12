'use client';
import EventCard from '../EventCard/EventCard';
import UserInfo from '../UserInfo/UserInfo';

const EventResults = ({ events }: { events: Array<Event> }) => {
  return (
    <div className="flex flex-col gap-4">
      {events &&
        events.map((event, index) => (
          <EventCard event={event} key={crypto.randomUUID()}>
            <UserInfo userID={event.organizer} size={80} />
          </EventCard>
        ))}
    </div>
  );
};

export default EventResults;
