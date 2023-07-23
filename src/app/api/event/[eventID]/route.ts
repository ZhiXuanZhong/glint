import { NextResponse } from 'next/server';
import { doc, getDoc } from "firebase/firestore";
import db from '@/app/utils/firebaseConfig';

export async function GET({ params }: { params: { eventID: string } }) {

    const detailRef = doc(db, 'events', params.eventID)
    const detail = await getDoc(detailRef);

    if (detail.exists()) {
        return NextResponse.json({ data: { ...detail.data(), id: params.eventID } })
    } else {
        return NextResponse.json({ data: 'Event not found.' })
    }
}
