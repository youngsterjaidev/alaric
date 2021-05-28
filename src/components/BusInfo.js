import React, { useState, useEffect } from "react";
import styled from "styled-components";
import firebase from "firebase/app";
import Modal from "../Modal";
import MoonLoader from "react-spinners/MoonLoader";

const Container = styled.div`
    width: 100%;
    height: 80vh;
    overflow-y: auto;
    background-color: #eee;
    box-shadow: 0 4px 23px 5px rgb(173 173 173 / 20%),0 2px 6px rgb(197 197 197 / 18%);
    scrollbar-width: thin;
    scrollbar-color: #90a4ae;

    &::-webkit-scrollbar {
        width: 15px;
    }

    &::-webkit-scrollbar-track {
        background: #cfd8dc;
    }
    &::-webkit-scrollbar-thumb {
        background-color: grey;
        border-radius: 50px;
        border: 3px solid #cfd8dc;
    }
`;

const LoadingWrapper = styled.div`
    width: 100%;
    height: 50vh;
    display: grid;
    place-items: center;
`;

const HeaderThree = styled.h3`
    background-color: #fff;
    margin: 0;
    padding: 1em;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #bbb;
`;

const Button = styled.button`
    padding: 0.5em 2em;
    background: #000;
    color: #fff;
    border: none;
    cursor: pointer;
    border: 2px solid #fff;
    border-radius: 6px;

    &:hover:enabled {
        color: #000;
        background: #fff;
        border: 2px solid #000;
    }

    &:disabled {
        background: #7b7b7b;
        cursor: not-allowed;
    }
`;
const ModalWrapper = styled.div`
    width: 100%;
    height: 100vh;
    position: fixed;
`;

const ModalContainer = styled.div`
    width: 500px;
    background: #fff;
    border-radius: 3px;
    z-index: 1;
    position: relative;
    box-shadow: 0 4px 23px 5px rgb(0 0 0 / 20%), 0 2px 6px rgb(0 0 0 / 15%);

    @media (max-width: 500px) {
        width: 100%;
    }
`;

const Wrapper = styled.div`
    display: grid;
    place-items: center;
    position: relative;
    width: 100%;
    height: 100vh;
`;

const ModalBar = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    background: #eee;
    position: absolute;
    bottom: 0;
    align-items: center;
    padding: 0.2em 1em;
`;

const ModalContent = styled.div`
    overflow-y: auto;
    height: 70vh;
    padding-bottom: 3em;
`;

const Form = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    padding: 1em;
`;

const Input = styled.input`
    padding: 1em;
    display: block;
    width: 100%;
    border-radius: 3px;
    border: 2px solid #d7d7d7;
`;

const ModalHeader = styled.div`
    font-weight: 800;
`;

const Payment = ({ setShowModal, bus }) => {
    const [route, setRoute] = useState({});
    const [fare, setFare] = useState({});
    const [origin, setOrigin] = useState("");
    const [destination, setDestionation] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);

    const calculatePrice = (dest) => {
        firebase
            .firestore()
            .collection("routes")
            .doc(bus.routeId)
            .collection("fare")
            .where("origin", "==", origin)
            .where("destination", "==", dest)
            .onSnapshot((snap) => {
                console.log(snap.docChanges());
                if (snap.docChanges().length === 0) {
                    setFare({});
                    setIsDisabled(true);
                }
                snap.docChanges().forEach((data) => {
                    setFare(data.doc.data());
                    setIsDisabled(false);
                });
            });
    };

    useEffect(() => {
        firebase
            .firestore()
            .collection("routes")
            .doc(bus.routeId)
            .onSnapshot((snap) => {
                setRoute(snap.data());
            });
        /*.onSnapshot((snap) => {
                let routeArr = [];
                snap.docChanges().forEach((d) => {
                    setRoute(d.doc.data());
                });
            });*/
    }, []);

    return (
        <>
            {Object.keys(route).length === 0 ? null : (
                <ModalWrapper>
                    <Wrapper style={{ position: "relative" }}>
                        <ModalContainer>
                            <ModalContent>
                                <Form>
                                    <Input
                                        id="stopone"
                                        list="data"
                                        placeholder="Origin"
                                        onChange={(e) =>
                                            setOrigin(e.target.value)
                                        }
                                    />
                                    <datalist id="data">
                                        {route.stops.map((stop, index) => (
                                            <option key={index} value={stop} />
                                        ))}
                                    </datalist>
                                    <Input
                                        id="stoptwo"
                                        list="d"
                                        placeholder="Destination"
                                        onChange={(e) => {
                                            setDestionation(e.target.value);
                                            calculatePrice(e.target.value);
                                        }}
                                    />
                                    <datalist id="d">
                                        {route.stops.map((stop, index) => (
                                            <option key={index} value={stop} />
                                        ))}
                                    </datalist>
                                </Form>
                                <div style={{ padding: "1em" }}>
                                    <Form
                                        style={{
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <ModalHeader>Origin</ModalHeader>
                                        <div>
                                            {fare.origin || "Not selected yet"}
                                        </div>
                                    </Form>
                                    <Form
                                        style={{
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <ModalHeader>Destination</ModalHeader>
                                        <div>
                                            {fare.destination ||
                                                "Not selected yet"}
                                        </div>
                                    </Form>
                                    <Form
                                        style={{
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <ModalHeader>Distance</ModalHeader>
                                        <div>
                                            {fare.distance ||
                                                "Not selected yet"}{" "}
                                            KM
                                        </div>
                                    </Form>
                                    <Form
                                        style={{
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <ModalHeader>Price Per/KM</ModalHeader>
                                        <div>Rs. 2</div>
                                    </Form>
                                </div>
                            </ModalContent>
                            <ModalBar>
                                <h3 style={{ color: "#00af00" }}>
                                    Rs. {fare.distance * 2 || "0"}
                                </h3>
                                <Button
                                    type="button"
                                    style={{ padding: "1em 3em" }}
                                    disabled={isDisabled}
                                >
                                    Pay Now
                                </Button>
                            </ModalBar>
                        </ModalContainer>
                        <div
                            onClick={() => setShowModal(false)}
                            style={{
                                width: "100%",
                                height: "100vh",
                                background: "#00000033",
                                cursor: "pointer",
                                position: "absolute",
                                top: 0,
                                left: 0,
                            }}
                        ></div>
                    </Wrapper>
                </ModalWrapper>
            )}
        </>
    );
};

const BusInfo = ({ busId }) => {
    const [bus, setBus] = useState({});
    const [route, setRoute] = useState({});
    const [stops, setStops] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // call the api server
        firebase
            .firestore()
            .collection("buses")
            .where("busNo", "==", busId)
            .onSnapshot((snap) => {
                snap.docChanges().forEach((bus) => {
                    console.log("The Bus Info", bus.doc.data().routeId)
                    setBus(bus.doc.data());
                    firebase
                        .firestore()
                        .collection("routes")
                        .doc(bus.doc.data().routeId)
                        .onSnapshot((s) => {
                            console.log("The Route", s)
                            console.log(s.data())
                            setRoute(s.data());
                            setStops(s.data().stops)
                        });
                });
            });
    }, []);

    return (
        <>
            {Object.keys(bus).length === 0 ? (
                <LoadingWrapper>
                    <MoonLoader size={40} />
                </LoadingWrapper>
            ) : (
                <Container>
                    <HeaderThree>
                        {bus.busNo}{" "}
                        <Button onClick={() => setShowModal(true)}>Pay</Button>
                    </HeaderThree>
                    <div style={{ padding: "1em" }}>
                        <div>{bus.busName}</div>
                    </div>
                    {Object.keys(bus).length === 0 ? <h1>Something Went Wrong</h1> : (
                        <div style={{ padding: "1em" }}>
                            <div>{route.origin}</div>
                            <div>{route.destination}</div>
                            <div>{route.distance}</div>
                            <div>{route.duration} hour</div>
                            <div>Stops</div>
                            {stops.length === 0 ? <h1>No Stops</h1> : (
                                <ul>
                                    {stops.map(stop => <li>{stop}</li>)}
                                </ul>
                            )}
                        </div>
                    )}
                </Container>
            )}
            <div>
                {showModal ? (
                    <Modal>
                        <Payment setShowModal={setShowModal} bus={bus} />
                    </Modal>
                ) : null}
            </div>
        </>
    );
};

export default BusInfo;
