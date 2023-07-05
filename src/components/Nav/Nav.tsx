import Link from 'next/link';
import Login from '../Login/Login';
const Nav = () => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  return (
    <nav className="w-[250px] min-[250px]: h-screen sticky top-0">
      <picture>
        <img src="https://placehold.co/200x100?text=Glint\nLogo" alt="logo" />
      </picture>
      <h1 className=" bg-slate-200 m-1 p-1">
        <Link href={'/events'}>尋找潛水活動</Link>
      </h1>

      <h1 className=" bg-slate-200 m-1 p-1">
        <Link href={'/portal'}>管理潛水活動 </Link>
      </h1>
      <h1 className=" bg-slate-200 m-1 p-1">
        <Link href={'/messages'}>訊息</Link>
      </h1>

      <h1 className=" bg-slate-200 m-1 p-1">
        <Link href={'/locator'}>我的潛水員地圖</Link>
      </h1>

      <h1 className=" bg-slate-200 m-1 p-1">
        <Link href={`/profile/${userID}`}>個人檔案</Link>
      </h1>
    </nav>
  );
};

export default Nav;
