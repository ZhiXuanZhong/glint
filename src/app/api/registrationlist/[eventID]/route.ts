import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import db from '@/app/utils/firebaseConfig';

export async function GET(request: Request, { params }: { params: { eventID: string } }) {
  const applicantsRef = collection(db, 'events', params.eventID, 'applicants');
  const participantsRef = collection(db, 'events', params.eventID, 'participants');

  const [applicantsSnap, participantsSnap] = await Promise.all([
    getDocs(applicantsRef),
    getDocs(participantsRef),
  ]);

  const applicants: Applicants[] = applicantsSnap.docs.map((doc) => ({
    ...(doc.data() as Applicants),
    id: doc.id,
  }));

  const participants: Participants[] = participantsSnap.docs.map((doc) => ({
    ...(doc.data() as Participants),
    id: doc.id,
  }));

  return NextResponse.json({ applicants, participants });
}
