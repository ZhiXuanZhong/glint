'use client';
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { redirect, useRouter } from 'next/navigation';

import db from '../utils/firebaseConfig';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { useAuthStore } from '@/store/authStore';
import { diveSites, eventTypes } from '@/data/searchOptions';
import startEndToTimecodes from '../utils/startEndToTimecodes';

const Page = () => {
  // 這邊想做讓用戶可以增加每天對應的地點，因為可能會跳島
  const [authUser] = useAuthStore((state) => [state.authUser]);
  const [authProfile] = useAuthStore((state) => [state.authProfile]);
  const [mainImage, setMainImage] = useState<any>(null);
  const router = useRouter();

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [dateRange, setDateRange] = useState<number[]>(startEndToTimecodes([new Date(), new Date()]));

  const datePickerOnChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    setStartDate(start);
    setEndDate(end);

    // Only update dateRange if end date is selected
    if (end) {
      setDateRange(startEndToTimecodes(dates));
    }
  };

  // 這邊的type非常雜亂，gpt的產出看不懂
  const addFile: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      // imageData.current = target.files[0];
      setMainImage(target.files[0]);
    }
  };

  // 得到id後與storage互動，用eventID來當檔名之後吐url回去
  const handleUpload = async (mainImage: Blob | Uint8Array | ArrayBuffer, eventID: string) => {
    const storage = getStorage();
    const pictureRef = ref(storage, `event-image/${eventID}`);

    return uploadBytes(pictureRef, mainImage)
      .then((snapshot) => snapshot.ref)
      .then((ref) => getDownloadURL(ref));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      // const mainImage = formData.get('mainImage');
      const newEventRef = doc(collection(db, 'events'));
      const imageURL = await handleUpload(mainImage, newEventRef.id);

      const eventData = {
        title: formData.get('title'),
        locations: [formData.get('location')],
        startTime: dateRange[0],
        endTime: dateRange[1],
        mainImage: imageURL,
        organizer: authUser,
        organizerType: authProfile?.type,
        organizerLevel: authProfile?.level,
        description: formData.get('detail'),
        levelSuggection: formData.get('levelSuggection'),
        category: formData.get('category'),
        createdTime: serverTimestamp(),
        status: 'waiting',
      };

      console.log(eventData);
      console.log(newEventRef.id);
      await setDoc(newEventRef, eventData);

      const defaultParticipantsRef = doc(collection(db, 'events', newEventRef.id, 'participants'), authUser);
      const defaultParticipant = {
        applyTime: serverTimestamp(),
        approvedTime: serverTimestamp(),
        level: authProfile?.level,
        name: authProfile?.username,
      };
      await setDoc(defaultParticipantsRef, defaultParticipant);

      // alert(`活動成功建立，這邊要再直接轉跳到新增的頁面 ${newEventRef.id}`);
      // setEventID(newEventRef.id);
      router.replace(`/details/${newEventRef.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!authUser) router.push('/login');
  }, []);

  return (
    <form onSubmit={handleSubmit} className="mx-4 flex flex-col gap-5 py-10 md:mx-auto md:max-w-3xl md:p-3 lg:max-w-5xl">
      <div className="mb-6 flex w-full flex-col md:mb-0">
        <label className="text-lg font-medium tracking-wide text-gray-500">活動名稱</label>
        <input type="text" className="w-full border px-4 py-2 md:max-w-[400px]" placeholder="想個吸睛的標題吧，至多20字" name="title" required maxLength={20} />
      </div>

      <div className="mb-6 flex w-full flex-col md:mb-0">
        <label className="text-lg font-medium tracking-wide text-gray-500">參與等級建議</label>
        <input type="text" className="w-full border px-4 py-2 md:max-w-[400px]" placeholder="請將對報名者的小提醒、要求寫在這邊，至多20字" name="levelSuggection" required maxLength={20} />
      </div>

      <div className="mb-6 flex w-full flex-col md:mb-0 md:w-[250px]">
        <label className="text-lg font-medium tracking-wide text-gray-500">活動類型</label>
        <div className="relative">
          <select className="block w-full appearance-none rounded border border-gray-200 bg-gray-100 px-4 py-3 pr-8 leading-tight text-gray-700 focus:outline-none" name="category" required>
            {eventTypes.map((type, index) => (
              <option key={index} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative mb-6 w-full md:mb-0 md:w-[250px]">
        <label className="text-lg font-medium tracking-wide text-gray-500">地點</label>
        <div className="relative">
          <select className="block w-full appearance-none rounded border border-gray-200 bg-gray-100 px-4 py-3 pr-8 leading-tight text-gray-700 focus:outline-none" name="location" required>
            {diveSites.map((site, index) => (
              <option key={index} value={site.value}>
                {site.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-6 w-full md:mb-0 md:w-[250px]">
        <label className="text-lg font-medium tracking-wide text-gray-500">出發區間</label>
        <ReactDatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={datePickerOnChange}
          minDate={new Date()}
          minTime={new Date(new Date().setHours(0, 0, 0, 0))}
          isClearable={false}
          wrapperClassName="SearchDatePicker"
          required
        />
      </div>

      <div className="mb-6 flex w-full flex-col md:mb-0 md:w-[250px]">
        <label className="text-lg font-medium tracking-wide text-gray-500">活動圖片上傳</label>
        <input type="file" accept="image/*" onChange={addFile} name="mainImage" required />
        {mainImage && (
          <picture>
            <img alt="preview image" src={URL.createObjectURL(mainImage)} className="w-96" />
          </picture>
        )}
      </div>

      <div className="mb-6 flex w-full flex-col md:mb-0">
        <label className="text-lg font-medium tracking-wide text-gray-500">活動詳情</label>
        <textarea className="border p-4" name="detail" rows={10} placeholder="請填入活動內容" required />
      </div>

      <div>
        <input type="checkbox" required />
        <label className="ml-2">我同意遵守《服務條款》中的條款和條件。</label>
      </div>

      <div>
        <button className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600">建立活動</button>
      </div>
    </form>
  );
};

export default Page;
