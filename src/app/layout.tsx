import './globals.css';
import { Inter } from 'next/font/google';
import Nav from '@/components/Nav/Nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Glint - Dive Secure, Explore Safely',
  description: 'Dive into Adventure with Glint"',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex">
          <Nav />
          <div className="grow">{children}</div>
        </div>
      </body>
    </html>
  );
}
