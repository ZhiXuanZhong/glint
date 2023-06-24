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





    return NextResponse.json({ rating })
}