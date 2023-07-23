import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import db from '@/app/utils/firebaseConfig';

export async function GET(request: Request, { params }: { params: { eventID: string } }) {
    const applicants: any = []
    const applicantsRef = collection(db, 'events', params.eventID, 'applicants')
    const applicantsFire = await getDocs(applicantsRef);
    applicantsFire.forEach((doc) => {
        const user = doc.data()
        user.id = doc.id
        applicants.push(user)
    });

    const participants: any = []
    const participantsRef = collection(db, 'events', params.eventID, 'participants')
    const participantsFire = await getDocs(participantsRef);
    participantsFire.forEach((doc) => {
        const user = doc.data()
        user.id = doc.id
        participants.push(user)
    });

    return NextResponse.json({ applicants, participants })
}
