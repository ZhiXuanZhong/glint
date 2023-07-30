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

  // conversation 是指該用戶發生過的對話，也就是聊天室的概念
  const conversationsRef = collection(db, 'messages');
  // FIXME 這邊先寫死orderby，但不能這樣寫，應該要依照最後一則訊息新舊來排
  const conversationsQuery = query(
    conversationsRef,
    where('userIDs', 'array-contains', authUser),
    orderBy('createdTime', 'desc')
  );
  const [conversations, setConversations] = useImmer([] as Conversation[]);
  const [conversationIDs, setConversationIDs] = useState<string[]>([]);
  // currentConversation 是該用戶當前在哪個對話的指標，用來作為篩選對話的條件，目前透過conversationCard來更新值
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  // messagesChunk用來存所有聊天室的單條對話內容的pool，未來可以用where限制取回的時間點來增加效能
  const [messagesChunk, setMessagesChunk] = useImmer([] as Message[]);
  // 從messagesChunk這個pool篩出來的資料，用來動態生成Message component的對話內容
  const [messages, setMessages] = useState([] as Message[]);

  const listenToMultipleDocChanges = (docIds: string[]) => {
    docIds.forEach((docID) => {
      // 因為有docID要loop 所以query條件先不往外移
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

  const stopListeningToMultipleDocChanges = (docIds: string[]) => {
    docIds.forEach((docId) => {
      const docRef = collection(db, 'messages', docId, 'details');
      const docQuery = query(docRef);
      onSnapshot(docQuery, (_) => {
        // 再觸發一次停止監聽
      });
    });
  };

  useEffect(() => {
    if (!authUser) router.push('/login');
  }, []);

  useEffect(() => {
    if (!authUser) return;

    console.log(params);

    // 取得即時更新聊天室資料(使用中可能會有新的聊天室產生)
    // snapshop 第一次也可以直接load出所有資料
    const unsubscribeConversations = onSnapshot(conversationsQuery, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          setConversations((draft) => {
            const conversationWithID = { ...change.doc.data(), conversationID: change.doc.id };

            draft.push(conversationWithID as Conversation);

            // 假如都還沒有對話被載入，就先存
            if (!conversationIDs) {
              setConversationIDs([...conversationIDs, change.doc.id]);
            } else {
              //如果有新對話進來，就先綁監聽再加入清單
              listenToMultipleDocChanges([change.doc.id]);
              setConversationIDs([...conversationIDs, change.doc.id]);
            }
          });
        }

        // 利用判斷param來設定當前聊天室(預設是用戶兩人永遠只有單一房間，且不考慮多個房間群組的狀況)
        if (paramID?.length && change.doc.data().userIDs.includes(paramID[0])) {
          console.log(change.doc.id);
          setCurrentConversation(change.doc.id);
        }
      });
    });

    listenToMultipleDocChanges(conversationIDs);

    return () => {
      // 解除聊天室的監聽
      unsubscribeConversations();
      // 解除聊天室datails內文的監聽
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

// 主要策略：都由firebase onSnapShot驅動畫面資料更新

// Step 1
// 利用 useEffect中 unsubscribeConversations 先取得用戶的所有對話ID，做成array

// Step 2
// 藉由上一步存出來了 對話ID array， 送到 listenToMultipleDocChanges 大量綁snapshot監聽 PS: Step1, Step2的監聽都在useEffect的return時解除

// Step 3
// 監聽回來的資料以時間 由JS timestemp小到大排序，形成舊訊息在上、新訊息在下

// Step 4
// 利用ConversationCard的click事件去filter出messageChunk裡面對應的訊息

// Step 5
// 設定currentConversation讓Message component傳資料的時候知道要傳到哪個對話

// Warning!!!! useRef無法觸發useEffect推動資料更新，如果資料有需要觸發後續資料推動渲染就不要用！！
