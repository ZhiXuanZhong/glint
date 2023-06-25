import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Glint - Dive Secure, Explore Safely',
  description: 'Dive into Adventure with Glint"',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="fixed bg-purple-300 right-0">[logged as admin] rGd4NQzBRHgYUTdTLtFaUh8j8ot1</div>
        {children}
      </body>
    </html>
  );
}
