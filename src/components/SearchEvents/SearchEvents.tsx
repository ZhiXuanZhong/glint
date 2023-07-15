'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { timeToHyphenYMD } from '@/app/utils/formatDate';
import startEndToTimecodes from '@/app/utils/startEndToTimecodes';

const SearchEvents = ({ locations, category, startTime, endTime, organizerType }: QueryParams) => {
  const router = useRouter();

  const defaultStartDate = new Date();
  const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);

  const defaultLocations = locations ? locations : 'NEC';
  const defaultCategory = category ? category : 'divingTravel';
  const defaultOrganizerType = organizerType ? organizerType : 'instructor';

  const [startDate, setStartDate] = useState<Date>(startTime ? new Date(startTime) : defaultStartDate);
  const [endDate, setEndDate] = useState(endTime ? new Date(endTime) : lastDayOfYear);
  const [dateRange, setDateRange] = useState<number[]>(startEndToTimecodes([new Date(), lastDayOfYear]));

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const form = e.currentTarget;
    const { location, category, organizerType } = form.elements;
    const params = {
      locations: String(location.value),
      category: String(category.value),
      startTime: String(dateRange[0]),
      endTime: String(dateRange[1]),
      organizerType: String(organizerType.value),
    };

    router.push(`/events?${new URLSearchParams(params)}`);
  };

  const datePickerOnChange = (dates: Date[]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    // 有點選結束時間才取dateRange
    if (end) {
      setDateRange(startEndToTimecodes(dates));
    }
  };

  return (
    <div className="min-h-[60px] py-3">
      <form action="/" method="get" name="query" onSubmit={handleSubmit}>
        <div className="flex flex-wrap justify-center">
          <div className="mb-6 w-full px-3 md:mb-0 md:w-2/12">
            <label className="mb-2 block font-semibold tracking-wide text-gray-500">地點</label>
            <div className="relative">
              <select
                defaultValue={defaultLocations}
                name="location"
                className="block w-full appearance-none rounded border border-gray-200 bg-gray-100 px-4 py-3 pr-8 leading-tight text-gray-700 focus:outline-none"
              >
                <option value="NEC">東北角</option>
                <option value="XL">小琉球</option>
                <option value="KT">墾丁</option>
                <option value="GI">綠島</option>
                <option value="PH">澎湖</option>
                <option value="LY">蘭嶼</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-6 w-full px-3 md:mb-0 md:w-2/12">
            <label className="mb-2 block font-semibold tracking-wide text-gray-500">類型</label>
            <div className="relative">
              <select
                defaultValue={defaultCategory}
                name="category"
                className="block w-full appearance-none rounded border border-gray-200 bg-gray-100 px-4 py-3 pr-8 leading-tight text-gray-700 focus:outline-none"
              >
                <option value="divingTravel">潛旅</option>
                <option value="training">訓練</option>
                <option value="certificationTraining">證照課程</option>
                <option value="diverWanted">找潛伴</option>
                <option value="instructorWanted">找教練</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-6 w-full px-3 md:mb-0 md:w-[250px]">
            <label className="mb-2 block font-semibold tracking-wide text-gray-500">出發區間</label>
            <ReactDatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={datePickerOnChange}
              minDate={new Date()}
              minTime={new Date(new Date().setHours(0, 0, 0, 0))}
              isClearable={false}
              wrapperClassName="SearchDatePicker"
            />
          </div>

          <div className="mb-6 w-full px-3 md:mb-0 md:w-2/12">
            <label className="mb-2 block font-semibold tracking-wide text-gray-500">發起人</label>
            <div className="relative">
              <select
                defaultValue={defaultOrganizerType}
                name="organizerType"
                className="block w-full appearance-none rounded border border-gray-200 bg-gray-100 px-4 py-3 pr-8 leading-tight text-gray-700 focus:outline-none"
              >
                <option value="instructor">教練</option>
                <option value="diver">一般潛水員</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-6 flex w-full grow items-end px-3 md:mb-0 md:w-fit">
            <button className="w-full rounded bg-sunrise-500 px-6 py-3 font-bold text-white hover:bg-sunrise-400" type="submit">
              GO
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchEvents;
