import Link from 'next/link';
import Image from 'next/image';

const Nav = () => {
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';
  return (
    <nav className="fixed z-50">
      <header className="w-screen h-20 flex items-center justify-between px-10 bg-slate-200">
        <Image width="50" height="50" src={'https://placehold.co/50x50.png'} alt="logo" style={{ objectFit: 'contain' }} />
        <div>avatar</div>
      </header>
    </nav>
  );
};

export default Nav;
