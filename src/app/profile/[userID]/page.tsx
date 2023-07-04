'use client';

import { useEffect, useRef, useState } from 'react';
import db from '@/app/utils/firebaseConfig';
import { deleteField, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import formatDate from '@/app/utils/formatDate';
import InlineEdit from '@/components/InlineEdit/InlineEdit';
import fireMediaUpload from '@/app/utils/fireMediaUpload';
import UserInfo from '@/components/UserInfo/UserInfo';

interface Licence {
  imageURL: string;
  uploadTime: number;
}

interface LicenceAuth {
  [key: string]: boolean;
}

const Page = ({ params }: { params: { userID: string } }) => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';

  const avatarRef = useRef<HTMLInputElement>(null);
  const inputImageRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<UsersProfile | null>(null);
  const [authProfiles, setAuthProfiles] = useState<UsersProfile[] | null>(null);
  const [userInfo, setUserInfo] = useState<UsersInfo>();
  const [licence, setLicence] = useState<Licence>();
  const [licenceAuthList, setLicenceAuthList] = useState<LicenceAuth>();

  const [inputImage, setInputImage] = useState<File | null>(null);
  const [avatarImage, setAvatarImage] = useState<File | null>(null);

  const getProfile = async (userID: string) => {
    const response = await fetch(`/api/profile/${userID}`, { next: { revalidate: 30 } });
    return response.json();
  };

  const fetchProfiles = async () => {
    const profiles = [];

    for (const userID in licenceAuthList) {
      const profile = await getProfile(userID);
      profiles.push({ ...profile[userID], id: userID });
    }
    setAuthProfiles(profiles);
  };

  const addFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (target.files && target.files[0]) {
      setInputImage(target.files[0]);
    }
  };

  const sendImage = async () => {
    if (inputImage) {
      try {
        // 先以 `${userID}_${Date.now()}}` 當檔名建立url
        // 再回到上層取用發訊息的function
        // 再清空inputImage讓UI隱藏
        const fileURL = await fireMediaUpload(inputImage, 'licence-image', `${userID}_${Date.now()}`);
        const updateLicenceRef = doc(db, 'users', userID, 'licence', 'info');
        await updateDoc(updateLicenceRef, {
          imageURL: fileURL,
          uploadTime: Date.now(),
        });
        setInputImage(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // FIXME 兩份重複的function，為了新增avatar <= 用左邊的comment搜尋有哪些 1/3
  const addAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (target.files && target.files[0]) {
      setAvatarImage(target.files[0]);
    }
  };
  // FIXME 兩份重複的function，為了新增avatar <= 用左邊的comment搜尋有哪些 2/3
  const sendAvatarImage = async () => {
    if (avatarImage) {
      try {
        // 先以 `${userID}_${Date.now()}}` 當檔名建立url
        // 再回到上層取用發訊息的function
        // 再清空inputImage讓UI隱藏
        const fileURL = await fireMediaUpload(avatarImage, 'profile-image', `${userID}_${Date.now()}`);
        const updateAvatarRef = doc(db, 'profiles', userID);
        await updateDoc(updateAvatarRef, {
          avatarURL: fileURL,
        });
        setAvatarImage(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const removeCurrentUserId = async (targetID) => {
    const licenceRef = doc(db, 'users', userID, 'licence', 'authorizedAccounts');
    await updateDoc(licenceRef, {
      [targetID]: deleteField(),
    });
    console.log('deleted ' + userID);
  };

  useEffect(() => {
    sendImage();
  }, [inputImage]);

  // FIXME 兩份重複的function，為了新增avatar <= 用左邊的comment搜尋有哪些 3/3
  useEffect(() => {
    sendAvatarImage();
  }, [avatarImage]);

  useEffect(() => {
    fetchProfiles();
  }, [licenceAuthList]);

  useEffect(() => {
    // 這邊不從api取出來資料，直接跟firebase互動，取得最新版本

    const profileRef = doc(db, 'profiles', userID);
    const profileUnsub = onSnapshot(profileRef, (doc) => {
      setProfile(doc.data() as UsersProfile);
    });

    if (userID === params.userID) {
      const userInfoRef = doc(db, 'users', userID);
      const infoUnsub = onSnapshot(userInfoRef, (doc) => {
        setUserInfo(doc.data() as UsersInfo);
      });

      const licenceRef = doc(db, 'users', userID, 'licence', 'info');
      const licenceUnsub = onSnapshot(licenceRef, (doc) => {
        setLicence(doc.data() as Licence);
      });

      const licenceAuthRef = doc(db, 'users', userID, 'licence', 'authorizedAccounts');
      const licenceAuthUnsub = onSnapshot(licenceAuthRef, (doc) => {
        setLicenceAuthList(doc.data() as LicenceAuth);
      });
    }
  }, []);

  return (
    <div className="p-16">
      {userID === params?.userID ? <div className="text-3xl p-3">{profile?.username + '，歡迎回來'}</div> : <div className="text-3xl p-3">{profile?.username + ' 的簡介'}</div>}

      {profile && (
        <div className="p-12 m-2 bg-slate-300">
          <div>基本資料</div>
          <div className="m-5">
            <div>你的顯示名稱</div>
            <InlineEdit value={profile} setValue={setProfile} field="username" fireCollection="profiles" userID={userID} type="text" />
            <div>潛水經驗 [從...開始潛水]</div>
            <InlineEdit value={profile} setValue={setProfile} field="firstDive" fireCollection="profiles" userID={userID} type="text" />
            <div>常駐城市</div>
            <InlineEdit value={profile} setValue={setProfile} field="location" fireCollection="profiles" userID={userID} type="text" />
            <div>簡介 WIP</div>
            <InlineEdit value={profile} setValue={setProfile} field="bio" fireCollection="profiles" userID={userID} type="textarea" />
          </div>
          <picture>
            <img src={profile?.avatarURL} alt="avatar" />
          </picture>

          <button
            className="m-1 bg-green-600  text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              avatarRef.current?.click();
            }}
          >
            上傳更新
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={avatarRef}
            onChange={addAvatarFile}
            onClick={(event) => {
              (event.target as HTMLInputElement).value = '';
            }}
          />
        </div>
      )}

      {userInfo && (
        <div className="p-12 m-2 bg-slate-300">
          <div>帳號資訊</div>
          <div className="m-5">
            <div>真實姓名</div>
            <InlineEdit value={userInfo} setValue={setUserInfo} field="name" fireCollection="users" userID={userID} type="text" />
            <div>生日</div>
            <InlineEdit value={userInfo} setValue={setUserInfo} field="birthday" fireCollection="users" userID={userID} type="text" />
          </div>
        </div>
      )}

      {licence && (
        <div className="p-12 m-2 bg-slate-300">
          <div>潛水執照</div>
          <div>
            <div className="m-5">
              <div>等級 WIP</div>
              <InlineEdit value={profile} setValue={setProfile} field="level" fireCollection="profiles" userID={userID} type={'select'} />
            </div>

            <div className="m-5">
              <picture>
                <img src={licence?.imageURL} alt="licence" />
              </picture>
              <div>最近一次在{formatDate(licence?.uploadTime)}上傳的執照</div>
              <button
                className="m-1 bg-green-600  text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  inputImageRef.current?.click();
                }}
              >
                上傳更新
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={inputImageRef}
                onChange={addFile}
                onClick={(event) => {
                  (event.target as HTMLInputElement).value = '';
                }}
              />
            </div>
          </div>
          <div className="m-5 bg-slate-200">
            <div>已授權存取執照</div>
            {authProfiles?.map((profile, index) => {
              return (
                <div key={index}>
                  <UserInfo imageURL={profile.avatarURL} name={profile.username} level={profile.level} licence={profile.hasLicence}>
                    <button
                      className="m-1 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => {
                        removeCurrentUserId(profile.id);
                      }}
                    >
                      移除權限
                    </button>
                  </UserInfo>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
