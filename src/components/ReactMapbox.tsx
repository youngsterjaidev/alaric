import React, { useState, useEffect, useRef, useContext } from "react";
/* eslint-disable */
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import firebase from "firebase/compat/app";
import { redirectTo, Redirect, useNavigate } from "@reach/router";
import Illustrations from "../assets";
import UserContext from "../UserContext.js";
import SidebarWrapper from "./SidebarWrapper.js";
import MapMarker from "./MapMarker.js";
import ProfileBar from "./ProfileBar.js";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RiUDiskLine, RiBusLine } from "react-icons/ri";

mapboxgl.accessToken =
    "pk.eyJ1IjoidGhlYXYyMSIsImEiOiJjbDI3dWE2aXMwMzRmM2VwMWlzdGFmeGxiIn0.9UVUsbZSUdcPhWQkXRZNrA";

const directions = new MapboxDirections({
    accessToken:
        "pk.eyJ1IjoidGhlYXYyMSIsImEiOiJjbDI3dWE2aXMwMzRmM2VwMWlzdGFmeGxiIn0.9UVUsbZSUdcPhWQkXRZNrA",
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

const options = {
    enableHighAccuracy: true,
    maximumAge: 2000,
    timeout: 2000,
};

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
    const navigate = useNavigate()

    /*
     * Find the coordinates of source and destination of the bus stops
    */
    const _getRouteCoords = async (busNumber) => {
        try {
            let buses = await firebase.firestore().collection("buses").doc(busNumber).get()
            if(!buses.data().exists) { 
                console.log("No buses Found !")
                return
             }
            let routes = await firebase.firestore().collection("routes").doc(buses.data().routes[0]).get()
            if(!routes.data().exists) { 
                console.log("No routes Found !")
                return
             }
            let start = await firebase.firestore().collection("stops").doc(routes.data().source).get()
            if(!start.data().exists) { 
                console.log("No source stops Found !")
                return
             }
            let end = await firebase.firestore().collection("stops").doc(routes.data().destination).get()
            if(!end.data().exists) { 
                console.log("No destination stops Found !")
                return
             }

            _findRoute(start.data().coords, end.data().coords)
        } catch(e) {
            console.log("")
        }
    }

    // Getting routes from database

    const getRouteCoords = async () => {
        try {
            firebase
                .firestore()
                .collection("buses")
                .doc("HP01A1144").get().then(bus => {
                    const routeId = bus.data().routes[0]
                    console.log("Route Id", routeId)
                    firebase.firestore().collection("routes").doc(routeId).get().then(async (route) => {
                        console.log("Route ", route.data())
                        let { source,destination, stops } = route.data()
                        let routesArr = [source, destination]
                        let finalData = []
                        let n = stops.length;
                        console.log("stops lenght", n);

                        // iterate over the array 
                        // stops.map()
                       let stop = await firebase.firestore().collection("stops").doc(routesArr[0]).get()

                        console.log("Midddle Point StopId", stops[6])
                        let stopn= []
                        for(let i = 0;i<n;i++){
                            let response = await firebase.firestore().collection("stops").doc(stops[i]).get()
                            stopn.push([response.data().coordinates[1], response.data().coordinates[0]].toString())
                        }
                        console.log("array of stops", stopn)
                        let finalString = ""

                        for(let i=0;i<stopn.length;i++){
                            finalString += stopn[i] + ";";
                        }
                        console.log("finalstring",finalString)

                        
                            
                             
                       



                        let stop1 = await firebase.firestore().collection("stops").doc(stops[6]).get()

                        let stop2 = await firebase.firestore().collection("stops").doc(routesArr[1]).get()

                        finalData = [stop.data().coordinates, stop2.data().coordinates, stop1.data().coordinates]

                        console.log("Final Another data : ", finalData)

                        // if(finalData.length === 0) {
                        //     console.log("Final Data is empty !", finalData)
                        //     return
                        // }
                        
                        // console.log("Final Data : ", finalData)
                        findRoute(finalData[0], finalData[1],finalData[2], finalString) 
                    })
                })
        } catch(e) {
            console.log("Error Occured while getting the coords of route getRouteCoords fn : ", e)
        }
    }

    //Initialiazing findRoute function
    // Adding starting and ending point


    const findRoute = async (startCoords:[string], endCoords: [string] , midCoords:[string], finalString: string) => {
        // if(!startCoords && !endCoords) {
        //     console.log("Start and end are undefined !")
        //     return
        // }
        console.log("Find coords", startCoords, endCoords)
        try {
            
        // Add starting point to the map
        map.current.addLayer({
            id: 'point',
            type: 'circle',
            source: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                    type: 'Point',
                    coordinates: [startCoords[1], startCoords[0]]
                    }
                }
                ]
            }
            },
            paint: {
            'circle-radius': 12,
            'circle-color': 'blue'
            }
        });

        const mid = {
            type: 'FeatureCollection',
            features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                type: 'Point',
                coordinates: [endCoords[1], endCoords[0]]
                }
            }
            ]
        };
        if (map.current.getLayer('mid')) {
            map.current.getSource('mid').setData(mid);
        } else {
            map.current.addLayer({
            id: 'mid',
            type: 'circle',
            source: {
                type: 'geojson',
                data: {
                type: 'FeatureCollection',
                features: [
                    {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: [midCoords[1], midCoords[0]]
                    }
                    }
                ]
                }
            },
            paint: {
                'circle-radius': 12,
                'circle-color': 'green'
            }
            });
        }
        
        // this is where the code from the next step will go
    
        const end = {
            type: 'FeatureCollection',
            features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                type: 'Point',
                coordinates: [endCoords[1], endCoords[0]]
                }
            }
            ]
        };
        if (map.current.getLayer('end')) {
            map.current.getSource('end').setData(end);
        } else {
            map.current.addLayer({
            id: 'end',
            type: 'circle',
            source: {
                type: 'geojson',
                data: {
                type: 'FeatureCollection',
                features: [
                    {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: [endCoords[1], endCoords[0]]
                    }
                    }
                ]
                }
            },
            paint: {
                'circle-radius': 12,
                'circle-color': '#3887be'
            }
            });
        }
        
        // calling getroute function

        getRoute(startCoords, endCoords,midCoords, finalString);
        } catch(e) {
            console.log("Error Occured while finding the route findRoute fn : ", e)
        }
    }


// Initializing getRoute function 
async function getRoute(start, end, mid, finalString) {
        console.log("Start and end ", start, end , mid)
      // make a directions request using cycling profile
      // an arbitrary start will always be the same
      // only the end or destination will change
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${finalString.substring(0, finalString.length - 1)}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );
      const json = await query.json();
      console.log("json:", json)
      console.log("json : ", json)
      const data = json.routes[0];
      console.log("Geometry :", data)
      const route = data.geometry.coordinates;
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };
      // if the route already exists on the map, we'll reset it using setData
      if (map.current.getSource('route')) {
        map.current.getSource('route').setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': 'red',
            'line-width': 5,
            'line-opacity': 1
          }
        });
      }
      // add turn instructions here at the end
    }

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
                if (snapshot.val()) {
                    let arr = [];
                    Object.keys(snapshot.val()).map((key) => {
                        let data = snapshot.val()[key];
                        arr.push(data);
                    });
                    setMarkers(arr);
                } else {
                    return;
                }
            });
        } catch (e) {
            console.log("Error Occured while checking for new data", e);
        }
    };

    const _addMarkerToMap = (tempMarker) => {
        tempMarker.forEach((marker) => {
            const { longitude, latitude, uid, busNo } = marker.currentLocation;

            var el = document.createElement("div");
            el.className = "custom-marker";
            el.key = uid;

            el.onclick = function () {
                navigate(`/home/${busNo}`, { replace: true })
            }

            store[uid] = new mapboxgl.Marker(el)
                .setLngLat([longitude, latitude])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }).setHTML(
                        `<Link to="/home/HP01A1233">${busNo}</Link>`
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
        if (map.current) return; // initialize map only one
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/theav21/cl27uh0wh001a14o1jtwl7x0t",
            center: [lng, lat],
            zoom: zoom,
        });

        //map.current.addControl(directions, "top-right");

        // add the get location controller 
        map.current.addControl(
            new mapboxgl.GeolocateControl({
            positionOptions: {
            enableHighAccuracy: true
            },
            // When active the map will receive updates to the device's location as it changes.
            trackUserLocation: true,
            // Draw an arrow next to the location dot to indicate which direction the device is heading.
            showUserHeading: true
            })
        );

        //_fetchUserData();

        map.current.on("load", () => {
            _fetchMarkerData();
            _checkForNewData();

            //calling getRouteCoords function

            getRouteCoords();
        });

        return () => {
            map.current.remove();
        };
    }, []);

    useEffect(() => {
        if (map.current) return; // wait for map to initialize
        map.current.on("move", () => {
            setLng(map.current.getCenter());
            setLat(map.current.getCenter());
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    useEffect(() => {
        if (!map.current) return; // initialize map only one
        if (!showMap) {
            map.current.remove();
            // setting a function that watch the position of the user
            // and send to server along the location change with time

            // let watchId = navigator.geolocation.watchPosition(
            //     success,
            //     error,
            //     options
            // );
            // console.log(watchId);
        } else {
            console.log("User have not Permitted!");
        }
    }, [user, showMap]);
    
    

    return (
        <div>
            {/* <SidebarWrapper
                showProfile={showProfile}
                setShowProfile={setShowProfile}
            />
            <ProfileBar
                showProfile={showProfile}
                setShowProfile={setShowProfile}
            /> */}
            {showMap ? (
                <div ref={mapContainer} style={mapStyle}></div>
            ) : (
                <div
                    style={{
                        width: "100%",
                        height: "100vh",
                        background: "#f2f2f2",
                        display: "grid",
                        placeItems: "center",
                    }}
                >
                    <h3>Sending Your Location_</h3>
                </div>
            )}
        </div>
    );
};

export default ReactMapbox;


{/* <div id="map">
    
    </div>
    
    <script>
        
        // TO MAKE THE MAP APPEAR YOU MUST
        // ADD YOUR ACCESS TOKEN FROM
        // https://account.mapbox.com
        mapboxgl.accessToken = 'pk.eyJ1IjoidGhlYXYyMSIsImEiOiJjbDI3dWE2aXMwMzRmM2VwMWlzdGFmeGxiIn0.9UVUsbZSUdcPhWQkXRZNrA';
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/theav21/cl27uh0wh001a14o1jtwl7x0t', // style URL
            center: [77.1745108,31.1048187], // starting position [lng, lat]
            zoom: 12 // starting zoom
        });
    
        const start = [77.1872594,31.0842298];
            // const end = [77.1834765,31.078593];
            
    
            // this is where the code for the next step will go
    
            // create a function to make a directions request
    async function getRoute(end) {
      // make a directions request using cycling profile
      // an arbitrary start will always be the same
      // only the end or destination will change
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };
      // if the route already exists on the map, we'll reset it using setData
      if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#5603AD',
            'line-width': 9,
            'line-opacity': 1
          }
        });
      }
      // add turn instructions here at the end
    }
    
        map.on('load', () => {
        // make an initial directions request that
        // starts and ends at the same location
        getRoute(start);
    
    
        // Add starting point to the map
        map.addLayer({
            id: 'point',
            type: 'circle',
            source: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                    type: 'Point',
                    coordinates: start
                    }
                }
                ]
            }
            },
            paint: {
            'circle-radius': 10,
            'circle-color': '#3887be'
            }
        });
        // getRoute(end);
        
        // this is where the code from the next step will go
    
        const coords = [77.1834765,31.078593];
        const end = {
            type: 'FeatureCollection',
            features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                type: 'Point',
                coordinates: coords
                }
            }
            ]
        };
        if (map.getLayer('end')) {
            map.getSource('end').setData(end);
        } else {
            map.addLayer({
            id: 'end',
            type: 'circle',
            source: {
                type: 'geojson',
                data: {
                type: 'FeatureCollection',
                features: [
                    {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: coords
                    }
                    }
                ]
                }
            },
            paint: {
                'circle-radius': 10,
                'circle-color': '#f30'
            }
            });
        }
        getRoute(coords);
    
    
    
    
        
            }); */}