import React, { useState, useEffect, useContext } from "react";
import ReactMapboxGl, { Marker, Layer, Feature, Popup } from "react-mapbox-gl";
import firebase from "firebase/app";

import { Redirect } from "@reach/router";

import UserContext from "../UserContext.js";
//import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'

//const worker = new Worker('./worker.js')

//mapbox.workerClass = MapboxWorker
const Map = ReactMapboxGl({
    accessToken:
        "pk.eyJ1IjoiamFpZGV2djk5OSIsImEiOiJja25vcHhkNjExYmR4MnZwcmU3MG9wd2hlIn0.YV5iqi1TiI1nSWQd-bQBmA",
});

const locationStyle = {
    backgroundColor: "green",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    border: "4px solid lightgreen",
};

const markStyle = {
    backgroundColor: "#e74c3c",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    border: "4px solid #eaa29b",
};

const ReactMapbox = () => {
    const user = useContext(UserContext);
    const [showPopup, togglePopup] = useState(true);
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
    });

    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        console.log("The User of User Context", user);

        if (!user) {
            <Redirect to="/login" noThrow />;
        }
        navigator.geolocation.getCurrentPosition((e) => {
            setLocation({
                longitude: e.coords.longitude,
                latitude: e.coords.latitude,
            });
        });
    }, []);

    useEffect(() => {
        firebase
            .database()
            .ref("location")
            .on("value", async (snapshot) => {
                if (snapshot.val() !== null) {
                    const result = await Object.keys(snapshot.val()).map(
                        (key) => snapshot.val()[key]
                    );
                    setMarkers(result);
                    setInterval(() => {
                        navigator.geolocation.getCurrentPosition((e) => {
                            firebase
                                .database()
                                .ref()
                                .child("location")
                                .child(
                                    user.uid || firebase.auth().currentUser.uid
                                )
                                .set(
                                    {
                                        currentLocation: {
                                            longitude: e.coords.longitude,
                                            latitude: e.coords.latitude,
                                            email: user.email,
                                            uid: user.uid
                                        },
                                    },
                                    (err) => {
                                        if (err) {
                                            console.log(
                                                "Error Occured while sending the location !",
                                                err
                                            );
                                        } else {
                                            console.log("Location send !");
                                        }
                                    }
                                );
                        });
                    }, 1000);
                } else {
                    console.log("The Snapshot is null");
                }
            });
    }, []);

    /*
    useEffect(() => {
        setInterval(() => {
            navigator.geolocation.getCurrentPosition((e) => {
                firebase
                    .database()
                    .ref()
                    .child("location")
                    .child(user.uid || firebase.auth().currentUser.uid)
                    .set(
                        {
                            currentLocation: {
                                longitude: e.coords.longitude,
                                latitude: e.coords.latitude,
                            },
                        },
                        (err) => {
                            if (err) {
                                console.log(
                                    "Error Occured while sending the location !",
                                    err
                                );
                            } else {
                                console.log("Location send !");
                            }
                        }
                    );
            });
        }, 1000);
    }, []);*/

    return (
        <Map
            style="mapbox://styles/mapbox/streets-v8"
            containerStyle={{
                height: "100vh",
                width: "100%",
            }}
            center={[location.longitude, location.latitude]}
            movingMethod="jumpTo"
        >
            <Marker coordinates={[location.longitude, location.latitude]}>
                <div style={locationStyle}></div>
            </Marker>
            {markers.map((m, index) => (
                <>
                    <Marker
                        key={index}
                        coordinates={[
                            m.currentLocation.longitude,
                            m.currentLocation.latitude,
                        ]}
                    >
                        <div style={markStyle}></div>
                    </Marker>
                    <Popup
                        coordinates={[
                            m.currentLocation.longitude,
                            m.currentLocation.latitude,
                        ]}
                    >
                        <div>{m.currentLocation.email}</div>
                    </Popup>
                </>
            ))}
        </Map>
    );
};

export default ReactMapbox;
