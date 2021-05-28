import React from "react"
import styled from "styled-components"
import {Router} from "@reach/router"

const Container = styled.div`
    background-color: #d7d7d7;
    width: 100%;
    height: 100vh;
`

const One = () => <div>One</div>
const Two = () => <div>Two</div>

const Map = () => {
    return (
        <div>
        <Container>Container</Container>
        </div>
    )
}

export default Map
