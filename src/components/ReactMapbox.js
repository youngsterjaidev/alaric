import React, { useState, useEffect, useRef, useContext } from "react"
import mapboxgl from "!mapbox-gl" // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'
import { navigate } from "@reach/router"
import UserContext from "../UserContext.js";
import SidebarWrapper from "./SidebarWrapper.js"
import ProfileBar from "./ProfileBar.js"

mapboxgl.accessToken = "pk.eyJ1IjoiamFpZGV2djk5OSIsImEiOiJja25vcHhkNjExYmR4MnZwcmU3MG9wd2hlIn0.YV5iqi1TiI1nSWQd-bQBmA"

const directions = new MapboxDirections({
    accessToken: "pk.eyJ1IjoiamFpZGV2djk5OSIsImEiOiJja25vcHhkNjExYmR4MnZwcmU3MG9wd2hlIn0.YV5iqi1TiI1nSWQd-bQBmA",
    unit: "metric",
    profile: "mapbox/driving"
})

const mapStyle = {
    width: "100%",
    height: "100vh"
}

const ReactMapbox = () => {
    const user = useContext(UserContext)
    const [showProfile, setShowProfile] = useState(false);
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [lng, setLng] = useState(-70.9)
    const [lat, setLat] = useState(42.35)
    const [zoom, setZoom] = useState(9)
    const [markers, setMarkers] = useState([{ coords: [30.5, 50.5] }, { coords: [30.5, 55.5] }])

    useEffect(() => {
        if (!user) navigate("/")
        if (map.current) return    // initialize map only one
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [lng, lat],
            zoom: zoom
        })

        map.current.addControl(directions, "top-right")
    }, [])

    useEffect(() => {
        if (!map.current) return
        markers.map(marker => {
            console.log(marker.coords)
            new mapboxgl.Marker().setLngLat(marker.coords).addTo(map.current)
        })
    }, [])

    useEffect(() => {
        if (map.current) return  // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4))
            setLat(map.current.getCenter().lat.toFixed(4))
            setZoom(map.current.getZoom().toFixed(2))
        })
    })

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
            <div ref={mapContainer} style={mapStyle}></div>
        </div>
    )
}

export default ReactMapbox