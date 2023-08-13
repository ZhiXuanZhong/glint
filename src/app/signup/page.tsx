'use client';

import { useRouter } from 'next/navigation';
import { RefObject, useRef, useState } from 'react';
import { BarLoader } from 'react-spinners';

import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import db, { app } from '../utils/firebaseConfig';

import { diveCertifications } from '@/data/diveLevels';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

const Page = () => {
  const router = useRouter();
  const auth = getAuth(app);
  const [isSending, setIsSending] = useState<Boolean>(false);
  const [avatar, setAvatar] = useState<Blob | null>(null);
  const [licenceImage, setLicenceImage] = useState<Blob | null>(null);
  const passwordRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const confirmPasswordRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  const addFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (file) {
      switch (e.target.name) {
        case 'licenceImage':
          setLicenceImage(file);
          break;
        case 'avatar':
          setAvatar(file);
          break;

        default:
          break;
      }
    }
  };

  const handleImageUpload = async (imageFile: Blob, path: string) => {
    const storage = getStorage();
    const pictureRef = ref(storage, path);
    const snapshot = await uploadBytes(pictureRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  };

  const isInstructor = (certification: string) => {
    return certification.includes('Instructor');
  };

  async function createProfiles(userID: string, profile: UsersProfile) {
    await setDoc(doc(db, 'profiles', userID), {
      username: profile.username,
      createdAt: serverTimestamp(),
      bio: profile.bio,
      avatarURL: profile.avatarURL,
      hasLicence: profile.hasLicence,
      location: profile.location,
      firstDive: profile.firstDive,
      level: profile.level,
      type: profile.type,
    });
  }

  const validatePasswords = () => {
    const password = passwordRef.current!.value;
    const confirmPassword = confirmPasswordRef.current!.value;

    if (password !== confirmPassword) {
      confirmPasswordRef.current!.setCustomValidity('兩次輸入的密碼不同');
    } else {
      confirmPasswordRef.current!.setCustomValidity('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    const formElement = e.target;
    const formData = new FormData(formElement);

    const [avatarURL, licenceImageURL] = await Promise.all([
      handleImageUpload(avatar!, 'profile-image/'),
      handleImageUpload(licenceImage!, 'licence-image/'),
    ]);

    try {
      const profile = {
        type: isInstructor(formData.get('level') as string) ? 'instructor' : 'diver',
        createdAt: serverTimestamp(),
        avatarURL: avatarURL,
        firstDive: '',
        location: formData.get('location'),
        hasLicence: true,
        username: formData.get('username'),
        bio: formData.get('bio'),
        level: formData.get('level'),
      };

      console.log(formData.get('email'), formData.get('confirmPassword'));

      createUserWithEmailAndPassword(auth, formData.get('email'), formData.get('confirmPassword'))
        .then((userCredential) => userCredential.user.uid)
        .then((user) => {
          createProfiles(user, profile);
          setDoc(doc(db, 'users', user, 'licence', 'info'), {
            imageURL: licenceImageURL,
            uploadTime: Date.now(),
          });
          router.replace(`/profile/${user}`);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="mx-4 flex flex-col gap-5 border-b py-10 text-3xl font-semibold md:mx-auto md:max-w-3xl md:p-3 lg:max-w-5xl">
        註冊
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-4 flex flex-col gap-3 py-10 md:mx-auto md:max-w-3xl md:p-3 lg:max-w-5xl"
      >
        <div className="mt-3 flex flex-col text-xl font-semibold">帳號資訊</div>
        <div className="flex flex-col border border-gray-100 p-3 shadow-md md:flex-row md:gap-3">
          <div className="mb-6 flex w-full flex-col md:mb-0">
            <label className="text-lg font-medium tracking-wide text-gray-500">Email帳號</label>
            <input
              type="email"
              className="w-full border px-4 py-2 md:max-w-[400px]"
              placeholder="email@glint.com"
              name="email"
              required
            />
          </div>

          <div className="mb-6 flex w-full flex-col md:mb-0">
            <label className="text-lg font-medium tracking-wide text-gray-500">密碼</label>
            <input
              type="password"
              className="w-full border px-4 py-2 md:max-w-[400px]"
              placeholder="輸入密碼"
              name="password"
              required
              minLength={6}
              ref={passwordRef}
            />
            <input
              type="password"
              className="mt-1 w-full border px-4 py-2 md:max-w-[400px]"
              placeholder="再次確認密碼"
              name="confirmPassword"
              required
              minLength={6}
              ref={confirmPasswordRef}
              onChange={validatePasswords}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-col text-xl font-semibold">潛水執照</div>
        <div className="flex flex-col gap-3 border border-gray-100 p-3 shadow-md md:flex-row">
          <div className="mb-6 flex w-full flex-col md:mb-0 md:w-1/2">
            <label className="text-lg font-medium tracking-wide text-gray-500">執照等級</label>
            <div className="relative">
              <select
                className="block w-full appearance-none rounded border border-gray-200 bg-gray-100 
            px-4 py-3 pr-8 leading-tight text-gray-700 focus:outline-none"
                name="level"
                required
              >
                {diveCertifications.map((type, index) => (
                  <option key={index} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-6 flex w-full flex-col md:mb-0 md:w-1/2">
            <label className="text-lg font-medium tracking-wide text-gray-500">執照圖片上傳</label>
            <input type="file" accept="image/*" onChange={addFile} name="licenceImage" required />
            {licenceImage && (
              <picture>
                <img alt="preview image" src={URL.createObjectURL(licenceImage)} className="w-96" />
              </picture>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-col text-xl font-semibold">個人資料</div>
        <div className="flex flex-col border border-gray-100 p-3 shadow-md">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="w-full md:w-1/2">
              <div className="mb-6 flex w-full flex-col md:mb-0">
                <label className="text-lg font-medium tracking-wide text-gray-500">顯示名稱</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 md:max-w-[400px]"
                  placeholder="20字以內"
                  name="username"
                  required
                  maxLength={20}
                />
              </div>

              <div className="mb-6 flex w-full flex-col md:mb-0">
                <label className="text-lg font-medium tracking-wide text-gray-500">常駐區域</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 md:max-w-[400px]"
                  placeholder="小琉球, 恆春 ..."
                  name="location"
                  required
                />
              </div>
            </div>
            <div className="mb-6 flex w-full flex-col md:mb-0 md:w-1/2">
              <label className="text-lg font-medium tracking-wide text-gray-500">個人頭像</label>
              <input type="file" accept="image/*" onChange={addFile} name="avatar" required />
              {avatar && (
                <picture>
                  <img alt="preview image" src={URL.createObjectURL(avatar)} className="w-96" />
                </picture>
              )}
            </div>
          </div>

          <div className="mb-6 flex w-full flex-col md:mb-0">
            <label className="text-lg font-medium tracking-wide text-gray-500">簡介</label>
            <textarea
              className="border p-4"
              name="bio"
              rows={5}
              placeholder="讓大家簡單認識你吧！"
              required
            />
          </div>
        </div>

        {isSending ? (
          <div className="mb-10 flex flex-col items-center gap-2 text-lg tracking-widest text-sunrise-500">
            <div>帳號建立中</div>
            <BarLoader color="#ff690e" />
          </div>
        ) : (
          <div className="mb-10 flex flex-col items-center gap-2">
            <div>
              <input type="checkbox" required />
              <label className="ml-2">我同意遵守《服務條款》中的條款和條件。</label>
            </div>
            <div>
              <button className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600">
                即刻註冊
              </button>
            </div>
          </div>
        )}
      </form>
    </>
  );
};

export default Page;
