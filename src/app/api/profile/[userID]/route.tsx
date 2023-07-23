import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import db from '@/app/utils/firebaseConfig';

export async function GET(request: Request, { params }: { params: { userID: string } }) {
  const profileRef = doc(db, 'profiles', params.userID);
  const response = await getDoc(profileRef);
  const profile = response.data();

  if (profile) {
    return NextResponse.json({ [params.userID]: profile });
  }

  return NextResponse.json({ [params.userID]: 'User not found' });
}
