import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export const users: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [
                    121.555516,
                    22.024495
                ]
            },
            properties: {
                id: "1",
                name: "York",
                phone: "2022347336",
                lastUpdate: "2023/06/16",
                avatar: "https://placehold.co/50x50",
                gender: "male"
            }
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [
                    121.564157,
                    22.017716
                ]
            },
            properties: {
                id: "2",
                name: "Alice",
                phone: "2022347337",
                lastUpdate: "2023/06/16",
                avatar: "https://placehold.co/50x50",
                gender: "female"
            }
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [
                    121.548602,
                    22.021591
                ]
            },
            properties: {
                id: "3",
                name: "John",
                phone: "2022347338",
                lastUpdate: "2023/06/16",
                avatar: "https://placehold.co/50x50",
                gender: "male"
            }
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [
                    121.56436,
                    22.016997
                ]
            },
            properties: {
                id: "4",
                name: "Emily",
                phone: "2022347339",
                lastUpdate: "2023/06/16",
                avatar: "https://placehold.co/50x50",
                gender: "female"
            }
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [
                    120.876263,
                    22.352433
                ]
            },
            properties: {
                id: "5",
                name: "Michael",
                phone: "2022347340",
                lastUpdate: "2023/06/16",
                avatar: "https://placehold.co/50x50",
                gender: "male"
            }
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [
                    120.872968,
                    22.359413
                ]
            },
            properties: {
                id: "6",
                name: "Emma",
                phone: "2022347341",
                lastUpdate: "2023/06/16",
                avatar: "https://placehold.co/50x50",
                gender: "female"
            }
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [
                    120.883305,
                    22.347908
                ]
            },
            properties: {
                id: "7",
                name: "David",
                phone: "2022347342",
                lastUpdate: "2023/06/16",
                avatar: "https://placehold.co/50x50",
                gender: "male"
            }
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [
                    121.535868,
                    25.042042
                ]
            },
            properties: {
                id: "8",
                name: "Olivia",
                phone: "2022347343",
                lastUpdate: "2023/06/16",
                avatar: "https://placehold.co/50x50",
                gender: "female"
            }
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [
                    121.484608,
                    22.666128
                ]
            },
            properties: {
                id: "9",
                name: "Daniel",
                phone: "2022347344",
                lastUpdate: "2023/06/16",
                avatar: "https://placehold.co/50x50",
                gender: "male"
            }
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [
                    121.485434,
                    22.655202
                ]
            },
            properties: {
                id: "10",
                name: "Sophia",
                phone: 2022347345,
                lastUpdate: "2023/06/16",
                avatar: "https://placehold.co/50x50",
                gender: "female"
            }
        },
        {
            type: "Feature",
            properties: {
                id: 11,
                name: "Sasha",
                phone: 2022347345,
                lastUpdate: 2022347345,
                avatar: 2022347345,
                gender: 2022347345
            },
            geometry: {
                coordinates: [
                    120.6415229544084,
                    24.15887698904679
                ],
                type: "Point"
            }
        }
    ]
}