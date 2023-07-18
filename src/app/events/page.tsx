'use client';
import { useEffect, useState } from 'react';
import SearchEvents from '../../components/SearchEvents/SearchEvents';
import SortEvents from '../../components/SortEvents/SortEvents';
import EventResults from '../../components/EventResults/EventResults';
import { useSearchParams } from 'next/navigation';
import { useSearchEventsStore } from '@/store/searchEventsStore';
import { ScaleLoader } from 'react-spinners';

export const revalidate = 0;

export default function Page() {
  // const [events, setEvents] = useState<any | undefined>([]);
  const [events, addEvents, emptyEvents] = useSearchEventsStore((state: any) => [state.events, state.addEvents, state.emptyEvents]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();

  const queryParams = {
    locations: searchParams.get('locations'),
    category: searchParams.get('category'),
    startTime: Number(searchParams.get('startTime')),
    endTime: Number(searchParams.get('endTime')),
    organizerType: searchParams.get('organizerType'),
  };

  // const handleSort = (type: any) => {
  //   // setEvents([...events].sort((a, b) => a.startTime - b.startTime));
  //   console.log(type);
  //   switch (type) {
  //     case 'nerest':
  //       setEvents([...events].sort((a, b) => a.startTime - b.startTime));
  //       break;

  //     case 'latest':
  //       setEvents([...events].sort((a, b) => a.createdTime.seconds - b.createdTime.seconds));
  //       break;

  //     case 'rating':
  //       setEvents([...events].sort((a, b) => b.rating - a.rating));
  //       break;

  //     default:
  //       break;
  //   }
  // };

  const getEvents = async (query) => {
    const response = await fetch(`/api/get-events${query}`, { cache: 'no-cache' });
    return response.json();
  };

  useEffect(() => {
    const objString = '?' + new URLSearchParams(queryParams).toString();
    emptyEvents();
    setIsLoading(true);
    getEvents(objString).then((res) => {
      setIsLoading(false);
      addEvents(res.data);
      // console.log(res);
    });
  }, [searchParams]);

  return (
    <div className="mx-4 flex h-screen flex-col gap-5 p-10 md:mx-auto md:max-w-3xl lg:max-w-5xl">
      <div className="border shadow-md">
        <SearchEvents locations={queryParams.locations} category={queryParams.category} startTime={queryParams.startTime} endTime={queryParams.endTime} organizerType={queryParams.organizerType} />
      </div>
      {isLoading && (
        <div className="flex min-h-[300px] flex-col items-center justify-center text-lg tracking-wider text-sunrise-500">
          <ScaleLoader color="#ff690e" />
          <div>行程搜尋中</div>
        </div>
      )}
      {/* <SortEvents handleSort={handleSort} /> */}
      <EventResults events={events} />
    </div>
  );
}
