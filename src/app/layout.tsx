import './globals.css';
import { Noto_Sans_TC } from 'next/font/google';
import Nav from '@/components/Nav/Nav';
import SideBar from '@/components/Sidebar/SideBar';

const noto_sans_tc = Noto_Sans_TC({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal'],
  variable: '--font-noto-sans-tc',
  weight: ['100', '300', '400', '500', '700', '900'],
});

export const metadata = {
  title: 'Glint - Dive Secure, Explore Safely',
  description: 'Dive into Adventure with Glint"',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${noto_sans_tc.variable}`}>
      <body>
        <div>
          <Nav />
          <div className="relative">
            <SideBar />
            <div className="relative top-[80px] md:ml-[208px] ">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
