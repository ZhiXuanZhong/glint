'use client';
import { useEffect, useState } from 'react';
import SearchEvents from '../components/SearchEvents/SearchEvents';
import FilterEvents from '../components/FilterEvents/FilterEvents';
import EventResults from '../components/EventResults/EventResults';

interface EventsData {
  data: Event[];
}

export default function Events() {
  const [events, setEvents] = useState<any | undefined>();

  const handleEventsUpdate = (data: any) => {
    setEvents(data);
  };

  const fetchData = async () => {
    const response = await fetch('/api/get-events', { cache: 'no-store' });
    return response.json();
  };

  useEffect(() => {
    fetchData().then((res) => setEvents(res.data));
  }, []);

  return (
    <>
      <SearchEvents setEvents={handleEventsUpdate} />
      <FilterEvents />
      <EventResults events={events} />
    </>
  );
}
