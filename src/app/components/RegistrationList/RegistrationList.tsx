'use client';
import RevokeButton from '@/app/components/RevokeButton/RevokeButton';
import { Key, useEffect, useState } from 'react';
import firebaseConfig from '@/app/utils/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';

interface Applicants {
  level: string;
  name: string;
  applyTime: number[];
  id: string;
}

interface Participants {
  level: string;
  name: string;
  id: string;
}

interface Profiles {
  [key: string]: UsersProfile;
}

interface UsersProfile {
  createdAt: { seconds: number; nanoseconds: number };
  avatarURL: string;
  firstDive: number;
  location: string;
  hasLicence: boolean;
  username: string;
  bio: string;
  level: string;
  id: string;
}

interface RegList {
  applicants: Applicants[];
  participants: Participants[];
}

const RegistrationList = ({ eventID }: { eventID: string }) => {
  const [regList, setRegList] = useState<RegList>();
  const [profiles, setProfiles] = useState<Profiles>();

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  //   取回所有報名清單
  const getRegistrations = async () => {
    const applicantsRef = collection(db, 'events', eventID, 'applicants');
    const participantsRef = collection(db, 'events', eventID, 'participants');

    const [applicantsSnap, participantsSnap] = await Promise.all([getDocs(applicantsRef), getDocs(participantsRef)]);

    const applicants = applicantsSnap.docs.map((doc) => {
      const user = doc.data() as Applicants;
      user.id = doc.id;
      return user;
    });

    const participants = participantsSnap.docs.map((doc) => {
      const user = doc.data() as Participants;
      user.id = doc.id;
      return user;
    });

    return { applicants, participants };
  };

  // 以userID取得profile資料

  const getProfile = async (userID: string) => {
    const response = await fetch(`/api/profile/${userID}`, { next: { revalidate: 30 } });
    return response.json();
  };

  const getProfiles = async (data: { applicants: Applicants[]; participants: Participants[] }) => {
    const profiles = {};
    const allParticipants = [...data.applicants, ...data.participants];

    for (const person of allParticipants) {
      const profile = await getProfile(person.id);
      Object.assign(profiles, profile);
    }

    return profiles;
  };

  useEffect(() => {
    const initData = async () => {
      const members = await getRegistrations();
      setRegList(members);

      const profiles = await getProfiles(members);
      setProfiles(profiles);
    };

    initData();
  }, []);

  // 更新state資料的typescript寫法參考
  // 1. 做出要更新的部分
  // 2. 把原始的資料結構複製出來，只更動步驟1的資料
  // 這樣可以確保資料結構都一樣，typesctipt就不會跳錯了
  // 原先長這樣
  //   const handleRevoke = (id: string) => {
  //     setRegList((prev) => {
  //       const newList = { ...prev };
  //       if(newList.participants){
  //         const updatedParticipants = newList.participants.filter((person) => person.id !== id);
  //           return { ...prev, participants: updatedParticipants }
  //       }
  //       return prev;
  //     });
  //   };

  const handleRevoke = (id: string) => {
    setRegList((prev) => {
      if (prev && prev.participants) {
        const updatedParticipants = prev.participants.filter((person) => person.id !== id);
        return { ...prev, participants: updatedParticipants };
      }
      return prev;
    });
  };

  return (
    <>
      {/* FIXME: 確認profiles都回來才把清單內容產生，這樣卡卡的 */}
      <h2 className="font-bold text-xl">已加入活動</h2>
      {profiles &&
        regList?.participants.map((participant: { name: string; level: string; id: string }, index: Key) => (
          <div key={index} className="shadow-md m-3 rounded-lg bg-gray-50">
            <picture>{<img src={profiles[participant.id as any].avatarURL} alt="Avatar" />}</picture>
            <div>{participant.name}</div>
            <div>{participant.level}</div>
            <RevokeButton userID={participant.id} eventID={eventID} handleRevoke={handleRevoke} />
          </div>
        ))}

      <h2 className="font-bold text-xl">等待清單</h2>
      {profiles &&
        regList?.applicants.map((applicant: { name: string; level: string; id: string }, index: Key) => (
          <div key={index} className="shadow-md m-3 rounded-lg bg-gray-50">
            <picture>{<img src={profiles[applicant.id as any].avatarURL} alt="Avatar" />}</picture>
            <div>{applicant.name}</div>
            <div>{applicant.level}</div>
            <button className="m-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">接受加入</button>
            <button className="m-1 bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">拒絕加入</button>
          </div>
        ))}
    </>
  );
};

export default RegistrationList;
