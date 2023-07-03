'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { users } from './mockUsers';
import { features } from 'process';
import { useImmer } from 'use-immer';
import Link from 'next/link';

mapboxgl.accessToken = 'pk.eyJ1IjoiamVmb2RvYjM0OCIsImEiOiJjbGl3dDBwZWUwMTBhM2dudXRydjZxdDlmIn0.8ETyiwSlhW9BwT7ObaZ3dw';

function getRandomCoordinates(center) {
  const earthRadius = 6378000; // 地球半徑，單位：公尺
  const randomAngle = Math.random() * 2 * Math.PI; // 隨機角度
  const randomDistance = Math.random() * 300 + 500; // 隨機距離，範圍：500-800 公尺

  // 計算隨機座標的緯度差值
  const deltaLatitude = (randomDistance / earthRadius) * (180 / Math.PI);

  // 計算隨機座標的經度差值
  const deltaLongitude = (randomDistance / (earthRadius * Math.cos((Math.PI * center[1]) / 180))) * (180 / Math.PI);

  // 計算隨機座標的緯度
  const latitude = center[1] + deltaLatitude * Math.cos(randomAngle);

  // 計算隨機座標的經度
  const longitude = center[0] + deltaLongitude * Math.sin(randomAngle);

  return [longitude, latitude];
}

const page = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef(null) as mapboxgl;

  const [lng, setLng] = useState(120.9323);
  const [lat, setLat] = useState(23.5702);
  const [zoom, setZoom] = useState(7.5);
  const [pitch, setPitch] = useState(7.5);
  const [bearing, setBearing] = useState(7.5);
  const [usersGeo, setUsersGeo] = useImmer(users);
  const [bounds, setBounds] = useState();

  const handleClick = () => {
    setUsersGeo((draft) => {
      const newData = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: getRandomCoordinates([121.475333, 22.660625]),
        },
        properties: {
          id: Date.now(),
          name: 'Sophia',
          phone: '2022347345',
          lastUpdate: '2023/06/16',
          avatar: 'https://placehold.co/50x50',
          gender: 'female',
        },
      };

      draft.features.push(newData);
      map.current?.getSource('locations').setData(draft);
    });
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLElement,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [120.8937, 23.1956],
      zoom: 7.5,
      pitch: 31,
      bearing: -7.7,
    });

    map.current?.on('load', () => {
      /* Add the data to your map as a layer */
      map.current?.addLayer({
        id: 'locations',
        type: 'circle',
        /* Add a GeoJSON source containing place coordinates and information. */
        source: {
          type: 'geojson',
          data: usersGeo,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
        },
      });

      // Add clusters' circle
      map.current?.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'locations',
        filter: ['has', 'point_count'],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': ['step', ['get', 'point_count'], '#FFF', 0, '#FFA500'],
          'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
        },
      });

      // add clusters' count number
      map.current?.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'locations',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
      });

      // style number equal to 1
      map.current?.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'locations',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#FFA500',
          'circle-radius': 10,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      });

      map.current?.addLayer({
        id: 'unclustered-count',
        type: 'symbol',
        source: 'locations',
        filter: ['has', 'point_count'],
        layout: {
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
      });
      setBounds(map.current.getBounds());
    });

    map.current?.on('move', () => {
      setLng(map.current?.getCenter().lng.toFixed(4));
      setLat(map.current?.getCenter().lat.toFixed(4));
      setZoom(map.current?.getZoom().toFixed(2));
      setPitch(map.current?.getPitch().toFixed(2));
      setBearing(map.current?.getBearing().toFixed(2));
      setBounds(map.current.getBounds());
    });

    // 4-1 enable click then center behaviour by using mapbox flyTo method
    const flyToUser = (currentFeature) => {
      map.current?.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 9.7,
      });
    };

    //4-2 create Popup to display user's info
    const createPopUp = (currentFeature) => {
      const popUps = document.getElementsByClassName('mapboxgl-popup');
      /** Check if there is already a popup on the map and if so, remove it */
      if (popUps[0]) popUps[0].remove();

      const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML(
          `
						 <div style="display:flex;width:250px">
							<div>
								<img src="${currentFeature.properties.avatar}"/>
							</div>
							<div>
									<div>${currentFeature.properties.name}</div>
									<div>tel:${currentFeature.properties.phone}</div>
									<div>Last updated:${currentFeature.properties.lastUpdate}</div>
							</div>
						
					  </div>
						`
        )
        .addTo(map.current);
    };

    map.current?.on('click', (event) => {
      /* Determine if a feature in the "locations" layer exists at that point. */
      const features = map.current?.queryRenderedFeatures(event.point, {
        layers: ['locations'],
      });

      /* If it does not exist, return */
      if (!features.length) return;

      const clickedPoint = features[0];

      /* Fly to the point */
      flyToUser(clickedPoint);

      /* Close all other popups and display popup for clicked store */
      createPopUp(clickedPoint);
    });
  });

  useEffect(() => {
    // const llb = new mapboxgl.LngLatBounds(new mapboxgl.LngLat(filterCondition._sw), new mapboxgl.LngLat(filterCondition._ne));
    const ll = new mapboxgl.LngLat(121.34646095868027, 23.487687802790674);
    console.log(bounds?.contains(ll));

    setUsersGeo((draft) => {
      draft.features = users.features.filter((data) => bounds?.contains(data.geometry.coordinates));
    });
  }, [bounds]);

  return (
    <div className="flex h-screen">
      <link rel="stylesheet" href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" />
      <div className=" w-3/4 text-left" ref={mapContainer}></div>
      <div className=" w-1/4">
        divers' list
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} | Pitch: {pitch} | Bearing: {bearing}
        </div>
        {/* <div>bounds: {filterCondition}</div> */}
        {usersGeo.features.map((user, index) => (
          <div key={index}>{user.properties.name}</div>
        ))}
        <button onClick={handleClick}>add</button>
      </div>
    </div>
  );
};

export default page;
