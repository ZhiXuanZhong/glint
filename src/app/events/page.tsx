import { Key } from 'react';

interface Event {
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

export default async function Events() {
  async function getAPI() {
    const res = await fetch('http://localhost:3000/api/get-events', { cache: 'no-store' });
    return res.json();
  }
  const events = await getAPI();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('zh');
    return formattedDate;
  };

  return (
    <>
      <div>
        <form action="">
          <div className="bg-gray-300 p-2 flex">
            <div className="flex p-2">
              <h2>地點</h2>
              <select>
                <option value="XL">小琉球</option>
                <option value="KT">墾丁</option>
                <option value="NEC">東北角</option>
                <option value="GI">綠島</option>
                <option value="PH">澎湖</option>
                <option value="LY">蘭嶼</option>
              </select>
            </div>

            <div className="flex bg-gray-300 p-2">
              <h2>類型</h2>
              <select>
                <option value="divingTravel">潛旅</option>
                <option value="training">訓練</option>
                <option value="certificationTraining">證照課程</option>
                <option value="diverWanted">找潛伴</option>
                <option value="instructorWanted">找教練</option>
              </select>
            </div>

            <div className="flex bg-gray-300 p-2">
              <h2>開始時間</h2>
              <input type="date" />
            </div>

            <div className="flex bg-gray-300 p-2">
              <h2>結束時間</h2>
              <input type="date" />
            </div>

            <div className="flex bg-gray-300 p-2">
              <h2>發起人</h2>
              <select>
                <option value="diver">一般潛水員</option>
                <option value="training">教練</option>
              </select>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
              Hit me baby one more time♥️
            </button>
          </div>
        </form>
      </div>
      <div>
        <div>
          {events.data &&
            events.data.map((event: Event, index: number) => (
              <div key={index} className="shadow-md m-6 rounded-lg bg-gray-50">
                <h1>{event.title}</h1>
                <div>
                  {formatDate(event.startTime)} - {formatDate(event.endTime)}
                </div>
                <p>{event.levelSuggection}</p>
                <div>{event.category}</div>
                {event.locations?.map((location: string, index: Key) => (
                  <span key={index}>{location} </span>
                ))}
                <div>{event.organizerType}</div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
