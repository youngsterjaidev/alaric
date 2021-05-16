import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import styled from "styled-components";
import MoonLoader from "react-spinners/MoonLoader";
import firebase from "firebase/app";

const Container = styled.div`
    padding: 1em;
    height: 80vh;
    width: 100%;
    overflow-y: auto;
    background-color: #eee;
    box-shadow: 0 4px 23px 5px rgb(0 0 0 / 20%), 0 2px 6px rgb(0 0 0 / 15%);
`;

const Card = styled(Link)`
    width: 100%;
    padding: 1em;
    display: flex;
    border-radius: 3px;
    justify-content: flex-start;
    align-items: center;
    background-color: #fff;
    text-decoration: none;
    margin-botto0m: 0.2em;
    border: 3px solid #eee;

    &:hover {
        border: 3px solid #d7d7d7;
    }
`;

const LoadingWrapper = styled.div`
    width: 100%;
    height: 50vh;
    display: grid;
    place-items: center;
`;

const Form = styled.form`
    padding: 1em 0.5em;
    background: #eee;
`;
const Input = styled.input`
    padding: 1em;
    display: block;
    width: 100%;
    border-radius: 3px;
    border: 2px solid #d7d7d7;
`;

const HeaderThree = styled.h3`
    margin: 0;
    padding: 1em 0em;
    text-align: left;
`;

const BusList = () => {
    const [buses, setBuses] = useState([]);
    const [busesNear, setBusesNear] = useState([]);
    const [searchStr, setSearchStr] = useState("");
    const [routeId, setRouteId] = useState("");
    const [ready, setReady] = useState(true);

    const handleSearch = (e) => {
        setReady(true);
        setBuses([]);
        setSearchStr(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //
        console.log("Handle Submit");
        firebase
            .firestore()
            .collection("routes")
            .where("stops", "array-contains", searchStr)
            .onSnapshot((snap) => {
                snap.docChanges().forEach((d) => {
                    setRouteId(d.doc.id)
                    firebase
                        .firestore()
                        .collection("buses")
                        .where("routeId", "==", d.doc.id)
                        .onSnapshot((snapshot) => {
                            let busArr = [];
                            snapshot.docChanges().forEach((data) => {
                                busArr.push(data.doc.data());
                                setReady(false);
                                setBuses(busArr);
                            });
                        });
                });
            });
    };

    useEffect(() => {
        // call the api server
        firebase
            .firestore()
            .collection("buses")
            .onSnapshot((snap) => {
                let busesArr = [];
                snap.docChanges().forEach((bus) => {
                    busesArr.push(bus.doc.data());
                    // setBusesNear(busesArr);
                });
                setBusesNear(busesArr)
            });
    }, []);

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="search"
                    value={searchStr}
                    onChange={handleSearch}
                />
            </Form>
            {busesNear.length === 0 ? (
                <LoadingWrapper>
                    <MoonLoader size={40} />
                </LoadingWrapper>
            ) : (
                <>
                    <div>
                        {ready ? (
                            <>
                                <HeaderThree>Buses Near By You</HeaderThree>
                                {busesNear.map((bus) => (
                                    <Card to={`${bus.busNo}`}>{bus.busNo}</Card>
                                ))}
                            </>
                        ) : (
                            <>
                                <HeaderThree
                                    style={{
                                        color: "green",
                                    }}
                                >
                                    Here your result !
                                </HeaderThree>
                                {buses.map((bus) => (
                                    <Card to={bus.busNo}>{bus.busNo}</Card>
                                ))}
                            </>
                        )}
                    </div>
                </>
            )}
        </Container>
    );
};

export default BusList;
