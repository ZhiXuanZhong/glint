'use client';
import Messages from '@/components/Messages/Messages';

const conversation = [
  {
    message: '嗨，你好嗎？',
    userID: 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1',
    username: 'Admin',
    timestamp: 1695998400000,
  },
  {
    message: '我很好，謝謝你！你需要什麼幫助嗎？',
    userID: 'ymXZFmPnL4dqcfQoZODUoL2T2Bi1',
    username: 'Sasha',
    timestamp: 1695998460000,
  },
  {
    message: '有什麼好看的電影推薦嗎？',
    userID: 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1',
    username: 'Admin',
    timestamp: 1695998520000,
  },
  {
    message: '當然！你喜歡什麼類型的電影？',
    userID: 'ymXZFmPnL4dqcfQoZODUoL2T2Bi1',
    username: 'Sasha',
    timestamp: 1695998580000,
  },
  {
    message: '我喜歡浪漫愛情片和驚悚片。',
    userID: 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1',
    username: 'Admin',
    timestamp: 1695998640000,
  },
  {
    message: '那我推薦你看《愛在午夜陽光下》和《驚悚時刻》。',
    userID: 'ymXZFmPnL4dqcfQoZODUoL2T2Bi1',
    username: 'Sasha',
    timestamp: 1695998700000,
  },
  {
    message: '謝謝推薦！這些片子在哪裡可以看到呢？',
    userID: 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1',
    username: 'Admin',
    timestamp: 1695998760000,
  },
  {
    message: '這些電影可以在大型影城或線上影音平台上觀賞。',
    userID: 'ymXZFmPnL4dqcfQoZODUoL2T2Bi1',
    username: 'Sasha',
    timestamp: 1695998820000,
  },
  {
    message: '我要訂兩張明天晚上的電影票。',
    userID: 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1',
    username: 'Admin',
    timestamp: 1695998880000,
  },
  {
    message: '好的，請問是哪部電影呢？',
    userID: 'ymXZFmPnL4dqcfQoZODUoL2T2Bi1',
    username: 'Sasha',
    timestamp: 1695998940000,
  },
];

const page = () => {
  return (
    <div className="flex">
      <div className="w-[500px] h-screen bg-slate-200">
        {['member1', 'member2', 'member3'].map((data, index) => (
          <div className="flex m-3 border-red-500 border" key={index}>
            <picture>
              <img src="https://placehold.co/50x50" alt="avatar" />
            </picture>
            <div>{data}</div>
          </div>
        ))}
      </div>
      <div className="grow h-screen bg-slate-400">
        <Messages conversation={conversation} />
      </div>
    </div>
  );
};

export default page;
