import { headers } from 'next/headers';
import Image from 'next/image';
import { Key } from 'react';
import UserInfo from '@/components/UserInfo/UserInfo';
import ApplyButton from '@/components/ApplyButton/ApplyButton';
import FavoriteButton from '@/components/FavoriteButton/FavoriteButton';
import RegistrationList from '@/components/RegistrationList/RegistrationList';

export default async function Page({ params }: { params: { eventID: string } }) {
  // FIXME: workaround! server component can't fetch relative path
  // https://github.com/vercel/next.js/issues/46840
  const headersData = headers();
  const protocol = headersData.get('x-forwarded-proto');
  const host = headersData.get('host');

  async function getInfo(eventID: string) {
    const response = await fetch(`${protocol}://${host}/api/event/${eventID}`, { next: { revalidate: 5 } });
    return response.json();
  }

  async function getRating(userID: string) {
    const response = await fetch(`${protocol}://${host}/api/rating/${userID}`, { next: { revalidate: 60 } });
    return response.json();
  }

  const eventInfos = await getInfo(params.eventID);
  const { rating } = await getRating(eventInfos.data.organizer);
  console.log(eventInfos);

  return (
    <div className="mx-4 flex h-screen flex-col p-10 md:mx-auto md:max-w-3xl lg:max-w-5xl">
      <h1 className="mb-6 border-b py-3 text-2xl font-semibold text-moonlight-950">蘭嶼/綠島/小琉球跳島11日可能嗎潛旅</h1>
      <div className="md:flex">
        <div className="h-screen bg-slate-200 p-3 md:w-2/6">Left column</div>
        {/* right column starts here */}
        <div className="px-3 md:w-4/6">
          <h2 className="pb-3 text-xl text-moonlight-950">活動詳情</h2>
          <div className=" shadow-sm">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: '250px', objectFit: 'cover' }}
              src={'https://images.pexels.com/photos/7146556/pexels-photo-7146556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
              alt={'event picture'}
            />
          </div>
          <div className="border-b py-3 text-sm leading-tight tracking-wide text-moonlight-900">
            <p>自由潛水課程結束了卻不知道該如何繼續與大海連結嗎？</p>
            <br />
            <p>在台灣或者國外的某個地方接觸了自由潛水，不論你是否達到課程結訓的要求，都可以透過我們繼續與大海連結.</p>
            <br />
            <p>導潛活動與海洋訓練,僅帶有證照的客人，且依照證照內容活動。EX:SSI L1 or Aida2 or Padi Freediver 程度,就從10米開始帶。</p>
            <br />
            <p>Basic、Aida1 程度,以平水與5米內環境為主。鋼鐵礁這類離岸較遠的潛點，僅接受&apos;&apos;船潛&apos;&apos;過去潛點。單次導潛活動地點僅帶【1】個為主。</p>
            <br />
            <p>Q:我有一個朋友沒有證照，可以穿救生衣一起再旁邊浮潛玩嗎?&nbsp;</p>
            <p>A: 不能跟。請他參加地方的浮潛活動。地方浮潛每人350元</p>
            <br />
            <p>Q: 我有一個朋友有水肺證照，可以帶裝備一起玩嗎?&nbsp;</p>
            <p>A: 不可以。水肺與自潛屬性不同。</p>
            <br />
            <p>Q : 我朋友玩體驗自由潛水活動，我可以跟去再旁邊玩嗎?&nbsp;</p>
            <p>A:不可以。教練無法分心同時照顧不同程度的人。</p>
            <br />
            <p>Q: 我有上過課，只是沒考過?&nbsp;</p>
            <p>A請先找教練把證照考完，才能參加導潛活動。導潛需要按照證照做確認。請攜帶證照以供辨識。</p>
            <br />
            <p>以上活動均包含保險。</p>
            <br />
            <p>預估費用 NT$88,888</p>
          </div>

          <RegistrationList eventID={params.eventID} />
          <div></div>
        </div>
      </div>
    </div>
  );
}
