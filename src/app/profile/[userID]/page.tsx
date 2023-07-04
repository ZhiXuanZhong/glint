'use client';

import { useEffect, useState } from 'react';
import db from '@/app/utils/firebaseConfig';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import formatDate from '@/app/utils/formatDate';
import InlineEdit from '@/components/InlineEdit/InlineEdit';
import { useImmer } from 'use-immer';

interface License {
  imageURL: string;
  uploadTime: number;
}

const Page = ({ params }: { params: { userID: string } }) => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';

  const [profile, setprofile] = useImmer<UsersProfile | null>(null);
  const [userInfo, setUserInfo] = useState<UsersInfo>();
  const [license, setLicense] = useState<License>();

  useEffect(() => {
    // 這邊不從api取出來資料，直接跟firebase互動，取得最新版本

    const profileRef = doc(db, 'profiles', userID);
    const profileUnsub = onSnapshot(profileRef, (doc) => {
      setprofile(doc.data() as UsersProfile);
    });

    if (userID === params.userID) {
      const userInfoRef = doc(db, 'users', userID);
      const infoUnsub = onSnapshot(userInfoRef, (doc) => {
        setUserInfo(doc.data() as UsersInfo);
      });

      const licenseRef = doc(db, 'users', userID, 'licence', 'info');
      const licenseUnsub = onSnapshot(licenseRef, (doc) => {
        setLicense(doc.data() as License);
      });
    }
  }, []);

  return (
    <div className="p-16">
      {userID === params?.userID ? <div className="text-3xl p-3">{profile?.username + '，歡迎回來'}</div> : <div className="text-3xl p-3">{profile?.username + ' 的簡介'}</div>}

      {profile && (
        <div className="p-12 m-2 bg-slate-300">
          <div>基本資料</div>
          <div>
            <div>你的顯示名稱</div>
            <InlineEdit value={profile} setValue={setprofile} field={'username'} />
            <div>潛水經驗 [從...開始潛水]</div>
            <input value={profile?.firstDive} />
            <div>常駐城市</div>
            <input value={profile?.location} />
            <div>簡介</div>
            <textarea value={profile?.bio} />
          </div>
          <div className="m-2">
            是否公開潛水行程 Toggle <input type="checkbox"></input>
          </div>
        </div>
      )}

      {userInfo && (
        <div className="p-12 m-2 bg-slate-300">
          <div>帳號資訊</div>
          <div>
            <div>真實姓名</div>
            <input value={userInfo?.name} />
            <div>生日</div>
            <input value={formatDate(userInfo?.birthday)} />
          </div>
        </div>
      )}

      {license && (
        <div className="p-12 m-2 bg-slate-300">
          <div>潛水執照</div>
          <div>
            <div>等級</div>
            <select value={profile?.level}>
              <option value="SSI Basic / Pool">SSI Basic / Pool</option>
              <option value="SSI Level 1">SSI Level 1</option>
              <option value="SSI Level 2">SSI Level 2</option>
              <option value="SSI Level 3">SSI Level 3</option>
              <option value="SSI Instructor">SSI Instructor</option>
              <option value="AIDA 1">AIDA 1</option>
              <option value="AIDA 2">AIDA 2</option>
              <option value="AIDA 3">AIDA 3</option>
              <option value="AIDA 4">AIDA 4</option>
              <option value="AIDA Instructor">AIDA Instructor</option>
              <option value="PADI Basic Freediver">PADI Basic Freediver</option>
              <option value="PADI Freediver">PADI Freediver</option>
              <option value="PADI Advanced Freediver">PADI Advanced Freediver</option>
              <option value="PADI Master Freediver">PADI Master Freediver</option>
              <option value="PADI Instructor">PADI Instructor</option>
            </select>

            <picture>
              <img src={license?.imageURL} alt="lic" />
            </picture>
            <div>最近一次在{formatDate(license?.uploadTime)}上傳的執照</div>

            <div>執照影像上傳</div>
            <input type="file" />
          </div>
          <div className=" bg-slate-200">
            <div>已授權存取執照</div>
            <div>
              <span>user1</span>
              <button className="m-1 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">移除權限</button>
            </div>
            <div>
              <span>user2</span>
              <button className="m-1 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">移除權限</button>
            </div>
            <div>
              <span>user3</span>
              <button className="m-1 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">移除權限</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
