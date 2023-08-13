'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useImmer } from 'use-immer';
import { useAuthStore } from '@/store/authStore';

import DatePicker from 'react-datepicker';
import mapboxgl from 'mapbox-gl';
import 'react-datepicker/dist/react-datepicker.css';

import formatDate from '../utils/formatDate';
import startEndToTimecodes from '../utils/startEndToTimecodes';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const filterFeaturesByDateRange = (data, dateRange) => {
  const [startTimestamp, endTimestamp] = dateRange;

  const filteredFeatures = data.filter((feature) => {
    const { startTime, endTime } = feature.properties;

    if (
      (startTime >= startTimestamp && startTime <= endTimestamp) ||
      (endTime >= startTimestamp && endTime <= endTimestamp)
    ) {
      return true;
    }
  });

  return filteredFeatures;
};

const Page = () => {
  const router = useRouter();
  const [authUser] = useAuthStore((state) => [state.authUser]);

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef(null) as mapboxgl;

  const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(lastDayOfYear);
  const [dateRange, setDateRange] = useState<number[] | null>(
    startEndToTimecodes([new Date(), lastDayOfYear])
  );

  const originalGeoData = useRef();
  const [filteredGeo, setFilteredGeo] = useImmer(null);
  const [bounds, setBounds] = useState();

  const datePickerRef = useRef(null);
  const [datePickerContainerHeight, setDatePickerContainerHeight] = useState<number>();

  useEffect(() => {
    if (!authUser) router.push('/login');
  }, []);

  useEffect(() => {
    if (!authUser) return;

    fetch(`api/get-locations/${authUser}`)
      .then((res) => res.json())
      .then((data) => data)
      .then((geoJSON) => {
        // FIXME: 排序要拉到firebase做，可以減少user取回資料後都要重排，提高效能
        const updatedFeatures = {
          ...geoJSON.data,
          features: geoJSON.data.features
            .filter(
              (feature) =>
                feature.properties.startTime >= startDate || feature.properties.endTime >= endDate
            )
            .sort((a, b) => a.properties.startTime - b.properties.startTime),
        };
        setFilteredGeo(updatedFeatures);
        originalGeoData.current = updatedFeatures;
      });

    // 高度 +2 是為了讓UI初始化比較流暢
    setDatePickerContainerHeight(datePickerRef.current.offsetHeight + 2);
  }, [authUser]);

  useEffect(() => {
    const source = map.current?.getSource('locations');
    if (source) {
      source.setData(filteredGeo);
    }
  }, [filteredGeo]);

  useEffect(() => {
    setFilteredGeo((draft) => {
      if (originalGeoData.current) {
        const mapUpdate = originalGeoData.current.features.filter((data) =>
          bounds?.contains(data.geometry.coordinates)
        );
        const dateUpdate = filterFeaturesByDateRange(mapUpdate, dateRange);

        draft.features = dateUpdate;
      }
    });
  }, [bounds, dateRange]);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLElement,
      style: 'mapbox://styles/mapbox/light-v11',
      attributionControl: false,
      center: [120.8937, 23.1956],
      zoom: 7,
    });

    map.current?.on('load', () => {
      map.current?.addLayer({
        id: 'locations',
        type: 'circle',
        source: {
          type: 'geojson',
          data: filteredGeo,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        },
      });

      map.current?.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'locations',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': ['step', ['get', 'point_count'], '#FFF', 0, '#ff8b37'],
          'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
        },
      });

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
      const features = map.current?.queryRenderedFeatures(event.point, {
        layers: ['locations'],
      });

      if (!features.length) return;

      const clickedPoint = features[0];

      flyToUser(clickedPoint);
    });

    const flyToUser = (currentFeature) => {
      map.current?.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 9.7,
      });
    };
  });

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (end) {
      setDateRange(startEndToTimecodes(dates));
    }
  };

  const datePickerContainerTransition = () => {
    setDatePickerContainerHeight(datePickerRef.current.offsetHeight);
  };

  return (
    <div className="flex h-[calc(100vh_-_5rem)] w-full">
      <link
        rel="stylesheet"
        href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css"
      />
      <div className="grow" ref={mapContainer}></div>
      <div className=" h-screenoverflow-scroll absolute bottom-0 top-0 w-full bg-white md:static md:w-1/4 md:min-w-fit md:overflow-scroll">
        {/* divers' list */}
        <div
          className="sticky top-[5rem] h-fit border-b-2 bg-white shadow-md md:sticky md:top-0"
          style={{
            height: `${datePickerContainerHeight}px`,
            minHeight: `${datePickerContainerHeight}px`,
            maxHeight: `${datePickerContainerHeight}px`,
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <div ref={datePickerRef}>
            <DatePicker
              onMonthChange={datePickerContainerTransition}
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              minTime={new Date(new Date().setHours(0, 0, 0, 0))}
              selectsRange
              inline
            />
          </div>
        </div>
        {filteredGeo &&
          filteredGeo.features?.map((feature, index) => {
            return (
              <div key={index} className="m-2 border border-gray-50 p-3 shadow-md">
                <div className="flex items-center gap-3 border-b py-2">
                  <Image
                    width={80}
                    height={80}
                    quality={100}
                    src={feature.properties.avatar}
                    alt="avatar"
                    className="rounded-full border"
                  />
                  <div>
                    <Link href={`/profile/${feature.properties.userID}`}>
                      <div className="text-xl font-medium text-moonlight-900 hover:text-moonlight-400">
                        {feature.properties.name}
                      </div>
                    </Link>
                    <Link href={`/messages/${feature.properties.userID}`}>
                      <button className="mt-1 w-16 rounded-sm border border-moonlight-200 py-1 text-sm text-moonlight-600 hover:bg-moonlight-200 hover:transition-all">
                        發送訊息
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="flex">
                  <div className="py-2">
                    <div className="text-moonlight-700">{feature.properties.eventTitle}</div>
                    <div className="text-moonlight-950">
                      {formatDate(feature.properties.startTime)}~
                      {formatDate(feature.properties.endTime)}
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
