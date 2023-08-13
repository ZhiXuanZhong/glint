'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { useAuthStore } from '@/store/authStore';

import { HMSRoomProvider } from '@100mslive/react-sdk';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import db from '../../utils/firebaseConfig';

import classNames from '@/app/utils/classNames';
import { MdChat } from 'react-icons/md';
import Messages from '@/components/Messages/Messages';
import ConversationCard from '@/components/ConversationCard/ConversationCard';

const Page = ({ params }: { params: { userID: string } }) => {
  const router = useRouter();
  const [authUser] = useAuthStore((state) => [state.authUser]);

  const paramID = params.userID;

  const conversationsRef = collection(db, 'messages');
  // FIXME: 目前先固定orderby，優化要依照最後一則訊息新舊來排
  const conversationsQuery = query(
    conversationsRef,
    where('userIDs', 'array-contains', authUser),
    orderBy('createdTime', 'desc')
  );
  const [conversations, setConversations] = useImmer([] as Conversation[]);
  const [conversationIDs, setConversationIDs] = useState<string[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messagesChunk, setMessagesChunk] = useImmer([] as Message[]);
  const [messages, setMessages] = useState([] as Message[]);

  const listenToMultipleDocChanges = (docIds: string[]) => {
    docIds.forEach((docID) => {
      //FIXME: 取得docID的query要移出
      const messagesDetailsRef = collection(db, 'messages', docID, 'details');
      const messagesDetailsQuery = query(messagesDetailsRef, orderBy('timestamp', 'asc'));

      onSnapshot(messagesDetailsQuery, (docSnapshot) => {
        docSnapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const messageWithID = { ...(change.doc.data() as Message), conversationID: docID };

            setMessagesChunk((draft) => {
              draft.push(messageWithID);
            });
          }
        });
      });
    });
  };

  // FIXME: 優化解除監聽流程
  const stopListeningToMultipleDocChanges = (docIds: string[]) => {
    docIds.forEach((docId) => {
      const docRef = collection(db, 'messages', docId, 'details');
      const docQuery = query(docRef);
      onSnapshot(docQuery, (_) => {});
    });
  };

  useEffect(() => {
    if (!authUser) router.push('/login');
  }, []);

  useEffect(() => {
    if (!authUser) return;

    console.log(params);

    const unsubscribeConversations = onSnapshot(conversationsQuery, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          setConversations((draft) => {
            const conversationWithID = { ...change.doc.data(), conversationID: change.doc.id };

            draft.push(conversationWithID as Conversation);

            if (!conversationIDs) {
              setConversationIDs([...conversationIDs, change.doc.id]);
            } else {
              listenToMultipleDocChanges([change.doc.id]);
              setConversationIDs([...conversationIDs, change.doc.id]);
            }
          });
        }

        if (paramID?.length && change.doc.data().userIDs.includes(paramID[0])) {
          console.log(change.doc.id);
          setCurrentConversation(change.doc.id);
        }
      });
    });

    listenToMultipleDocChanges(conversationIDs);

    return () => {
      unsubscribeConversations();
      stopListeningToMultipleDocChanges(conversationIDs);
    };
  }, [authUser]);

  useEffect(() => {
    setMessages(messagesChunk.filter((message) => message.conversationID === currentConversation));
  }, [messagesChunk]);

  return (
    <div className="flex h-[calc(100vh_-_5rem)] w-full">
      <div className="flex flex-col border-r">
        <div className="z-10 flex min-h-[48px] items-center justify-center text-moonlight-950 shadow-sm lg:w-[450px]">
          訊息總覽
        </div>
        <div className="h-[calc(100vh_-_5rem)] overflow-scroll">
          {conversations?.map((data, index) => (
            <div
              key={index}
              className={classNames(
                'cursor-pointer',
                currentConversation === data.conversationID ? 'bg-gray-100' : null
              )}
              onClick={() => {
                setMessages(
                  messagesChunk.filter((message) => message.conversationID === data.conversationID)
                );
                setCurrentConversation(data.conversationID);
              }}
            >
              <ConversationCard
                data={data}
                authUser={authUser}
                messagesChunk={messagesChunk
                  .filter((message) => message.conversationID === data.conversationID)
                  .slice(-1)}
              />
            </div>
          ))}
        </div>
      </div>
      <HMSRoomProvider>
        <div className="grow">
          {currentConversation ? (
            <Messages messages={messages} currentConversation={currentConversation as string} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <MdChat className="mb-3 text-5xl text-moonlight-400" />
              <div className="text-moonlight-800">選擇一個對話開始聊聊吧！</div>
            </div>
          )}
        </div>
      </HMSRoomProvider>
    </div>
  );
};

export default Page;
