'use client';
import RevokeButton from '@/app/components/RevokeButton/RevokeButton';
import { Key } from 'react';

const RegistrationList = ({ eventInfos, usersProfile, eventID }) => {
  return (
    <>
      <h2 className="font-bold text-xl">已加入活動</h2>
      {eventInfos.participants.map((participant: { name: string; level: string; id: string }, index: Key) => (
        <div key={index} className="shadow-md m-3 rounded-lg bg-gray-50">
          <picture>
            <img src={usersProfile[participant.id].avatarURL} alt="Avatar" />
          </picture>
          <div>{participant.name}</div>
          <div>{participant.level}</div>
          <RevokeButton userID={participant.id} eventID={eventID} />
        </div>
      ))}

      <h2 className="font-bold text-xl">等待清單</h2>
      {eventInfos.applicants.map((applicant: { name: string; level: string; id: string }, index: Key) => (
        <div key={index} className="shadow-md m-3 rounded-lg bg-gray-50">
          <picture>
            <img src={usersProfile[applicant.id].avatarURL} alt="Avatar" />
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
