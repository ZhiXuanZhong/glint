'use client';
import Link from 'next/link';
import EventCard from '../EventCard/EventCard';

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

const EventResults = ({ events }: { events: Array<Event> }) => {
  return <div>{events && events.map((event, index) => <EventCard event={event} key={index} />)}</div>;
};

export default EventResults;
