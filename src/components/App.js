import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import firebase from "firebase/app";
//import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'

//const worker = new Worker('./worker.js')

//mapbox.workerClass = MapboxWorker
mapboxgl.accessToken =
    "pk.eyJ1IjoiamFpZGV2djk5OSIsImEiOiJja25vcHhkNjExYmR4MnZwcmU3MG9wd2hlIn0.YV5iqi1TiI1nSWQd-bQBmA";

const tMapStyle = {
    position: "absolute",
    top: 0,
    right: 0,
    lelft: 0,
    bottom: 0,
    width: "100%",
    height: "100vh",
};

let map;
let geolocate;
let locationMarker;

let marker1 = new mapboxgl.Marker();
let marker2 = new mapboxgl.Marker();

const App = () => {
    const mapContainer = useRef();
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    const [zoom, setZoom] = useState(2);
    const [presentLocation, setPresentLocation] = useState({
        longitude: 0,
        latitude: 0,
    });
    const [markers, setMarkers] = useState([]);

    // send location to the server
    const sendUserLocation = () => {
        setInterval(() => {
            console.log("sending");
            navigator.geolocation.getCurrentPosition((e) => {
                console.log("------", e.coords);
                firebase
                    .database()
                    .ref()
                    .child("web")
                    .child("location")
                    .set(
                        {
                            currentLocation: {
                                latitude: e.coords.latitude,
                                longitude: e.coords.longitude,
                                time: Math.random(),
                            },
                        },
                        (err) => {
                            if (err) {
                                console.log(
                                    "Error occured while sending the location",
                                    err
                                );
                            } else {
                                console.log("Location is send");
                            }
                        }
                    );
            });
        }, 10000);
    };

    // initialze the map before render and react create element that contain map
    /*useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current, // reference where the map will be shows
            style: "mapbox://styles/mapbox/streets-v11",
            center: [lng, lat],
            zoom: zoom,
        });

        let bounds = [
            [76.2188, 31.2674],
            [77.1743, 31.229],
        ];

        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true,
            },
            trackingUserLocation: true,
            trackUserLocation: true,
            showAccuracyCircle: false,
            showUserLocation: true,
        });

        firebase
            .database()
            .ref()
            .child("web")
            .child("location")
            .on("value", (snap) => {
                console.log("The value from the firebase", snap.val());
            });
            
        sendUserLocation();

        map.on("load", () => {
            // no need the press the  uselocation button
            geolocate.trigger();
        });

        geolocate.on("geolocate", (e) => {
            console.log("On geo Locate", e);
            //setLng(e.coords.longitude);
            //setLat(e.coords.latitude);
            //map.flyTo({ center: [e.coords.longitude, e.coords.latitude], zoom: 9})
            //navigator.geolocation.getCurrentPosition((e) => {
                /*firebase.database().ref().child("web").child("location").set({
                    currentLocation: {
                        latitude: e.coords.latitude,
                        longitude: e.coords.longitude,
                        timestamp: e.timestamp
                    }
                }, err => {
                    if(err) {
                        console.log("Error comes")
                    } else {
                        console.log("Hurry ! Location send")
                    }
                })*/
    /*map.flyTo({
                    center: [e.coords.longitude, e.coords.latitude],
                    zoom: 15,
                });
            //});
        });

        //map.setMaxBounds(bounds)

        map.addControl(geolocate);

        map.on("move", () => {
            setLng(map.getCenter().lng.toFixed(4));
            setLat(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        });

        return () => map.remove();
    }, []);*/

    const callWebWorker = () => {
        //worker.postMessage({ state: true })
    };

    const initialzeMap = async () => {
        try {
            var map = await new mapboxgl.Map({
                container: mapContainer.current, // reference where the map will be shows
                style: "mapbox://styles/mapbox/streets-v11",
                center: [lng, lat],
                zoom: zoom,
            });
            var geolocate = await new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackingUserLocation: true,
                trackUserLocation: true,
                showAccuracyCircle: false,
                showUserLocation: true,
            });

            //var marker = new mapboxgl.Marker();

            /*await firebase
                .database()
                .ref()
                .child("web")
                .child("location")
                .on("value", (snap) => {
                    console.log("The value from the firebase", snap.val());
                    setPresentLocation(snap.val().currentLocation);

                    marker.setLngLat([
                        snap.val().currentLocation.longitude,
                        snap.val().currentLocation.latitude,
                    ]);

                    marker.addTo(map);
                });*/

            //marker.addTo(map);

            await firebase
                .database()
                .ref("location")
                .on("value", (snapshot) => {
                    if (snapshot.val() !== null) {
                        const result = Object.keys(snapshot.val()).map(
                            (key) => {
                                new mapboxgl.Marker()
                                    .setLngLat([
                                        snapshot.val()[key].currentLocation
                                            .longitude,
                                        snapshot.val()[key].currentLocation
                                            .latitude,
                                    ])
                                    .addTo(map);
                            }
                        );
                    } else {
                        console.log("The Snapshot is null");
                    }
                });

            /*function animateMarker(timestamp) {
            
            firebase
            .database()
            .ref()
            .child("web")
            .child("location")
            .on("value", (snap) => {
                console.log("------------------------------ ", snap.val());
                marker.setLngLat([
                    snap.val().currentLocation.longitude,
                    snap.val().currentLocation.latitude
                ])
            });

                marker.setLngLat([
                    presentLocation.longitude,
                    presentLocation.latitude
                ])
                

                marker.addTo(map)

                requestAnimationFrame(animateMarker)
            }*/

            map.on("load", () => {
                // no need the press the  uselocation button
                console.log("Map is loading");
                geolocate.trigger();
            });

            geolocate.on("geolocate", (e) => {
                console.log("On geo Locate", e);
                //setLng(e.coords.longitude);
                //setLat(e.coords.latitude);
                //map.flyTo({ center: [e.coords.longitude, e.coords.latitude], zoom: 9})
                map.flyTo({
                    center: [e.coords.longitude, e.coords.latitude],
                    zoom: 15,
                });
            });

            map.addControl(geolocate);

            map.on("move", () => {
                setLng(map.getCenter().lng.toFixed(4));
                setLat(map.getCenter().lat.toFixed(4));
                setZoom(map.getZoom().toFixed(2));
            });

            //requestAnimationFrame(animateMarker)
        } catch (e) {
            console.log("Error Occured", e);
        }
    };

    useEffect(() => {
        console.log("Effect start");

        map = new mapboxgl.Map({
            container: mapContainer.current, // reference where the map will be shows
            style: "mapbox://styles/mapbox/streets-v11",
            center: [lng, lat],
            zoom: zoom,
        });

        geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true,
            },
            trackingUserLocation: true,
            trackUserLocation: true,
            showAccuracyCircle: false,
            showUserLocation: true,
        });

        console.log("Effect End");

        return () => map.remove();
    }, []);

    useEffect(() => {
        console.log("Effect two");

        locationMarker = new mapboxgl.Marker({
            color: "red",
        });

        navigator.geolocation.getCurrentPosition((e) => {
            setPresentLocation({
                latitude: e.coords.latitude,
                longitude: e.coords.longitude,
            });
        });

        firebase
            .database()
            .ref("location")
            .on("value", async (snapshot) => {
                if (snapshot.val() !== null) {
                    const result = await Object.keys(snapshot.val()).map(
                        (key) => snapshot.val()[key]
                    );

                    setMarkers(result);

                    marker1.setLngLat([
                        result[0].currentLocation.longitude,
                        result[0].currentLocation.latitude
                    ]).addTo(map)

                    marker2.setLngLat([
                        result[1].currentLocation.longitude,
                        result[1].currentLocation.latitude
                    ]).addTo(map)
                } else {
                    console.log("The Snapshot is null");
                }
            });

    }, []);

    useEffect(() => {
        console.log("Effect Three");
        locationMarker
            .setLngLat([presentLocation.longitude, presentLocation.latitude])
            .addTo(map);
    }, [presentLocation]);

    return (
        <div>
            <div style={tMapStyle} ref={mapContainer}></div>
        </div>
    );
};

export default App;
