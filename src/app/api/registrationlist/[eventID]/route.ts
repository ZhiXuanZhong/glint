import firebaseConfig from '@/app/utils/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';
import { getDocs } from "firebase/firestore";
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { eventID: string } }) {

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

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
