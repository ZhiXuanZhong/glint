import { NextResponse } from 'next/server';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

import db from '@/app/utils/firebaseConfig';
import getProtocolHost from '@/app/utils/getProtocolHost';
import api from '@/app/utils/api';

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
  const { protocol, host } = getProtocolHost();

  // 取得當前用戶追蹤清單，只加入公開的資料
  const getFollowing = async (userID: string) => {
    const list: string[] = [];
    const followingRef = collection(db, 'users', userID, 'followings');

    const followingSnap = await getDocs(followingRef);
    followingSnap.forEach((user) => list.push(user.id));

    return list;
  };

  // 取得單筆profile資料
  // const getProfile = async (userID: string) => {
  //   const response = await fetch(`${protocol}://${host}/api/profile/${userID}`, { next: { revalidate: 5 } });
  //   return response.json();
  // };

  // const getProfile = api.getProfile(userID: string)

  // 一次取回追蹤清單的profile資料
  const getProfiles = async (arr: string[]) => {
    const profiles = await Promise.all(
      arr.map(async (userID) => {
        const profile = api.getProfile(userID);
        return profile;
      })
    );
    return Object.assign({}, ...profiles);
  };

  const getLocations = async (userID: string) => {
    const locationRef = doc(db, 'userLocations', userID);
    const promission = (await getDoc(locationRef)).data() as { [key: string]: boolean };

    if (!promission.isLocationPublic) return;

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
