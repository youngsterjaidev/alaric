import React, { useRef, useEffect, useState } from "react";
// @ts-ignore
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import styled from "styled-components";
import { navigate, Router } from "@reach/router";
import { useAuth } from "../../custom-hooks";
import { rdb } from "../../firebase";
import { ref, onValue, get } from "firebase/database";
import { Location } from "../../types/firebase";
import { Dropdown, Input, Button } from "../elements";
import { useFindStops } from "../../custom-hooks";
import { Sidebar } from "./Sidebar/Sidebar"
import axios from "axios";

interface MarkerOptions {
  isStop?: boolean | undefined;
  isBus?: boolean | undefined;
}

mapboxgl.accessToken =
  "pk.eyJ1IjoidGhlYXYyMSIsImEiOiJjbDI3dWE2aXMwMzRmM2VwMWlzdGFmeGxiIn0.9UVUsbZSUdcPhWQkXRZNrA";

const Map = styled.div`
  width: 100%;
  height: 100vh;
`;

const Container = styled.div<{ containerHeight: string }>`
  z-index: 4;
  position: fixed;
  top: 10px;
  left: 10px;
  width: 37%;
  height: 80vh;
  border-radius: 0.5rem;
  background: ${(props) => props.theme.__background};
  color: ${(props) => props.theme.__textColor};
  box-shadow: 0px 0px 20px 3px #00000069;

  @media (max-width: 550px) {
    top: ${props => props.containerHeight};
    width: 98%;
    margin: auto;
    border-radius: 1rem 1rem 0 0;
    bottom: 0;
    right: 0;
    height: auto;
    left: 0;
  }
`;

const Panel = styled.div`
  padding: 1rem;
  display: flex;
  height: 3vh;
  justify-content: center;
  align-items: center;

  & > div {
    width: 15vh;
    height: 6px;
    border-radius: 50px;
    background: #d0d0d0;
  }
`;

const SidebarForm = styled.form`
  padding: 1rem;
  display: flex;
  flex-flow: row nowrap;
  gap: 0.5rem;
`;

// store of the 
const store: any = {};

interface BusListProp {
  list: any
}

const BusList: React.FC<BusListProp> = ({ list }) => {

  const [buses, setBuses] = useState([])

  useEffect(() => {
    if (list) {
      setBuses(list.buses)
    }
    // NOTE: adding "list" var because the useEffect function does not 
    // update when props change
  }, [list])
  console.log(list)

  return (
    <div>
      <div>Result</div>
      {
        buses.map((bus, i) => (
          <div key={i}>
            <div>{bus}</div>
          </div>
        ))
      }
    </div >
  )
};

const BusInfo = (props) => {

  console.log(props)

  return (
    <div>
      <h1>HP01A1345</h1>
      <ul>
        <li>
          <a>Random</a>
        </li>
      </ul>
    </div>
  );
};

/**
 * The Map component
 */
export default function ReactMapbox() {
  const { user } = useAuth();
  const mapContainer = useRef(null);
  const map = useRef<any | null>(null);
  const [lng, setLng] = useState(77.17);
  const [lat, setLat] = useState(31.1);
  const [zoom, setZoom] = useState(10);
  const [markers, setMarkers] = useState([]);

  /**
   * Ge the user location
   */

  const getUserLocation = () => { }

  /**
   * set the coords data for sending through map Matching API
   */
  const setCoordsData = (coords) => {
    console.log("coords :", coords)
    let coordsJSONData = Object.values(coords).map((geopoint) => [geopoint.coordinates.longitude, geopoint.coordinates.latitude])
    return {
      coordsJSONData,
      coordsJSONString: coordsJSONData.join(";")
    }
  }

  /**
   * Updating the route
   */
  const updateRoute = (coordinates) => {
    console.log("update Route : ", coordinates)
    try {

      if (!coordinates) {
        console.log("Coordinates is missing !")
        return
      }

      // Set the profile
      const profile = 'driving'
      // Get the coordinates that were drawn on the map
      // const data = draw.getAll()

      let { coordsJSONData, coordsJSONString } = setCoordsData(coordinates)

      // if the route is already rendered on the map
      console.log(map.current.getSource('route'))
      if (map.current.getLayer('route')) {
        flyToCoords(coordsJSONData[0][0], coordsJSONData[0][1])

        console.log("Route is already on the map ! ")

        return
      }


      flyToCoords(coordsJSONData[0][0], coordsJSONData[0][1])

      getMatch(coordsJSONString, null, profile)
    } catch (e) {
      console.log("Error Occured while updating the route updateRoute fn : ", e)
    }
  }

  // Draw the Map Matching route as a new layer on the map
  const addRoute = (coords) => {
    // If a route is already loaded, remove it
    if (map.current.getSource('route')) {
      map.current.removeLayer('route')
      map.current.removeSource('route')
    } else {
      // Add a new layer to the map
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: coords
          }
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#000',
          'line-width': 10,
          'line-opacity': 0.8
        }
      })

      console.log(map.current.getLayer('route'))
    }
  }

  // Make a Map Matching request
  const getMatch = async (
    coordinates: string,
    radius: string | null,
    profile: string
  ) => {
    try {
      console.log(coordinates, radius, profile)
      // Seperate the radiuses with semicolons
      // const radiuses = radius.join(';')
      // Create the query
      const response = await axios.get(`https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`)

      console.log("The Query : ", response)

      if (!response) return

      // Handle errors
      if (response.data.code !== "Ok") {
        console.log("Some error occured while getting the response from map matching !")
        return
      }

      // Get the coordinates from the response
      const coords = response.data.matchings[0].geometry
      console.log("The Coords from the response : ", coords)
      addRoute(coords)
    } catch (error) {
      console.log("Error Occured while sending the match request getMatch fn : ", error);
    }
  }

  /*
   * Fly to the particular coordinates in the map
   */
  const flyToCoords = (longitude: number, latitude: number) => {
    console.log(longitude, latitude);

    if (longitude === undefined) return { message: "Longitude is missing !" };

    if (latitude === undefined) return { message: "Latitude is missing !" };

    if (map.current === undefined)
      return { message: "Map is not initialize yet !" };

    // fly to particular location on the map
    map.current.flyTo({
      center: [longitude, latitude],
      essentail: true,
      bearing: 40,
      zoom: 15,
    });

    return null;
  };

  /*
   * Render marker
   */
  const _renderMarker = (id: string, options: MarkerOptions) => {
    if (!id) return null;

    var el: HTMLDivElement = document.createElement("div");
    if (options.isBus) {
      el.className = "bus-marker";
      el.onclick = () => {
        navigate(`/live/${id}`, { replace: true });
      };
    } else {
      el.className = "custom-marker";
    }
    el.key = id;

    console.log(el);

    return el;
  };

  /*
   * Check for new Marker data
   */
  const _checkForNewData = () => {
    try {
      const dbRef = ref(rdb, "location/");
      onValue(dbRef, (snapshot) => {
        if (snapshot.val()) {
          let arr: any[] = [];
          Object.keys(snapshot.val()).map((key) => {
            let data: Location = snapshot.val()[key];
            arr.push(data);
          });
          console.log("Check Arr Data : ", arr);

          arr.forEach(({ busNo, currentLocation }) => {
            const { longitude, latitude } = currentLocation;
            let myMarker = store[busNo];

            //myMarker.remove();
            myMarker.setLngLat([longitude, latitude]).addTo(map.current);
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

  /*
   * Adding the marker to the map
   */
  const _addMarkerToMap = (tempMarker: any | any[]) => {
    // check if the argument is array or not
    if (!Array.isArray(tempMarker)) {
      const { busNo, busName, buses, currentLocation } = tempMarker;
      const { longitude, latitude } = currentLocation;

      let el = _renderMarker("stop", { isStop: true });

      let div = document.createElement("div");

      div.innerHTML = `<h1>${busName}</h1>`;
      let ul = document.createElement("ul");

      ul.style.width = "150px";
      ul.style.height = "150px";
      ul.style.overflowY = "auto";
      ul.style.padding = "0.5rem";
      ul.style.background = "rgb(238, 238, 238)";
      ul.style.boxShadow = "inset 0 0px 5px 5px #0000000d";

      console.log(buses);
      for (let i = 0; i < buses.length; i++) {
        let li = document.createElement("li");
        li.innerHTML = `<div href="" onclick="function navigateBus() { console.log('clicked') }" style="text-decoration: none;color: black;">${buses[i]}</div>`;
        li.onclick = () => {
          console.log("Locate the bus")
          navigate(`/live/${buses[i]}`, { replace: true })
        }
        console.log("Li ", li, li.onclick);
        ul.appendChild(li);
      }
      div.appendChild(ul);

      console.log(div.innerHTML);

      store[busNo] = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(div.innerHTML))
        .addTo(map.current);

      return;
    }

    tempMarker.forEach(async ({ busNo, currentLocation }) => {
      const { latitude, longitude } = currentLocation;

      let el = _renderMarker(busNo, { isBus: true });

      console.log(el);

      store[busNo] = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<Link to = "/home/${busNo}" > ${busNo}</Link > `
          )
        )
        .addTo(map.current);

      console.log(store[busNo]);
    });
  };

  /**
   * Fetching all the markers data from the firestore
   */
  const _fetchMarkerData = async () => {
    // fetch Marker data from firebase
    let newArr: Location[] | [] = [];

    try {
      const dbRef = ref(rdb, "location/");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        Object.keys(snapshot.val()).map((key) => {
          let data: Location = snapshot.val()[key];
          newArr.push(data);
          return data;
        });
        console.log(newArr);
        setMarkers(newArr);
        _addMarkerToMap(newArr);
        _checkForNewData();
        return;
      } else {
        console.log("No Data is availabe");
        return;
      }
    } catch (e) {
      console.log("Error Occured while fetching data from firestore :", e);
    }
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      // center: [-122.42198657748384, 37.80182517312106],
      zoom: zoom,
    });

    map.current.on("load", () => {
      _fetchMarkerData();

      getMatch()

      getUserLocation()

      //map.current.addControl(draw)
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  // if (!user) {
  //   console.log(user)
  //   navigate("/", { replace: true })
  // }

  return (
    <div>
      <Sidebar
        updateRoute={updateRoute}
        findStop={(stop) => {

          // check if the stop is present or not
          if (!stop) return

          _addMarkerToMap(
            {
              busNo: stop.stopId,
              buses: stop.buses,
              busName: stop.stopName,
              currentLocation: {
                longitude: stop.coordinates[1],
                latitude: stop.coordinates[0],
              },
            },
            { isStop: true }
          );

          flyToCoords(stop.coordinates[1], stop.coordinates[0]);
        }}
      />
      <Map ref={mapContainer} />
    </div>
  );
}
