'use client';
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import db from '../utils/firebaseConfig';

const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';

interface LocationDate {
  location: string;
  date: string;
}

const Page = () => {
  // 這邊想做讓用戶可以增加每天對應的地點，因為可能會跳島
  const [locationDate, setLocationDate] = useState<LocationDate[]>([{ location: '', date: '' }]);
  const [mainImage, setMainImage] = useState<any>(null);
  const [profile, setProfile] = useState<UsersProfile>();

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
        startTime: Date.parse(`${formData.get('startTime')}T00:00:00.000Z`),
        endTime: Date.parse(`${formData.get('endTime')}T23:59:59.999Z`),
        mainImage: imageURL,
        organizer: userID,
        organizerType: profile ? profile.type : null,
        organizerLevel: profile ? profile.level : null,
        description: formData.get('detail'),
        levelSuggection: formData.get('levelSuggection'),
        category: formData.get('category'),
        createdTime: serverTimestamp(),
        status: 'waiting',
      };

      console.log(eventData);
      console.log(newEventRef.id);

      await setDoc(newEventRef, eventData);
      alert(`活動成功建立，這邊要再直接轉跳到新增的頁面 ${newEventRef.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetch(`/api/profile/${userID}`)
      .then((res) => res.json())
      .then((data) => setProfile(data[userID]));
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      {/* 活動名稱 */}
      <div>活動名稱</div>
      <input type="text" className="border" name="title" />
      {/* 活動地點 + 時間 */}
      <div>活動地點及時間</div>
      {locationDate.map((fields, index) => (
        <div key={index}>
          <label>
            地點
            <select className="border m-1" name="location">
              <option value="NEC">東北角</option>
              <option value="XL">小琉球</option>
              <option value="KT">墾丁</option>
              <option value="GI">綠島</option>
              <option value="PH">澎湖</option>
              <option value="LY">蘭嶼</option>
            </select>
          </label>
          <label>
            開始時間
            <input className="border m-1" type="date" name="startTime" />
          </label>
          <label>
            結束時間
            <input className="border m-1" type="date" name="endTime" />
          </label>
        </div>
      ))}
      {/* 活動類型 */}
      <div>活動類型</div>
      <select className="border" name="category">
        <option value="divingTravel">潛旅</option>
        <option value="training">訓練</option>
        <option value="certificationTraining">證照課程</option>
        <option value="diverWanted">找潛伴</option>
        <option value="instructorWanted">找教練</option>
      </select>
      {/* 參與等級建議 */}
      <div>參與等級建議</div>
      <input type="text" className="border" name="levelSuggection" />
      {/* 活動圖片 */}
      <div>活動圖片上傳</div>
      <input type="file" onChange={addFile} name="mainImage" />
      {mainImage && (
        <picture>
          <img alt="preview image" src={URL.createObjectURL(mainImage)} className="w-96" />
        </picture>
      )}
      {/* 活動詳情 */}
      <div>活動詳情</div>
      <textarea className="border" name="detail" />
      <label className="block">
        <input type="checkbox" required />
        By signing up for our service, I agree to abide by the following terms and conditions available at Terms of Service.
      </label>
      <div>
        <button className=" px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-md">建立活動</button>
      </div>
    </form>
  );
};

export default Page;
