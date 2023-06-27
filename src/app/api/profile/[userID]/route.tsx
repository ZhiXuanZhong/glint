import db from '@/app/utils/firebaseConfig';
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { userID: string } }) {
  const profileRef = doc(db, 'profiles', params.userID);
  const response = await getDoc(profileRef);
  const profile = response.data();

  if (profile) {
    return NextResponse.json({ [params.userID]: profile });
  }

  return NextResponse.json({ [params.userID]: 'User not found' });
}
