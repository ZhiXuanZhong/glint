'use client';
import db from '@/app/utils/firebaseConfig';
import { collection, getDocs, getFirestore, onSnapshot } from 'firebase/firestore';
import { Key, useEffect, useState } from 'react';
import EventCard from '@/components/EventCard/EventCard';
import ReviewForm from '@/components/ReviewForm/ReviewForm';
import { useImmer } from 'use-immer';

const Page = () => {
  const groupedEvents = {};
  const [events, setEvents] = useImmer<any | null>(null);
  const [filter, setFilter] = useState<any | null>('all');
  const [reviewing, setReviewing] = useState(false);
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';

  const eventsRef = collection(db, 'users', userID, 'events');

  const getInfo = async (eventID: string) => {
    const response = await fetch(`/api/event/${eventID}`, { next: { revalidate: 5 } });
    const data = await response.json();
    return data;
  };

  const groupedObjects = (events: PortalEvent[]) => {
    const groupedData = events.reduce((result, obj) => {
      const { type } = obj;

      if (!result[type]) {
        result[type] = [];
      }
      result[type].push(obj);

      return result;
    }, {} as Record<string, any[]>);
    return groupedData;
  };

  //處理動態classes內容
  const classNames = (...classes: any[]) => {
    return classes.filter(Boolean).join(' ');
  };

  const handleFilter = (condition: string) => {
    setFilter(condition);
  };

  // 處理用戶退出活動以state更新
  // 考量：
  // 1. 資源來看 更新local state不用fetch新資料 (目前選這個)
  // 2. 資料正確度 聽firebase更新可以確保資料最正確
  const updateWithdraw = (eventID: string) => {
    setEvents((draft: any) => {
      if (!draft.withdrawn) {
        draft.withdrawn = [];
      }
      draft.withdrawn.push(draft.joined.filter((event: { id: string }) => event.id === eventID)[0]);
      draft.joined = draft.joined.filter((event: { id: string }) => event.id !== eventID);
    });
  };

  useEffect(() => {
    // 取回user collection內所有活動清單
    const getEventList = async () => {
      const events: Event[] = [];
      const res = await getDocs(eventsRef);
      res.forEach((doc) => {
        const event = doc.data() as Event;
        event.id = doc.id;
        events.push(event);
      });
      return events;
    };

    // 依照取回活動分別請求活動詳情
    const getDetail = async (arr: Event[]) => {
      const updatedArr = await Promise.all(
        arr.map(async (obj) => {
          const updatedData = await getInfo(obj.id);
          return { ...obj, ...updatedData };
        })
      );
      return updatedArr;
    };

    //考慮把這一包包成一個api
    getEventList()
      .then((res) => getDetail(res))
      .then((data) => groupedObjects(data))
      .then((result) => Object.assign(groupedEvents, result))
      .then(() => setEvents(groupedEvents));
  }, []);

  return (
    <>
      {reviewing && <ReviewForm />}
      {/* 篩選按鈕 */}
      <div className="flex">
        <div
          className="m-2 p-2 bg-blue-200 cursor-pointer"
          onClick={() => {
            handleFilter('all');
          }}
        >
          所有活動
        </div>
        <div
          className="m-2 p-2 bg-blue-200 cursor-pointer"
          onClick={() => {
            handleFilter('favorite');
          }}
        >
          蒐藏
        </div>
        <div
          className="m-2 p-2 bg-blue-200 cursor-pointer"
          onClick={() => {
            handleFilter('hosted');
          }}
        >
          我發起的活動
        </div>
        <div
          className="m-2 p-2 bg-blue-200 cursor-pointer"
          onClick={() => {
            handleFilter('waitingReview');
          }}
        >
          等待評論
        </div>
      </div>

      {/* 用array去裝規則 */}
      {/* 像這樣 */}
      {/* {[{ type: 'joined', portal: true,},{ type: 'rejected', portal: false }].map((item) => <EventCard portal={item.portal}/>)} */}

      <h2 className={classNames(filter === 'all' ? null : 'hidden')}>目前的活動 - joined startTime&lt;Date.now()&lt;endTime </h2>
      <div className={classNames(filter === 'all' ? null : 'hidden')}>
        {events?.joined
          ?.filter((event: PortalEvent) => Date.now() > event.data.startTime && Date.now() < event.data.endTime)
          .map((event: PortalEvent, index: Key) => (
            <EventCard event={event.data} key={index} portal apply />
          ))}
      </div>

      <h2 className={classNames(filter === 'all' || filter === 'hosted' ? null : 'hidden')}>我發起的活動 - hosted</h2>
      <div className={classNames(filter === 'all' || filter === 'hosted' ? null : 'hidden')}>
        {events?.hosted?.map((event: PortalEvent, index: Key) => (
          <EventCard event={event.data} key={index} portal edit cancel />
        ))}
      </div>

      <h2 className={classNames(filter === 'all' ? null : 'hidden')}>即將展開的活動 - joined Date.now()&lt;startTime</h2>
      <div className={classNames(filter === 'all' ? null : 'hidden')}>
        {events?.joined
          ?.filter((event: PortalEvent) => Date.now() < event.data.startTime)
          .map((event: PortalEvent, index: Key) => (
            <EventCard event={event.data} key={index} portal withdraw updateWithdraw={updateWithdraw} />
          ))}
      </div>

      <h2 className={classNames(filter === 'all' || filter === 'waitingReview' ? null : 'hidden')}>已結束的活動 - joined Date.now()&gt;endTime </h2>
      <div className={classNames(filter === 'all' || filter === 'waitingReview' ? null : 'hidden')}>
        {filter !== 'waitingReview' &&
          events?.joined?.filter((event: PortalEvent) => Date.now() > event.data.endTime).map((event: PortalEvent, index: Key) => <EventCard event={event.data} key={index} portal review />)}
        {filter === 'waitingReview' &&
          events?.joined
            ?.filter((event: PortalEvent) => Date.now() > event.data.endTime && !event.hasReview)
            .map((event: PortalEvent, index: Key) => <EventCard event={event.data} key={index} portal review />)}
      </div>

      <h2 className={classNames(filter === 'all' ? null : 'hidden')}>等待確認 - pending</h2>
      <div className={classNames(filter === 'all' ? null : 'hidden')}>
        {events?.pending?.map((event: PortalEvent, index: Key) => (
          <EventCard event={event.data} key={index} portal apply />
        ))}
      </div>

      <h2 className={classNames(filter === 'all' || filter === 'favorite' ? null : 'hidden')}>蒐藏 - favorite</h2>
      <div className={classNames(filter === 'all' || filter === 'favorite' ? null : 'hidden')}>
        {events?.favorites?.map((event: PortalEvent, index: Key) => (
          <EventCard event={event.data} key={index} portal apply />
        ))}
      </div>

      <h2 className={classNames(filter === 'all' ? null : 'hidden')}>被拒絕 - rejected</h2>
      <div className={classNames(filter === 'all' ? null : 'hidden')}>
        {events?.rejected?.map((event: PortalEvent, index: Key) => (
          <EventCard event={event.data} key={index} />
        ))}
      </div>

      <h2 className={classNames(filter === 'all' ? null : 'hidden')}>活動取消 - canceled</h2>
      <div className={classNames(filter === 'all' ? null : 'hidden')}>
        {events?.canceled?.map((event: PortalEvent, index: Key) => (
          <EventCard event={event.data} key={index} />
        ))}
      </div>

      <h2 className={classNames(filter === 'all' ? null : 'hidden')}>已退出活動 - withdrawn</h2>
      <div className={classNames(filter === 'all' ? null : 'hidden')}>
        {events?.withdrawn?.map((event: PortalEvent, index: Key) => (
          <EventCard event={event.data} key={index} />
        ))}
      </div>
    </>
  );
};

export default Page;
