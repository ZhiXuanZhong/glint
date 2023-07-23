import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import db from '@/app/utils/firebaseConfig';

export async function GET(request: Request, { params }: { params: { eventID: string } }) {
    const detailRef = doc(db, 'events', params.eventID)
    const detail = await getDoc(detailRef);

    const eventData = detail.exists()
        ? { data: { ...detail.data(), id: params.eventID } }
        : { data: 'Event not found.' };

    return NextResponse.json(eventData);
}