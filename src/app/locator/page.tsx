'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { users } from './mockUsers';
import { features } from 'process';
import { useImmer } from 'use-immer';
import Link from 'next/link';

mapboxgl.accessToken = 'pk.eyJ1IjoiamVmb2RvYjM0OCIsImEiOiJjbGl3dDBwZWUwMTBhM2dudXRydjZxdDlmIn0.8ETyiwSlhW9BwT7ObaZ3dw';

const page = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef(null) as mapboxgl;
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';

  const originalGeoData = useRef();
  const [filteredGeo, setFilteredGeo] = useImmer(users);
  const [bounds, setBounds] = useState();

  // 取資料的effect
  useEffect(() => {
    fetch(`api/get-locations/${userID}`)
      .then((res) => res.json())
      .then((data) => data)
      .then((geoJSON) => {
        setFilteredGeo(geoJSON.data);
        originalGeoData.current = geoJSON.data;
      })
      .then(console.log('got GeoJSON'));
  }, []);

  // 資料取回來後會出發filteredGeo更新，在這邊就把map source更新
  useEffect(() => {
    const source = map.current?.getSource('locations');
    if (source) {
      console.log('filteredGeo effect hit');
      source.setData(filteredGeo);
    }
  }, [filteredGeo]);

  // 透過bounds 從原始資料篩新的filteredGeo
  useEffect(() => {
    setFilteredGeo((draft) => {
      if (originalGeoData.current) {
        const updatedList = originalGeoData.current.features.filter((data) => bounds?.contains(data.geometry.coordinates));
        draft.features = updatedList;
      }
    });
  }, [bounds]);

  // 隨時都在更新的圖面
  // 其他功能性在這邊config
  // on move監聽bounds在這邊綁的，把即時的bounds存到state中去影響depens 是bounds的effect
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
          data: filteredGeo,
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
      setBounds(map.current.getBounds());
    });

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
  });

  return (
    <div className="flex h-screen">
      <link rel="stylesheet" href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" />
      <div className=" w-3/4 text-left" ref={mapContainer}></div>
      <div className=" w-1/4">
        {/* divers' list */}
        {filteredGeo && filteredGeo.features?.map((user, index) => <div key={index}>{user.properties.name}</div>)}
      </div>
    </div>
  );
};

export default page;
