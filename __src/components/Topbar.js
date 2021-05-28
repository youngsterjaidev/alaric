import React from "react";
import { HiOutlineArrowNarrowLeft, HiOutlineUser } from "react-icons/hi";
import { Link } from "@reach/router";
import styled from "styled-components";

const Container = styled.div`
    padding: 0.8em 1em;
    background-color: #eee;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #d7d7d7;
`;

const IconWrapper = styled(Link)`
    cursor: pointer;
    text-decoration: none;
    color: #000;
`;

const IconStyle = {
    width: "1.5em",
    height: "1.5em",
};

const Topbar = () => {
    return (
        <Container>
            <IconWrapper to="/home">
                <HiOutlineArrowNarrowLeft style={IconStyle} />
            </IconWrapper>
            <IconWrapper to="">
                <HiOutlineUser style={IconStyle} />
            </IconWrapper>
        </Container>
    );
};

export default Topbar;
