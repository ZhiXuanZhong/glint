'use client';

import { useEffect, useRef, useState } from 'react';
import db from '@/app/utils/firebaseConfig';
import { deleteField, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import formatDate from '@/app/utils/formatDate';
import InlineEdit from '@/components/InlineEdit/InlineEdit';
import fireMediaUpload from '@/app/utils/fireMediaUpload';
import UserInfo from '@/components/UserInfo/UserInfo';
import Image from 'next/image';
import { MdModeEdit } from 'react-icons/md';

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
    <div className="flex flex-col p-10 md:mx-auto md:max-w-3xl lg:max-w-5xl">
      <div className="mb-5 flex items-center gap-5 px-5">
        <div className="relative">
          <Image width={200} height={200} src={profile?.avatarURL} alt="avatar" className="h-48 w-48 rounded-full bg-slate-200 object-cover" />
          <div
            className="absolute bottom-0 right-4 w-fit cursor-pointer rounded-full border border-red-500 bg-sunrise-500 p-2 text-white transition-colors hover:bg-sunrise-400"
            onClick={() => {
              avatarRef.current?.click();
            }}
          >
            <MdModeEdit className="text-2xl" />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div>
            <div className=" mb-1 text-sm text-moonlight-900">顯示名稱</div>
            <InlineEdit value={profile} setValue={setProfile} field="username" fireCollection="profiles" userID={userID} type="text" />
          </div>
          <div>
            <div className=" mb-1 text-sm text-moonlight-900">常駐城市</div>
            <InlineEdit value={profile} setValue={setProfile} field="location" fireCollection="profiles" userID={userID} type="text" />
          </div>
        </div>
        {/* <div>
          {userID === params?.userID ? <div className="p-3 text-3xl text-moonlight-950">{profile?.username + '，歡迎回來'}</div> : <div className="p-3 text-3xl">{profile?.username + ' 的簡介'}</div>}
        </div> */}
      </div>

      {profile && (
        <div className="mb-5 border-t border-moonlight-100 p-5 ">
          <div className="mb-3 text-xl font-medium text-moonlight-950">簡介</div>

          <div className="flex flex-col">
            <div>
              <InlineEdit value={profile} setValue={setProfile} field="bio" fireCollection="profiles" userID={userID} type="textarea" />
            </div>
          </div>
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

      {licence && (
        <div className="mb-5 rounded border border-moonlight-200 p-5">
          <div className="mb-3 text-xl font-medium text-moonlight-950">潛水執照</div>
          <div className="flex flex-col gap-5">
            <div>
              <div className=" mb-1 text-sm text-moonlight-900">等級</div>
              <InlineEdit value={profile} setValue={setProfile} field="level" fireCollection="profiles" userID={userID} type={'select'} />
            </div>

            <div className="">
              <div className=" mb-1 text-sm text-moonlight-900">執照影像</div>
              <picture>
                <img src={licence?.imageURL} alt="licence" />
              </picture>
              <div>最近一次在{formatDate(licence?.uploadTime)}上傳的執照</div>
              <button
                className="m-1 rounded  bg-green-600 px-4 py-2 font-bold text-white"
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
                      className="m-1 rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
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

      <div className="mb-5 flex gap-5 rounded border border-moonlight-200 p-5">
        <div className="mb-3 text-xl font-medium text-moonlight-950">172 粉絲</div>
        <div className="mb-3 text-xl font-medium text-moonlight-950">82 關注中</div>
        <div className="mb-3 text-xl font-medium text-moonlight-950">9.2 分</div>
      </div>
    </div>
  );
};

export default Page;
