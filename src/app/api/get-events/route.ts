import firebaseConfig from '@/app/utils/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { DocumentData, Index, getFirestore } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { query, where, orderBy } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

type QueryParams = {
  locations: string | null;
  category: string | null;
  startTime: number;
  endTime: number;
  organizerType: string | null;
  [index: string]: string | number | null;
};

interface QueryConditions {
  property: string;
  operator: '==' | '>=' | '<=' | 'array-contains';
  value: string | number | null;
}

interface Event {
  title: string;
  organizer: string;
  levelSuggection: string;
  status: string;
  description: string;
  createdTime: {
    seconds: number;
    nanoseconds: number;
  };
  endTime: number;
  mainImage: string;
  locations: string[];
  startTime: number;
  organizerType: string;
  organizerLevel: string;
  category: string;
  id: string;
}


export async function GET(request: Request) {

  const getRating = async (userID: string) => {
    const response = await fetch(`${protocol}://${host}/api/rating/${userID}`, { cache: 'no-cache' });
    return response.json();
  }

  const addRating = async (array: Event[]) => {
    for (let i = 0; i < array.length; i++) {
      const rating = await getRating(array[i].organizer);
      Object.assign(events[i], rating)
      // events[i].rating = rating
    }
  };

  const headersData = headers();
  const protocol = headersData.get('x-forwarded-proto');
  const host = headersData.get('host');

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const { searchParams } = new URL(request.url)
  const queryParams: QueryParams = {
    locations: searchParams.get('location'),
    category: searchParams.get('category'),
    startTime: Number(searchParams.get('startTime')),
    endTime: Number(searchParams.get('endTime')),
    organizerType: searchParams.get('organizerType'),
  };

  console.log(queryParams);


  const queryList = Object.keys(queryParams).reduce((acc: QueryConditions[], key: string) => {
    const value = queryParams[key];

    if (value) {
      switch (key) {
        case 'locations':
          acc.push({
            property: key,
            operator: 'array-contains',
            value: value,
          })
          break;

        case 'startTime':
          acc.push({
            property: key,
            operator: '>=',
            value: value,
          })
          break;
        case 'endTime':
          acc.push({
            property: 'startTime',
            operator: '<=',
            value: value,
          })
          break;

        default:
          acc.push({
            property: key,
            operator: '==',
            value: value,
          })
          break;
      }

    }
    return acc;
  }, []);



  const queryConditions = queryList.map(condition => where(condition.property, condition.operator, condition.value))

  console.log(queryConditions)

  const queryToPerform = query(collection(db, 'events'), ...queryConditions)

  const querySnapshot = await getDocs(queryToPerform);

  const events: Event[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data() as Event;
    if (data) {
      data.id = doc.id;
      events.push(data);
    }
  });
  await addRating(events)


  return NextResponse.json({ data: events, params: queryParams })

}
