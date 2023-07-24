'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

import { collection, getDocs, onSnapshot, query } from 'firebase/firestore';
import db from '@/app/utils/firebaseConfig';

import clientAPI from '@/app/utils/clientAPI';
import ConfirmButton from '@/components/ConfirmButton/ConfirmButton';
import RevokeButton from '@/components/RevokeButton/RevokeButton';
import UserInfo from '@/components/UserInfo/UserInfo';

const RegistrationList = ({ eventID, organizerID }: { eventID: string; organizerID: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [regList, setRegList] = useState<RegList>();
  const [profiles, setProfiles] = useState<Profiles>();
  const [authUser] = useAuthStore((state) => [state.authUser]);
  const [authProfile] = useAuthStore((state) => [state.authProfile]);

  const applicantsRef = collection(db, 'events', eventID, 'applicants');
  const participantsRef = collection(db, 'events', eventID, 'participants');

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

  const getProfiles = async (data: { applicants: Applicants[]; participants: Participants[] }) => {
    const allParticipants = [...data.applicants, ...data.participants];
    const promises = allParticipants.map((person) => clientAPI.getProfile(person.id));
    const profilesArray = await Promise.all(promises);

    const profiles = {};
    profilesArray.forEach((profile) => {
      Object.assign(profiles, profile);
    });

    return profiles;
  };

  useEffect(() => {
    if (authUser) setLoaded(true);
  }, [authUser]);

  useEffect(() => {
    if (!authUser || !authProfile) return;

    const initData = async () => {
      const eventMembers = await getRegistrations();
      const profiles = await getProfiles(eventMembers);

      setRegList(eventMembers);
      setProfiles({ ...profiles, [authUser]: authProfile });
    };

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

        if (change.type === 'added') {
          setRegList((prev) => {
            if (prev && prev.applicants) {
              const updatedApplicants = change.doc.data() as Applicants;
              updatedApplicants.id = change.doc.id;
              return { ...prev, applicants: [...prev.applicants, updatedApplicants] };
            }
            return prev;
          });
        }
      });
    });

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

    initData();

    return () => {
      applicantsUnsubs();
      participantsUnsubs();
    };
  }, [loaded, authProfile]);

  return (
    <>
      {/* FIXME: 確認profiles都回來才把清單內容產生，這樣卡卡的 */}
      <div className="mb-5 border-t pt-5">
        <div className="pb-3 text-xl text-moonlight-950"> 已加入活動</div>
        <div className="flex flex-wrap">
          {profiles &&
            regList?.participants.map(
              (participant: { name: string; level: string; id: string }, index: number) => (
                <div key={crypto.randomUUID()} className="w-full lg:mb-3 lg:w-1/2">
                  <UserInfo
                    imageURL={profiles[participant.id as any].avatarURL}
                    name={participant.name}
                    level={participant.level}
                    licence={true}
                    userID={participant.id}
                  >
                    {organizerID === authUser && (
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
              <div key={crypto.randomUUID()} className="w-full lg:mb-3 lg:w-1/2">
                <UserInfo
                  imageURL={profiles[applicant.id as string]?.avatarURL}
                  name={applicant.name}
                  level={applicant.level}
                  licence={true}
                  userID={applicant.id}
                >
                  {organizerID === authUser && (
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
