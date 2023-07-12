import { GiHamburgerMenu } from 'react-icons/gi';
import NavLogin from '../NavLogin/NavLogin';
import Link from 'next/link';

const Nav = () => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  // const userID = '';

  return (
    <nav className="fixed z-10 border-b border-b-moonlight-100 bg-white">
      <header className="flex h-20 w-screen items-center ">
        <div className="ml-4 p-2">
          <GiHamburgerMenu />
        </div>
        <div className="mr-auto">
          <Link href={'/'} className="ml-3 flex cursor-pointer gap-[3px] font-bold text-white">
            <div className="flex h-9 w-9 items-center justify-center bg-sunrise-500 text-xl">G</div>
            <div className="flex h-9 w-9 items-center justify-center bg-sunrise-500 text-xl">L</div>
            <div className="flex h-9 w-9 items-center justify-center bg-sunrise-500 text-xl">I</div>
            <div className="flex h-9 w-9 items-center justify-center bg-sunrise-500 text-xl">N</div>
            <div className="flex h-9 w-9 items-center justify-center border border-sunrise-500 text-xl text-sunrise-500">T</div>
          </Link>
        </div>
        {/* FIXME: logo要換 */}
        {/* <Image width="50" height="50" src={'https://placehold.co/50x50.png'} alt="logo" style={{ objectFit: 'contain' }} className="mr-auto" /> */}
        <NavLogin />
      </header>
    </nav>
  );
};

export default Nav;
