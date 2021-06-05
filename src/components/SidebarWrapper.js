import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { HiOutlineLogout, HiArrowNarrowLeft } from "react-icons/hi";
import { RiBusFill, RiMenuFill } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { Router, Link, navigate } from "@reach/router";
import UserContext from "../UserContext.js";
import firebase from "firebase/app";
import { jsx, css } from "@emotion/react";

import BusList from "./BusList";
import BusInfo from "./BusInfo";

const Sidebar = styled.div`
    width: 350px;
    height: auto;
    position: absolute;
    z-index: 5;
    margin: 1em;
    border-radius: 10px;
    background-color: #ffffffe0;
    transition: all 0.5s cubic-bezier(0.46, 0.03, 0.52, 0.96);
    box-shadow: 0 4px 23px 5px rgb(0 0 0 / 20%), 0 2px 6px rgb(0 0 0 / 15%);

    @media (max-width: 500px) {
        width: 100%;
        position: fixed;
        bottom: 0;
        margin: 1em 0em 0em 0em;
        height: 8%;
        border-radius: 40px 40px 0px 0px;
    }
`;

const TopBar = styled.div`
    width: 100%;
    background-color: #fff;
    height: auto;
    display: flex;
    position: sticky;
    z-index: 8;
    top: 0;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 1em;
    border-radius: 10px 10px 0px 0px;
    box-shadow: 0 4px 23px 5px rgb(173 173 173 / 20%),
        0 2px 6px rgb(197 197 197 / 18%);

    @media (max-width: 500px) {
        border-radius: 50px 50px 0px 0px;
        padding: 1em;
    }
`;
const IconWrapper = styled(Link)`
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
    height: 1em;
    min-width: 6em;
    border-radius: 50px;
    background-color: #d7d7d7;

    @media (max-width: 500px) {
        height: 1em;
        min-width: 3em;
        flex: 2;
        border-radius: 50px;
        background-color: #d7d7d7;
    }
`;

const Card = styled(Link)`
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

const BusContainer = styled.div`
    padding: 1em;
    background-color: #eee;
    position: fixed;
    top: 0;
    width: 250px;
    height: 100vh;
`;

const SidebarWrapper = ({ markers, setShowProfile, showProfile }) => {
    const user = useContext(UserContext);
    const [sidebarHeight, setSidebarHeight] = useState("78%");
    const [searchQuery, setSearchQuery] = useState("");
    const [userData, setUserData] = useState({});
    const [showConductor, setShowConductor] = useState(false);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleLogout = () => {
        firebase.auth().signOut();
    };

    const handleHeight = (e) => {
        if (sidebarHeight === "7%") {
            setSidebarHeight("78%");
        } else {
            setSidebarHeight("7%");
        }
    };

    useEffect(async () => {
        if(user) {
        const snap = await firebase
            .firestore()
            .collection("accounts")
            .doc(user.uid)
            .get();
        setUserData(snap.data());
        if (snap.data().type === "conductor") {
            setShowConductor(true);
        } else {
            setShowConductor(false);
        }
        }else {
            navigate("/")
        }
    }, []);

    return (
        <div>
            {showConductor ? (
                <Sidebar style={{ height: sidebarHeight }}>
                    <TopBar>
                        <IconWrapper to="/home">
                            <IoIosArrowBack
                                style={{
                                    height: "1.5em",
                                    width: "1.5em",
                                    color: "#000",
                                }}
                            />
                        </IconWrapper>
                        <SidebarPuller onClick={handleHeight}></SidebarPuller>
                        <IconWrapper
                            to=""
                            onClick={() => setShowProfile(true)}
                            style={{ placeItems: "center" }}
                        >
                            <FiUser
                                style={{
                                    height: "1.5em",
                                    width: "1.5em",
                                    color: "#000",
                                }}
                            />
                        </IconWrapper>
                    </TopBar>
                    <div>Conductor Side</div>
                </Sidebar>
            ) : (
                <Sidebar>
                    <TopBar>
                        <IconWrapper to="/home">
                            <IoIosArrowBack
                                style={{
                                    height: "1.5em",
                                    width: "1.5em",
                                    color: "#000",
                                }}
                            />
                        </IconWrapper>
                        <SidebarPuller onClick={handleHeight}></SidebarPuller>
                        <IconWrapper
                            to=""
                            onClick={() => setShowProfile(true)}
                            style={{ placeItems: "center" }}
                        >
                            <FiUser
                                style={{
                                    height: "1.5em",
                                    width: "1.5em",
                                    color: "#000",
                                }}
                            />
                        </IconWrapper>
                    </TopBar>
                    <div style={{ position: "relative", height: sidebarHeight }}>
                        <Router>
                            <BusList path="/" />
                            <BusInfo path="/:busId" />
                        </Router>
                    </div>
                </Sidebar>
            )}
        </div>
    );
};

export default SidebarWrapper;
