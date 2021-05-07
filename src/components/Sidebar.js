import React from 'react'
import styled from 'styled-components'

const Sidebar = ({ markers }) => {
    return (
        <TopBar>
                    <div></div>
                    <div><HiOutlineLogout /></div>
                </TopBar>
                {markers.map(m => {
                    return (
                        <div>
                        <h2>{m.currentLocation.email}</h2>
                        <h4>{m.currentLocation.longitude}</h4>
                        <h4>{m.currentLocation.latitude}</h4>
                        </div>
                    )
                })}
    )
}

export default Sidebar
