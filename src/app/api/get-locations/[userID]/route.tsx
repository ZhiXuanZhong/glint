import { NextResponse } from 'next/server';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import db from '@/app/utils/firebaseConfig';
import serverAPI from '@/app/utils/serverAPI';

interface Location {
  userID: string;
  startTime: number;
  endTime: number;
  coordinates: number[];
  eventID: string;
  eventTitle: string;
}

interface Feature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    userID: string;
    startTime: number;
    endTime: number;
    name: string;
    avatar: string;
    eventID: string;
    eventTitle: string;
  };
}

interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

export async function GET(request: Request, { params }: { params: { userID: string } }) {
  const getFollowing = async (userID: string) => {
    const list: string[] = [];
    const followingRef = collection(db, 'users', userID, 'followings');

    const followingSnap = await getDocs(followingRef);
    followingSnap.forEach((user) => list.push(user.id));

    return list;
  };

  const getProfiles = async (userIDs: string[]) => {
    const profiles = await Promise.all(
      userIDs.map(async (userID) => {
        const profile = serverAPI.getProfile(userID);
        return profile;
      })
    );

    return Object.assign({}, ...profiles);
  };

  const getLocations = async (userID: string) => {
    const locationRef = doc(db, 'userLocations', userID);
    const permission = (await getDoc(locationRef)).data() as { [key: string]: boolean };

    if (!permission.isLocationPublic) return;

    const locationsList: Location[] = [];
    const userLocationsRef = collection(db, 'userLocations', userID, 'locations');
    const locationsSnap = await getDocs(userLocationsRef);
    locationsSnap.forEach((location) => {
      const locationWithID = {
        ...(location.data() as Location),
        userID,
      };
      locationsList.push(locationWithID);
    });

    return locationsList;
  };

  const getAllLocations = async (userIDs: string[]) => {
    const promises = userIDs.map((userID) => getLocations(userID));
    const results = await Promise.all(promises);
    const allLocations = results.flat().filter((locations) => locations !== undefined);

    return allLocations;
  };

  const convertToGeoJSON = (locations: Location[], profiles: Profiles) => {
    const featureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    for (const location of locations) {
      const feature: Feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: location.coordinates.reverse(),
        },
        properties: {
          userID: location.userID,
          startTime: location.startTime,
          endTime: location.endTime,
          name: profiles[location.userID].username,
          avatar: profiles[location.userID].avatarURL,
          eventID: location.eventID,
          eventTitle: location.eventTitle,
        },
      };

      featureCollection.features.push(feature);
    }

    return featureCollection;
  };

  const userFollowing = await getFollowing(params.userID);
  const userProfiles = await getProfiles(userFollowing);
  const allLocations = await getAllLocations(userFollowing);
  const geoJSON = convertToGeoJSON(allLocations as Location[], userProfiles);

  return NextResponse.json({ data: geoJSON });
}
