'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { users } from './users';

mapboxgl.accessToken = 'pk.eyJ1IjoiamVmb2RvYjM0OCIsImEiOiJjbGl3dDBwZWUwMTBhM2dudXRydjZxdDlmIn0.8ETyiwSlhW9BwT7ObaZ3dw';

const page = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  const [lng, setLng] = useState(120.9323);
  const [lat, setLat] = useState(23.5702);
  const [zoom, setZoom] = useState(7.5);
  const [usersGeo, setUsersGeo] = useState(users);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLElement,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on('load', () => {
      /* Add the data to your map as a layer */
      map.current.addLayer({
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
      map.current.addLayer({
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
      map.current.addLayer({
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
      map.current.addLayer({
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

      map.current.addLayer({
        id: 'unclustered-count',
        type: 'symbol',
        source: 'locations',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': 1,
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
      });
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }, []);

  return (
    <div className="flex h-screen">
      <div className=" w-3/4 text-left" ref={mapContainer}>
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div className=" w-1/4">divers' list</div>
    </div>
  );
};

export default page;
