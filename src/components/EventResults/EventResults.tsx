'use client';
import EventCard from '../EventCard/EventCard';

const EventResults = ({ events }: { events: Array<Event> }) => {
  return <div>{events && events.map((event, index) => <EventCard event={event} key={index} />)}</div>;
};

export default EventResults;
