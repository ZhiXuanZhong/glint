import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import db from '@/app/utils/firebaseConfig';

export async function GET(request: Request, { params }: { params: { userID: string } }) {
  const reviewRef = doc(db, 'reviews', params.userID);
  const detail = await getDoc(reviewRef);
  const rating = detail.exists() ? detail.data() : null;

  const response = rating
    ? {
        rating: parseFloat((rating.ratingSum / rating.reviewCount).toFixed(1)),
        reviewCount: rating.reviewCount,
      }
    : { rating: 0, reviewCount: 0 };

  return NextResponse.json(response);
}
