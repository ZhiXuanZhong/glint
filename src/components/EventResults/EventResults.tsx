'use client';
import EventCard from '../EventCard/EventCard';

const EventResults = ({ events }: { events: Array<Event> }) => {
  return <div className="flex flex-col gap-4">{events && events.map((event, index) => <EventCard event={event} key={crypto.randomUUID()} />)}</div>;
};

export default EventResults;
