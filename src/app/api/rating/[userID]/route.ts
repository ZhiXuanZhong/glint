import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import db from '@/app/utils/firebaseConfig';

export async function GET(request: Request, { params }: { params: { userID: string } }) {
    const reviewRef = doc(db, 'reviews', params.userID)
    const detail = await getDoc(reviewRef);
    const rating = detail.data()

    if (rating) {
        return NextResponse.json({ rating: parseFloat((rating.ratingSum / rating.reviewCount).toFixed(1)), reviewCount: rating.reviewCount })
    }

    return NextResponse.json({ rating: 0, reviewCount: 0 })
}