import { NextResponse } from 'next/server';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

import db from '@/app/utils/firebaseConfig';
import paramsToFireConditions from '@/app/utils/paramsToFireConditions';

export const revalidate = 'force-cache'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const queryParams: QueryParams = {
    locations: searchParams.get('locations'),
    category: searchParams.get('category'),
    startTime: Number(searchParams.get('startTime')),
    endTime: Number(searchParams.get('endTime')),
    organizerType: searchParams.get('organizerType'),
  };

  const queryConditions = paramsToFireConditions(queryParams)
  const queryToPerform = query(collection(db, 'events'), ...queryConditions, orderBy('startTime'))
  const querySnapshot = await getDocs(queryToPerform);

  const events: Event[] = querySnapshot
    .docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as Event))
    .filter((data) => data.endTime > Date.now());

  return NextResponse.json({ data: events })
}