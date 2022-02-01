import React, { useEffect, useState } from "react"
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import firebase from "firebase/compat/app"


const MapMarker = ({ map }) => {
    const [markers, setMarkers] = useState([])

    const _addMarkerToMap = (tempMarkers) => {
        console.log("hit the add the markers", tempMarkers)
        tempMarkers.map(temp => {
            // add markers to the map
            const { longitude, latitude, uid } = temp.currentLocation
            console.log(longitude, latitude)

            // new marker for each feature and add to the map
            new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map)

        })
    }

    const _getMarker = async () => {
        let tempMarkers = []
        const dbRef = await firebase.database().ref().child("location")
        const snapshot = await dbRef.get()
        Object.keys(snapshot.val()).map(key => {
            tempMarkers.push(snapshot.val()[key])
        })
        setMarkers(tempMarkers)
        _addMarkerToMap(tempMarkers)
    }

    useEffect(() => {
        _getMarker()
    }, [])

    useEffect(() => {
        if (markers.length === 0) {
            return
        } else {
            markers.forEach(marker => {
                //
                console.log("Run after the markers will change")
                //const { uid } = marker.currentLocation
                //console.log("The store", store)
            })
        }
    }, [markers])

    return (
        <div>
            {markers.length === 0 ? null : (
                <div></div>
            )}
        </div>
    )
}

export default MapMarker
