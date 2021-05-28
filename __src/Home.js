import React from "react"
import {Router} from "@reach/router"

import Map from "./components/Map.js"
import Sidebar from "./components/Sidebar.js"
import Profile from "./components/Profile.js"

const Home = () => {
    return (
       <>
            <Map />
            <Sidebar /> 
            <Profile />
        </>
    )
}

export default Home
