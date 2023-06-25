import firebaseConfig from '@/app/utils/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';
import { doc, getDoc, getDocs } from "firebase/firestore";
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { eventID: string } }) {

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const detailRef = doc(db, 'events', params.eventID)
    const detail = await getDoc(detailRef);

    if (detail.exists()) {
        return NextResponse.json({ data: detail.data() })
    } else {
        return NextResponse.json({ data: 'Event not found.' })
    }
}
