'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, query } from 'firebase/firestore';
import db from '@/app/utils/firebaseConfig';

import ConfirmButton from '@/components/ConfirmButton/ConfirmButton';
import RevokeButton from '@/components/RevokeButton/RevokeButton';
import UserInfo from '@/components/UserInfo/UserInfo';

// 這份檔案還只有整理到import排序而已 之後要接著做帳號 等其他整理

const RegistrationList = ({ eventID, organizerID }: { eventID: string; organizerID: string }) => {
  const [regList, setRegList] = useState<RegList>();
  const [profiles, setProfiles] = useState<Profiles>();
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';

  // firebase 基本設定
  const applicantsRef = collection(db, 'events', eventID, 'applicants');
  const participantsRef = collection(db, 'events', eventID, 'participants');

  //   取回所有報名清單
  const getRegistrations = async () => {
    const [applicantsSnap, participantsSnap] = await Promise.all([
      getDocs(applicantsRef),
      getDocs(participantsRef),
    ]);

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

      const currentUserProfile = await getProfile(userID);

      const profiles = await getProfiles(members);
      setProfiles({ ...profiles, [userID]: currentUserProfile[userID] });
    };

    // 即時監聽報名者、加入者清單
    // 以onSnapshot事件帶動state更新，不將state更新寫在按鈕中
    const participantsQuery = query(participantsRef);
    const participantsUnsubs = onSnapshot(participantsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const userID = change.doc.id;

        if (change.type === 'removed') {
          setRegList((prev) => {
            if (prev && prev.participants) {
              const updatedParticipants = prev.participants.filter(
                (person) => person.id !== userID
              );
              return { ...prev, participants: updatedParticipants };
            }
            return prev;
          });
        }

        if (change.type === 'added') {
          setRegList((prev) => {
            if (prev && prev.participants) {
              const updatedParticipants = change.doc.data() as Participants;
              updatedParticipants.id = userID;
              return { ...prev, participants: [...prev.participants, updatedParticipants] };
            }
            return prev;
          });
        }
      });
    });

    // 報名但尚需審核的清單
    const applicantsQuery = query(applicantsRef);
    const applicantsUnsubs = onSnapshot(applicantsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const userID = change.doc.id;

        if (change.type === 'removed') {
          setRegList((prev) => {
            if (prev && prev.applicants) {
              const updatedApplicants = prev.applicants.filter((person) => person.id !== userID);
              return { ...prev, applicants: updatedApplicants };
            }
            return prev;
          });
        }

        // 聽用戶即時加入，必須要在加入之前取得profile資料，圖片map不出來的狀況
        if (change.type === 'added') {
          setRegList((prev) => {
            if (prev && prev.applicants) {
              const updatedApplicants = change.doc.data() as Applicants;
              updatedApplicants.id = userID;
              return { ...prev, applicants: [...prev.applicants, updatedApplicants] };
            }
            return prev;
          });
        }
      });
    });

    initData();

    return () => {
      applicantsUnsubs();
      participantsUnsubs();
    };
  }, []);

  return (
    <>
      {/* FIXME: 確認profiles都回來才把清單內容產生，這樣卡卡的 */}
      <div className="mb-5 border-t pt-5">
        <div className="pb-3 text-xl text-moonlight-950"> 已加入活動</div>
        <div className="flex flex-wrap">
          {profiles &&
            regList?.participants.map(
              (participant: { name: string; level: string; id: string }, index: number) => (
                <div key={index} className="w-full lg:mb-3 lg:w-1/2">
                  <UserInfo
                    imageURL={profiles[participant.id as any].avatarURL}
                    name={participant.name}
                    level={participant.level}
                    licence={true}
                    userID={participant.id}
                  >
                    {organizerID === userID && (
                      <RevokeButton userID={participant.id} eventID={eventID} />
                    )}
                  </UserInfo>
                </div>
              )
            )}
        </div>
      </div>

      <div className="border-t pb-3 pt-5 text-xl text-moonlight-950">等待清單</div>
      {profiles && (
        <div className="flex flex-wrap">
          {regList?.applicants.map(
            (applicant: { name: string; level: string; id: string }, index: number) => (
              <div key={index} className="w-full lg:mb-3 lg:w-1/2">
                <UserInfo
                  imageURL={profiles[applicant.id as string]?.avatarURL}
                  name={applicant.name}
                  level={applicant.level}
                  licence={true}
                  userID={applicant.id}
                >
                  {organizerID === userID && (
                    <div className="flex flex-wrap gap-1">
                      <ConfirmButton userID={applicant.id} eventID={eventID} accept />
                      <ConfirmButton userID={applicant.id} eventID={eventID} accept={false} />
                    </div>
                  )}
                </UserInfo>
              </div>
            )
          )}
        </div>
      )}
    </>
  );
};

export default RegistrationList;
