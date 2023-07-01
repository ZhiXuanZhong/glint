'use client';
import Messages from '@/components/Messages/Messages';
import ConversationCard from '@/components/ConversationCard/ConversationCard';
import db from '../utils/firebaseConfig';
import { useEffect, useRef } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useImmer } from 'use-immer';

const Page = () => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  const messagesRef = collection(db, 'messages');
  const MessagesQuery = query(messagesRef, where('userIDs', 'array-contains', userID));
  const [conversations, setConversations] = useImmer([] as Conversation[]);

  useEffect(() => {
    // 取得即時更新聊天室資料(使用中可能會有新的聊天室產生)
    // snapshop 第一次也可以直接load出所有資料
    const unsubscribe = onSnapshot(MessagesQuery, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          setConversations((draft) => {
            draft.push(change.doc.data() as Conversation);
          });
        }
      });
    });
  }, []);

  return (
    <div className="flex">
      <div className="w-[500px] h-screen bg-slate-200">
        {conversations?.map((data, index) => (
          <ConversationCard key={index} data={data} />
        ))}
      </div>
      <div className="grow h-screen bg-slate-400">
        <Messages conversations={conversations} />
      </div>
    </div>
  );
};

export default Page;
