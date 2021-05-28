import React from "react";
import styled from "styled-components";
import { Router } from "@reach/router";

import BusInfo from "./BusInfo"
import BusList from "./BusList"
import Topbar from "./Topbar"

const Container = styled.div`
    background-color: #fff;
    position: absolute;
    top: 1em;
    left: 1em;
    width: 300px;
    height: auto;
    box-shadow: 0 4px 23px 5px rgb(0 0 0 / 20%), 0 2px 6px rgb(0 0 0 / 15%);
`;


const Sidebar = () => {
    return (
        <Container>
            <Topbar />
            <Router>
                <BusList path="/" />
                <BusInfo path="/:busId" />
            </Router>
        </Container>
    );
};

export default Sidebar;
