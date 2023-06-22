'use client';
import { useEffect, useState } from 'react';
import SearchEvents from '../components/SearchEvents/SearchEvents';
import EventResults from '../components/EventResults/EventResults';

interface EventsData {
  data: Event[];
}

export default function Events() {
  const [events, setEvents] = useState<EventsData | undefined>();

  const handleEventsUpdate = (data: EventsData) => {
    setEvents(data);
  };

  const fetchData = async () => {
    const response = await fetch('http://localhost:3000/api/get-events', { cache: 'no-store' });
    return response.json();
  };

  useEffect(() => {
    fetchData().then((res) => setEvents(res.data));
  }, []);

  return (
    <>
      <SearchEvents setEvents={handleEventsUpdate} />
      <EventResults events={events} />
    </>
  );
}
