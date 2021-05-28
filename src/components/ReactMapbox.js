import React, { useState, useEffect, useRef, useContext } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import firebase from "firebase/app";
import { navigate } from "@reach/router";
import Illustrations from "../assets";
import UserContext from "../UserContext.js";
import SidebarWrapper from "./SidebarWrapper.js";
import MapMarker from "./MapMarker.js";
import ProfileBar from "./ProfileBar.js";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

mapboxgl.accessToken =
    "pk.eyJ1IjoiamFpZGV2djk5OSIsImEiOiJja25vcHhkNjExYmR4MnZwcmU3MG9wd2hlIn0.YV5iqi1TiI1nSWQd-bQBmA";

const directions = new MapboxDirections({
    accessToken:
        "pk.eyJ1IjoiamFpZGV2djk5OSIsImEiOiJja25vcHhkNjExYmR4MnZwcmU3MG9wd2hlIn0.YV5iqi1TiI1nSWQd-bQBmA",
    unit: "metric",
    profile: "mapbox/driving",
});

const mapStyle = {
    width: "100%",
    height: "100vh",
};

const bounds = [
    [75.90455, 31.53205],
    [78.05479, 30.43056],
];

const store = {};

const ReactMapbox = () => {
    const user = useContext(UserContext);
    const [userData, setUserData] = useState({});
    const [showProfile, setShowProfile] = useState(false);
    const [showMap, setShowMap] = useState(true);
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(77.17);
    const [lat, setLat] = useState(31.1);
    const [zoom, setZoom] = useState(13);
    const [currentLocation, setCurrentLocation] = useState({});
    const [uid, setUid] = useState("");
    const [markers, setMarkers] = useState([
        { currentLocation: { longitude: 30.5, latitude: 50.5 } },
    ]);

    const _fetchUserData = async () => {
        try {
            const dbRef = await firebase
                .firestore()
                .collection("accounts")
                .doc(user.uid);
            const snap = await dbRef.get();
            setUserData(snap.data());
            if (snap.data().type === "driver") {
                setShowMap(false);
            } else {
                setShowMap(true);
            }
        } catch (e) {
            console.log("Error Occured while fetching the user Data", e);
        }
    };

    const _checkForNewData = () => {
        try {
            const dbRef = firebase.database().ref().child("location");
            dbRef.on("value", (snapshot) => {
                let arr = [];
                Object.keys(snapshot.val()).map((key) => {
                    let data = snapshot.val()[key];
                    arr.push(data);
                });
                setMarkers(arr);
            });
        } catch (e) {
            console.log("Error Occured while checking for new data", e);
        }
    };

    const _addMarkerToMap = (tempMarker) => {
        tempMarker.forEach((marker) => {
            const { longitude, latitude, uid } = marker.currentLocation;
            store[uid] = new mapboxgl.Marker({
                draggable: true,
            })
                .setLngLat([longitude, latitude])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }).setHTML(
                        "<h3>" + uid + "</h3><p>" + uid + "</p>"
                    )
                )
                .addTo(map.current);

            console.log(store[uid]);
        });
    };

    const _fetchMarkerData = async () => {
        // fetch Marker data from firebase
        let newArr = [];

        try {
            const dbRef = firebase.database().ref().child("location");
            const snapshot = await dbRef.get();
            if (snapshot.exists()) {
                Object.keys(snapshot.val()).map((key) => {
                    let data = snapshot.val()[key];
                    newArr.push(data);
                    return data;
                });
                setMarkers(newArr);
                _addMarkerToMap(newArr);
                return;
            } else {
                console.log("No Data is availabe");
                return;
            }
        } catch (e) {
            console.log(
                "Error Occured while fetching data from firestore :",
                e
            );
        }
    };

    useEffect(() => {
        if (Object.keys(store).length === 0) {
            return;
        } else {
            markers.forEach((marker) => {
                console.log("Hit That function ");
                const { longitude, latitude, uid } = marker.currentLocation;
                let myMarker = store[uid];

                myMarker.remove();
                myMarker.setLngLat([longitude, latitude]).addTo(map.current);
            });
        }
    }, [markers]);

    useEffect(() => {
        if (!user) navigate("/");
        if (map.current) return; // initialize map only one
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v9",
            center: [lng, lat],
            zoom: zoom,
        });

        map.current.addControl(directions, "top-right");

        _fetchUserData();

        map.current.on("load", () => {
            _fetchMarkerData();
            _checkForNewData();
        });
    }, []);

    useEffect(() => {
        if (map.current) return; // wait for map to initialize
        map.current.on("move", () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    useEffect(() => {
        if (map.current) return; // initialize map only one
        if (!showMap) {
            map.current.remove();
            setInterval(async () => {
                try {
                    await navigator.geolocation.getCurrentPosition((e) => {
                        firebase
                            .database()
                            .ref()
                            .child("location")
                            .child(user.uid)
                            .set(
                                {
                                    currentLocation: {
                                        latitude: e.coords.latitude,
                                        longitude: e.coords.longitude,
                                        uid: user.uid,
                                    },
                                },
                                (err) => {
                                    if (err) {
                                        console.log(
                                            "Error Occured while register the information ",
                                            err
                                        );
                                    } else {
                                        console.log(
                                            "Location send successfully !"
                                        );
                                    }
                                }
                            );
                    });
                } catch (e) {
                    console.log(
                        "Error Occured while sending the location !",
                        e
                    );
                }
            }, 5000);
        } else {
            console.log("User have not Permitted!");
        }
    }, [showMap]);

    return (
        <div>
            <SidebarWrapper
                showProfile={showProfile}
                setShowProfile={setShowProfile}
            />
            <ProfileBar
                showProfile={showProfile}
                setShowProfile={setShowProfile}
            />
            {showMap ? (
                <div ref={mapContainer} style={mapStyle}></div>
            ) : (
                <div style={{
                    width: "100%",
                    height: "100vh",
                    background: "#f2f2f2",
                    display: "grid",
                    placeItems: "center",
                }}>
                    <h3>Sending Your Location_</h3>
                </div>
            )}
        </div>
    );
};

export default ReactMapbox;
