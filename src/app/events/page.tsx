'use client';
import { useEffect, useState } from 'react';
import SearchEvents from '../components/SearchEvents/SearchEvents';
import SortEvents from '../components/SortEvents/SortEvents';
import EventResults from '../components/EventResults/EventResults';

interface EventsData {
  data: Event[];
}

export default function Page() {
  const [events, setEvents] = useState<any | undefined>([]);

  const handleEventsUpdate = (data: any) => {
    setEvents(data);
  };

  const handleSort = (type: any) => {
    // setEvents([...events].sort((a, b) => a.startTime - b.startTime));
    console.log(type);
    switch (type) {
      case 'nerest':
        setEvents([...events].sort((a, b) => a.startTime - b.startTime));
        break;

      case 'latest':
        setEvents([...events].sort((a, b) => a.createdTime.seconds - b.createdTime.seconds));
        break;

      case 'rating':
        setEvents([...events].sort((a, b) => b.rating - a.rating));
        break;

      default:
        break;
    }
  };

  const getEvents = async () => {
    const response = await fetch('/api/get-events', { cache: 'no-store' });
    return response.json();
  };

  useEffect(() => {
    getEvents().then((res) => {
      setEvents(res.data);
      console.log(res);
    });
  }, []);

  return (
    <>
      <SearchEvents setEvents={handleEventsUpdate} />
      <SortEvents handleSort={handleSort} />
      <EventResults events={events} />
    </>
  );
}
