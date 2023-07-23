import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import db from '@/app/utils/firebaseConfig';

export const revalidate = 'force-cache'

export async function GET(request: Request) {

  const getRating = async (userID: string) => {
    const response = await fetch(`${protocol}://${host}/api/rating/${userID}`, { next: { revalidate: 5 } });
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


  const { searchParams } = new URL(request.url)
  const queryParams: QueryParams = {
    locations: searchParams.get('locations'),
    category: searchParams.get('category'),
    startTime: Number(searchParams.get('startTime')),
    endTime: Number(searchParams.get('endTime')),
    organizerType: searchParams.get('organizerType'),
  };

  console.log(queryParams);


  const queryList = Object.keys(queryParams).reduce((acc: QueryConditions[], key: string) => {
    const value = queryParams[key];

    if (value && value !== 'null') {
      console.log(key, typeof value)
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



  const queryConditions = queryList?.map(condition => where(condition.property, condition.operator, condition.value))

  console.log(queryConditions)

  const queryToPerform = query(collection(db, 'events'), ...queryConditions, orderBy('startTime'))
  // const queryToPerform = query(collection(db, 'events'), orderBy('startTime'))

  const querySnapshot = await getDocs(queryToPerform);

  const events: Event[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data() as Event;
    if (data) {
      data.id = doc.id;
      if (data.endTime > Date.now()) {
        events.push(data);
      }
    }
  });
  await addRating(events)


  return NextResponse.json({ data: events, params: queryParams })

}
