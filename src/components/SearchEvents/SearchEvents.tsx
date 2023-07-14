'use client';

import { useRouter } from 'next/navigation';
import { timeToHTMLInput } from '@/app/utils/formatDate';

const SearchEvents = () => {
  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const form = e.currentTarget;
    const { location, category, startTime, endTime, organizerType } = form.elements;
    const params = {
      locations: String(location.value),
      category: String(category.value),
      startTime: String(Date.parse(startTime.value)),
      endTime: String(Date.parse(endTime.value)),
      organizerType: String(organizerType.value),
    };

    router.push(`/events?${new URLSearchParams(params)}`);
  };

  return (
    <div className="min-h-[60px]">
      <form action="/" method="get" name="query" onSubmit={handleSubmit}>
        <div className="flex flex-wrap p-2">
          <div className="flex p-2">
            <h2>地點</h2>
            <select id="location" className="pb-1 text-center">
              <option value="NEC">東北角</option>
              <option value="XL">小琉球</option>
              <option value="KT">墾丁</option>
              <option value="GI">綠島</option>
              <option value="PH">澎湖</option>
              <option value="LY">蘭嶼</option>
            </select>
          </div>

          <div className="flex p-2">
            <h2>類型</h2>
            <select name="category" className="pb-1 text-center">
              <option value="divingTravel">潛旅</option>
              <option value="training">訓練</option>
              <option value="certificationTraining">證照課程</option>
              <option value="diverWanted">找潛伴</option>
              <option value="instructorWanted">找教練</option>
            </select>
          </div>

          <div className="flex p-2">
            <h2>出發區間：</h2>
            <input type="date" name="startTime" required min={timeToHTMLInput(Date.now())} defaultValue={timeToHTMLInput(Date.now())} className="" />
          </div>

          <div className="flex p-2">
            <h2>至</h2>
            <input type="date" name="endTime" required defaultValue={timeToHTMLInput(Date.now())} className="" />
          </div>

          <div className="flex p-2">
            <h2>發起人</h2>
            <select name="organizerType" className="pb-1 text-center">
              <option value="instructor">教練</option>
              <option value="diver">一般潛水員</option>
            </select>
          </div>
          <button className="grow rounded bg-sunrise-500 px-4 py-2 font-bold text-white hover:bg-sunrise-400" type="submit">
            GO
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchEvents;
