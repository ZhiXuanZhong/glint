import './globals.css';
import { Inter, Noto_Sans_TC } from 'next/font/google';
import Nav from '@/components/Nav/Nav';
import SideBar from '@/components/Sidebar/SideBar';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

const noto_sans_tc = Noto_Sans_TC({
  subsets: ['latin'],
  display: 'swap',
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
          <div>
            <SideBar />
            <div className="relative top-[80px] lg:ml-[208px] md:ml-[128px] ">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
