import React, { useState, useEffect, useContext } from "react";
import ReactMapboxGl, { Marker, Layer, Feature, Popup } from "react-mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions"
import firebase from "firebase/app";
import styled from "styled-components";
import { Redirect, navigate, Router } from "@reach/router";
import { HiOutlineLogout } from "react-icons/hi";
import MoonLoader from "react-spinners/MoonLoader";
import UserContext from "../UserContext.js";
import ProfileBar from "./ProfileBar";
//import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'

//const worker = new Worker('./worker.js')

//mapbox.workerClass = MapboxWorker
import SidebarWrapper from "./SidebarWrapper";

const Directions =  new MapboxDirections({
    accessToken: "pk.eyJ1IjoiamFpZGV2djk5OSIsImEiOiJja25vcHhkNjExYmR4MnZwcmU3MG9wd2hlIn0.YV5iqi1TiI1nSWQd-bQBmA",
    unit: "metric",
    profile: "mapbox/cycling"
})

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

const Container = styled.div`
    width: 100%;
    height: 100vh;
    display: grid;
    place-items: center;
`

const ReactMapbox = () => {
    const user = useContext(UserContext);
    const [userInfo, setUserInfo] = useState({});
    const [showPopup, togglePopup] = useState(true);
    const [showProfile, setShowProfile] = useState(false);
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
    });

    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        console.log("The User of User Context", user);

        if (!user) {
            navigate("/login");
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
                    /*setInterval(() => {
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
                    }, 1000);*/
                } else {
                    console.log("The Snapshot is null");
                }
            });
    }, []);

    useEffect(() => {
        firebase
            .firestore()
            .collection("accounts")
            .where("uid", "==", user.uid)
            .onSnapshot((snap) => {
                snap.docChanges().forEach((d) => {
                    setUserInfo(d.doc.data())
                    if (d.doc.data().type === "driver") {
                        // run the interval function
                        setInterval(() => {
                            navigator.geolocation.getCurrentPosition((e) => {
                                firebase
                                    .database()
                                    .ref()
                                    .child("location")
                                    .child(
                                        user.uid ||
                                        firebase.auth().currentUser.uid
                                    )
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
                    } else {
                    }
                });
            });
    }, []);
    /*useEffect(() => {
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
        <div>
            <SidebarWrapper
                markers={markers}
                showProfile={showProfile}
                setShowProfile={setShowProfile}
            />
            <ProfileBar
                showProfile={showProfile}
                setShowProfile={setShowProfile}
            />
            {userInfo.type === "driver" ? (
                <Container>
                    <h2>We are sending Your Location !</h2>
                </Container>
            ) : (<Map
                style="mapbox://styles/mapbox/dark-v10"
                containerStyle={{
                    height: "100vh",
                    width: "100%",
                }}
                center={[location.longitude, location.latitude]}
                movingMethod="jumpTo"
            >
                <Directions />
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
            </Map>)}
        </div>
    );
};

export default ReactMapbox;
