'use client';
import { HMSRoomProvider } from '@100mslive/react-sdk';

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HMSRoomProvider>{children}</HMSRoomProvider>
    </>
  );
}
