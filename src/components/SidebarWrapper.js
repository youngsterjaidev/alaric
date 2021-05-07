import React, { useState } from "react";
import styled from "styled-components";
import { HiOutlineLogout, HiArrowNarrowLeft } from "react-icons/hi";
import { RiBusFill } from "react-icons/ri";
import firebase from "firebase/app";
import { jsx, css } from "@emotion/react"

const Sidebar = styled.div`
    width: 350px;
    height: 90%;
    position: absolute;
    z-index: 1;
    margin: 1em;
    border-radius: 10px;
    background-color: #ffffffe0;
    overflow-y: scroll;
    transition: all 1s cubic-bezier(0, 1.2, 1, -0.1);
    box-shadow: 0 4px 23px 5px rgb(0 0 0 / 20%), 0 2px 6px rgb(0 0 0 / 15%);

    @media (max-width: 500px) {
        width: 100%;
        bottom: 0;
        margin: 1em 0em 0em 0em;
        height: 8%;
        border-radius: 20px 20px 0px 0px;
    }
`;

const TopBar = styled.div`
    width: 100%;
    background-color: #fff;
    height: auto;
    display: flex;
    position: sticky;
    top: 0;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 0.5em;
    border-radius: 10px 10px 0px 0px;
    box-shadow: 0 4px 23px 5px rgb(173 173 173 / 20%),
        0 2px 6px rgb(197 197 197 / 18%);
`;
const IconWrapper = styled.div`
    cursor: pointer;
    display: grid;
    place-items: center;

    @media (max-width: 500px) {
        flex: 1;
    }
`;

const ContentWrapper = styled.div`
    padding: 2em 0em;
    width: 100%;
    bottom: 0;

    @media (max-width: 500px) {
        padding: 1em 0.3em;
    }
`;

const SidebarPuller = styled.div`
    @media (max-width: 500px) {
        height: 0.5em;
        min-width: 3em;
        flex: 2;
        border-radius: 50px;
        background-color: #d7d7d7;
    }
`;

const Card = styled.div`
    width: 100%;
    display: flex;
    background-color: #fff;
    padding: 1em 0.3em;
    border-bottom: 3px solid #d7d7d7;
    align-items: center;
    flex-flow: row nowrap;
    cursor: pointer;
    justify-content: space-between;

    &:hover {
        background: #eeeeeec4;
        color: #000;
    }
`;
const Input = styled.input`
    width: 100%;
    min-width: 300px;
    display: block;
    padding: 0.7em;
    font-weight: bold;
    border: 2px solid #d7d7d7;
    background: transparent;
    margin-bottom: 1em;
    border-radius: 5px;
    background-color: #fff;
    font-family: "Montserrat", sans-serif;

    &:hover {
        outline: none;
    }

    @media (max-width: 500px) {
        min-width: 220px;
    }
`;
const SidebarWrapper = ({ markers }) => {
    const [sidebarHeight, setSidebarHeight] = useState("75%");
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleLogout = () => {
        firebase.auth().signOut();
    };

    return (
        <Sidebar>
            <h1 css={css`
                color: #fff;
            `}>Red</h1>
            <TopBar>
                <IconWrapper>
                    <HiArrowNarrowLeft
                        style={{ height: "2em", width: "2em", color: "#000" }}
                    />
                </IconWrapper>
                <SidebarPuller />
                <IconWrapper
                    onClick={handleLogout}
                    style={{ placeItems: "center" }}
                >
                    <HiOutlineLogout
                        style={{ height: "2em", width: "2em", color: "red" }}
                    />
                </IconWrapper>
            </TopBar>
            <div style={{ position: "relative" }}>
                <div
                    style={{
                        padding: "1em 0.5em",
                        position: "sticky",
                        top: "3em",
                        backgroundColor: "#fff",
                        boxShadow: "0px 6px 6px 0px rgb(0 0 0 / 20%)",
                    }}
                >
                    <Input
                        type="search"
                        placeholder="search"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                <ContentWrapper>
                    {markers.map((m) => {
                        return (
                            <Card>
                                <IconWrapper>
                                    <RiBusFill
                                        style={{
                                            height: "2em",
                                            width: "2em",
                                            color: "#000",
                                        }}
                                    />
                                </IconWrapper>
                                <div>{m.currentLocation.email}</div>
                            </Card>
                        );
                    })}
                </ContentWrapper>
            </div>
        </Sidebar>
    );
};

export default SidebarWrapper;
