import firebaseConfig from "@/app/utils/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { userID: string } }) {

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const reviewRef = doc(db, 'reviews', params.userID)
    const detail = await getDoc(reviewRef);
    const rating = detail.data()

    if (rating) {
        return NextResponse.json({ rating: parseFloat((rating.ratingSum / rating.reviewCount).toFixed(1)) })
    }

    return NextResponse.json({ rating: 0 })
}