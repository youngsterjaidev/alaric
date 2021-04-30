import React, { useState, useEffect } from 'react'
import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl'

function ReactMap() {
    const [viewport, setViewport] = useState({
        width: "100%",
        height: "100vh",
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8
    })

    const [showPopup, togglePopup] = useState(true)

    const [markers, setMarkers] = useState({
        latitude: 0,
        longitude: 0
    })

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((e) => {
            setMarkers({
                longitude: e.coords.longitude,
                latitude: e.coords.latitude
            })
        })
    }, [])

    return (
        <ReactMapboxGl
            mapboxApiAccessToken="pk.eyJ1IjoiamFpZGV2djk5OSIsImEiOiJja25vcHhkNjExYmR4MnZwcmU3MG9wd2hlIn0.YV5iqi1TiI1nSWQd-bQBmA"
            {...viewport}
            onViewportChange={newViewport => setViewport(newViewport)}
        >
        {showPopup && <Popup {...markers}
                closeButton={false}
                closeOnClick={false}
                onClose={() => togglePopup(false)}
                anchor="top"
            >
                <div>You are here</div>
            </Popup>}
        </ReactMapboxGl>
    )
}

export default ReactMap
