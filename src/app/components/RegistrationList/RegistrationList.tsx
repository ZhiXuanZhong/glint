'use client';
import RevokeButton from '@/app/components/RevokeButton/RevokeButton';
import { Key, useState } from 'react';

interface RegistrationProps {
  participants: Participants[];
  applicants: Applicants[];
  usersProfile: { [id: string]: UsersProfile };
  eventID: string;
}

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

const RegistrationList = ({ participants, applicants, usersProfile, eventID }: RegistrationProps) => {
  const [regList, setRegList] = useState({ participants, applicants });

  const handleRevoke = (id: string) => {
    setRegList((prev) => {
      const newList = { ...prev };
      newList.participants = newList.participants.filter((person) => person.id !== id);
      return newList;
    });
  };

  return (
    <>
      <h2 className="font-bold text-xl">已加入活動</h2>
      {regList.participants.map((participant: { name: string; level: string; id: string }, index: Key) => (
        <div key={index} className="shadow-md m-3 rounded-lg bg-gray-50">
          <picture>
            <img src={usersProfile[participant.id as any].avatarURL} alt="Avatar" />
          </picture>
          <div>{participant.name}</div>
          <div>{participant.level}</div>
          <RevokeButton userID={participant.id} eventID={eventID} handleRevoke={handleRevoke} />
        </div>
      ))}

      <h2 className="font-bold text-xl">等待清單</h2>
      {regList.applicants.map((applicant: { name: string; level: string; id: string }, index: Key) => (
        <div key={index} className="shadow-md m-3 rounded-lg bg-gray-50">
          <picture>
            <img src={usersProfile[applicant.id as any].avatarURL} alt="Avatar" />
          </picture>
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
