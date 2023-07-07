import { GiHamburgerMenu } from 'react-icons/gi';
import NavLogin from '../NavLogin/NavLogin';

const Nav = () => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  // const userID = '';

  return (
    <nav className="fixed z-10 border-b border-b-moonlight-100 bg-white">
      <header className="flex h-20 w-screen items-center ">
        <div className="ml-4 p-2">
          <GiHamburgerMenu />
        </div>
        <div className="ml-3 mr-auto flex cursor-pointer gap-[2px] font-bold text-white">
          <div className=" flex h-7 w-7 items-center justify-center bg-sunrise-500">G</div>
          <div className=" flex h-7 w-7 items-center justify-center bg-sunrise-500">L</div>
          <div className=" flex h-7 w-7 items-center justify-center bg-sunrise-500">I</div>
          <div className=" flex h-7 w-7 items-center justify-center bg-sunrise-500">N</div>
          <div className=" flex h-7 w-7 items-center justify-center border border-sunrise-500 text-sunrise-500">T</div>
        </div>
        {/* FIXME: logo要換 */}
        {/* <Image width="50" height="50" src={'https://placehold.co/50x50.png'} alt="logo" style={{ objectFit: 'contain' }} className="mr-auto" /> */}
        <NavLogin />
      </header>
    </nav>
  );
};

export default Nav;
