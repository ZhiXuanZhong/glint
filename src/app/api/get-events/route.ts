import firebaseConfig from '@/app/utils/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { DocumentData, Index, getFirestore } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { query, where, orderBy } from 'firebase/firestore';
import { NextResponse } from 'next/server';

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


export async function GET(request: Request) {

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

  const events: DocumentData[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    data.id = doc.id;
    events.push(data);
  });

  return NextResponse.json({ data: events, params: queryParams })
}
