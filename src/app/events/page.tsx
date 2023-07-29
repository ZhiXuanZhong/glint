'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSearchEventsStore } from '@/store/searchEventsStore';

import SearchEvents from '../../components/SearchEvents/SearchEvents';
import EventResults from '../../components/EventResults/EventResults';
import { ScaleLoader } from 'react-spinners';
import { GiDoubleFish } from 'react-icons/gi';

export const revalidate = 0;

export default function Page() {
  const [events, addEvents, emptyEvents] = useSearchEventsStore((state: any) => [
    state.events,
    state.addEvents,
    state.emptyEvents,
  ]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const queryParams = {
    locations: searchParams.get('locations'),
    category: searchParams.get('category'),
    startTime: Number(searchParams.get('startTime')),
    endTime: Number(searchParams.get('endTime')),
    organizerType: searchParams.get('organizerType'),
  };

  const getEvents = async (query) => {
    const response = await fetch(`/api/get-events${query}`, { cache: 'no-cache' });
    return response.json();
  };

  useEffect(() => {
    const objString = '?' + new URLSearchParams(queryParams).toString();
    emptyEvents();
    setIsLoading(true);
    getEvents(objString).then((res) => {
      addEvents(res.data);
      setIsLoading(false);
      // console.log(res);
    });
  }, [searchParams]);

  return (
    <div className="mx-4 flex flex-col gap-5 p-10 md:mx-auto md:max-w-3xl lg:max-w-5xl">
      <div className="border shadow-md">
        <SearchEvents
          locations={queryParams.locations}
          category={queryParams.category}
          startTime={queryParams.startTime}
          endTime={queryParams.endTime}
          organizerType={queryParams.organizerType}
        />
      </div>
      {isLoading && (
        <div className="flex min-h-[300px] flex-col items-center justify-center text-lg tracking-wider text-sunrise-500">
          <ScaleLoader color="#ff690e" />
          <div>行程搜尋中</div>
        </div>
      )}

      {!isLoading && !events.length ? (
        <div className="flex flex-col items-center gap-5 py-5">
          <GiDoubleFish className="text-7xl text-gray-500" />
          <div className="text-center text-lg tracking-wider text-gray-500">
            哎呀！剛好沒有相關結果，先到
            <span className="px-3 text-sunrise-500">
              <Link href={'/events'}>所有活動</Link>
            </span>
            看看？
          </div>
        </div>
      ) : (
        <EventResults events={events} />
      )}
    </div>
  );
}
