'use client';

import { useEffect, useRef, useState } from 'react';
import { useImmer } from 'use-immer';
import mapboxgl from 'mapbox-gl';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import formatDate from '../utils/formatDate';
import startEndToTimecodes from '../utils/startEndToTimecodes';
import Image from 'next/image';
import Link from 'next/link';

mapboxgl.accessToken = 'pk.eyJ1IjoiamVmb2RvYjM0OCIsImEiOiJjbGl3dDBwZWUwMTBhM2dudXRydjZxdDlmIn0.8ETyiwSlhW9BwT7ObaZ3dw';

// 依照日期filter新結果
const filterFeaturesByDateRange = (data, dateRange) => {
  const [startTimestamp, endTimestamp] = dateRange;

  const filteredFeatures = data.filter((feature) => {
    const { startTime, endTime } = feature.properties;

    // 只要資料的startTime或是endTime任何一者在日期區間即符合條件
    if ((startTime >= startTimestamp && startTime <= endTimestamp) || (endTime >= startTimestamp && endTime <= endTimestamp)) {
      return true;
    }
  });

  return filteredFeatures;
};

const Page = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef(null) as mapboxgl;
  const userID = 'rGd4NQzBRHgYUTdTLtFaUh8j8ot1';

  const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(lastDayOfYear);
  const [dateRange, setDateRange] = useState<number[] | null>(startEndToTimecodes([new Date(), lastDayOfYear]));

  const originalGeoData = useRef();
  const [filteredGeo, setFilteredGeo] = useImmer(null);
  const [bounds, setBounds] = useState();

  // 取資料的effect
  useEffect(() => {
    fetch(`api/get-locations/${userID}`)
      .then((res) => res.json())
      .then((data) => data)
      .then((geoJSON) => {
        // 活動的開始、結束時段，只要跟篩選的頭尾有重疊都會顯示，因為可以只參加幾天
        // 資料篩選不在firebase做的原因：因為不能多個>=這種判斷在單一query，那就全部取回篩因為要包含頭尾，如果只取>startTime，那startTime在之前，但尚未結束的活動會被篩掉
        // FIXME: 排序要拉到firebase做，可以減少user取回資料後都要重排，提高效能
        const updatedFeatures = {
          ...geoJSON.data,
          features: geoJSON.data.features
            .filter((feature) => feature.properties.startTime >= startDate || feature.properties.endTime >= endDate)
            .sort((a, b) => a.properties.startTime - b.properties.startTime),
        };
        // [...events].sort((a, b) => a.startTime - b.startTime)
        setFilteredGeo(updatedFeatures);
        originalGeoData.current = updatedFeatures;
      })
      .then(console.log('got GeoJSON'));
  }, []);

  // 資料取回來後會出發filteredGeo更新，在這邊就把map source更新
  useEffect(() => {
    const source = map.current?.getSource('locations');
    if (source) {
      source.setData(filteredGeo);
    }
  }, [filteredGeo]);

  // 透過bounds 從原始資料篩新的filteredGeo
  useEffect(() => {
    setFilteredGeo((draft) => {
      if (originalGeoData.current) {
        const mapUpdate = originalGeoData.current.features.filter((data) => bounds?.contains(data.geometry.coordinates));
        const dateUpdate = filterFeaturesByDateRange(mapUpdate, dateRange);

        draft.features = dateUpdate;
      }
    });
    console.log('[dateRange,bounds] effect');
  }, [bounds, dateRange]);

  // 隨時都在更新的圖面
  // 其他功能性在這邊config
  // on move監聽bounds在這邊綁的，把即時的bounds存到state中去影響depens 是bounds的effect
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLElement,
      style: 'mapbox://styles/mapbox/light-v11',
      attributionControl: false,
      center: [120.8937, 23.1956],
      zoom: 7,
      // pitch: 31,
      // bearing: -7.7,
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
          'circle-color': ['step', ['get', 'point_count'], '#FFF', 0, '#ff8b37'],
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
          'circle-color': '#ff8b37',
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
      // createPopUp(clickedPoint);
      // 這邊先關掉不要有popup 因為也沒實際資料可以顯示
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

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    // 有點選結束時間才取dateRange
    if (end) {
      setDateRange(startEndToTimecodes(dates));
    }
  };

  return (
    <div className="flex h-[calc(100vh_-_5rem)] w-full">
      <link rel="stylesheet" href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" />
      <div className="grow" ref={mapContainer}></div>
      <div className=" h-screenoverflow-scroll absolute bottom-0 top-0 w-full bg-white md:static md:w-1/4 md:min-w-fit md:overflow-scroll">
        {/* divers' list */}
        <div className="sticky top-[5rem] border-b-2 bg-white shadow-md md:sticky md:top-0">
          <DatePicker selected={startDate} onChange={onChange} startDate={startDate} endDate={endDate} minDate={new Date()} minTime={new Date(new Date().setHours(0, 0, 0, 0))} selectsRange inline />
        </div>
        {filteredGeo &&
          filteredGeo.features?.map((feature, index) => {
            return (
              <div key={index} className="m-2 border border-gray-50 p-3 shadow-md">
                <div className="flex items-center gap-3 border-b py-2">
                  <Image width={80} height={80} quality={100} src={feature.properties.avatar} alt="avatar" className="rounded-full border" />
                  <div>
                    <Link href={`/profile/${feature.properties.userID}`}>
                      <div className="text-xl font-medium text-moonlight-900 hover:text-moonlight-400">{feature.properties.name}</div>
                    </Link>
                    <Link href={`/messages/${feature.properties.userID}`}>
                      <button className="mt-1 w-16 rounded-sm border border-moonlight-200 py-1 text-sm text-moonlight-600 hover:bg-moonlight-200 hover:transition-all">發送訊息</button>
                    </Link>
                  </div>
                </div>
                <div className="flex">
                  <div className="py-2">
                    <div className="text-moonlight-700">{feature.properties.eventTitle}</div>
                    <div className="text-moonlight-950">
                      {formatDate(feature.properties.startTime)}~{formatDate(feature.properties.endTime)}
                    </div>
                  </div>
                  <div className="ml-auto flex items-end">
                    <Link
                      href={`/details/${feature.properties.eventID}`}
                      className="mb-3 w-full min-w-[100px] rounded-sm border border-transparent bg-sunrise-400 px-4 py-2 font-semibold text-white transition-all hover:border hover:border-sunrise-500 hover:bg-white hover:text-sunrise-500 hover:shadow-md"
                    >
                      查看活動
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Page;
