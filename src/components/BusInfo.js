import React, { useState, useEffect, useContext } from "react";
import {
    CardElement,
    useStripe,
    useElements,
    Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import styled from "styled-components";
import firebase from "firebase/compat/app";
import Modal from "../Modal";
import { BsArrowLeftRight, BsClock } from "react-icons/bs";
import { IoMdWalk } from "react-icons/io";
import MoonLoader from "react-spinners/MoonLoader";
import axios from "axios";
import UserContext from "../UserContext";

// Make sure to call the loadStripe outside the render function
const promise = loadStripe(
    "pk_test_51J1BowSCr7kmnfa9u3mn0NHHK0nKO2FrZnzciu0VylffLD7r9mQyhdspuG9ljK0Y9TMcPidtYWy2Y5mgGbNIAJYH00PdTOZvWT"
);

const Container = styled.div`
    width: 100%;
    overflow-y: auto;
    background-color: #ffffffe0;
    box-shadow: 0 4px 23px 5px rgb(173 173 173 / 20%),
        0 2px 6px rgb(197 197 197 / 18%);
    transition: all 0.5s cubic-bezier(0.46, 0.03, 0.52, 0.96);
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
    border: 2px solid #000;
    border-radius: 6px;

    &:hover:enabled {
        color: #000;
        background: #fff;
        border: 2px solid #e0e0e0;
    }

    &:disabled {
        background: #7b7b7b;
        border: 1px solid #8b8b8b;
        cursor: not-allowed;
    }
`;

const WalletButton = styled.button`
    padding: 0.5em 2em;
    background: green;
    color: #fff;
    border: none;
    cursor: pointer;
    border: 2px solid green;
    border-radius: 6px;

    &:hover:enabled {
        color: #000;
        background: #fff;
        border: 2px solid #e0e0e0;
    }

    &:disabled {
        background: #7b7b7b;
        border: 1px solid #8b8b8b;
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
    border-top: 1px solid #d1d1d1;
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

const PaymentForm = styled.form`
    display: flex;
    justify-content: center;
    flex-flow: column nowrap;
    padding: 1em;
    height: 100%;
`;

const Checkout = ({
    fare,
    setFare,
    bus,
    userInfo,
    setShowModal,
    setShowCheckout,
}) => {
    const user = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [processing, setProcessing] = useState("");
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState("");
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        // get the client secret by creating paymentIntent as the page LoadingWrapper
        window
            .fetch(
                "https://alaric-server.herokuapp.com/create-payment-intent",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ items: "radom" }),
                }
            )
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setClientSecret(data.clientSecret);
            })
            .catch((e) => {
                console.log("Error Occured while get the client secret !", e);
            });
    }, []);

    const payNow = async (e) => {
        console.log("Button is click", userInfo);
        try {
            const res = await axios.post(
                "https://alaric-server.herokuapp.com/decreaseBalance",
                {
                    uid: user.uid,
                    balance: userInfo.balance,
                    amount: fare.distance * 2,
                }
            );
            const { ok, message } = res.data;
            console.log("messge", res);
        } catch (e) {
            console.log("Error Occured ", e);
        }
    };

    const handleChange = (e) => {
        setDisabled(e.empty);
        setError(e.error ? e.error.message : "");
    };

    const handleSubmit = async (e) => {
        // handle the submit
        e.preventDefault();

        console.log("form is sending for submission");
        setProcessing(true);

        // set the payload
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                // send a card to stripe
                card: elements.getElement(CardElement),
            },
        });

        // if payload has an Error
        if (payload.error) {
            // setting the error and stop the processing
            setError(`Payment failed ${payload.error.message}`);
            setProcessing(false);
        } else {
            // setting the error null
            // payment get complete
            setError(null);
            setProcessing(false);
            setSucceeded(true);
            payNow();
        }
    };

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: "Arial, sans-serif",
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#32325d",
                },
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
            },
        },
    };

    return (
        <ModalWrapper>
            <Wrapper style={{ position: "relative" }}>
                <ModalContainer>
                    <ModalContent>
                        <PaymentForm onSubmit={handleSubmit}>
                            <CardElement
                                id="card-element"
                                options={cardStyle}
                                onChange={handleChange}
                            />
                            <Button
                                type="submit"
                                style={{
                                    margin: "2em 0em",
                                }}
                                disabled={processing || disabled || succeeded}
                            >
                                {processing ? <span>Loading</span> : "Pay Now"}
                            </Button>
                            {error && <div>{error}</div>}
                            {succeeded ? <div>Payment Successful !</div> : null}
                        </PaymentForm>
                    </ModalContent>
                </ModalContainer>
                <div
                    onClick={() => {
                        setShowModal(false);
                        setShowCheckout(false);
                    }}
                    style={{
                        width: "100%",
                        height: "100vh",
                        background: "#0000009e",
                        cursor: "pointer",
                        position: "absolute",
                        top: 0,
                        left: 0,
                    }}
                ></div>
            </Wrapper>
        </ModalWrapper>
    );
};

const Payment = ({
    setShowModal,
    setShowCheckout,
    bus,
    sidebarHeight,
    userInfo,
    fare,
    setFare,
}) => {
    const user = useContext(UserContext);
    const [route, setRoute] = useState({});
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

    const PayNow = async (e) => {
        console.log("Button is click", userInfo);
        try {
            const res = await axios.post(
                "http://localhost:5050/decreaseBalance",
                {
                    uid: user.uid,
                    balance: userInfo.balance,
                    amount: fare.distance * 2,
                }
            );
            const { ok, message } = res.data;
            console.log("messge", res);
        } catch (e) {
            console.log("Error Occured ", e);
        }
    };

    useEffect(async () => {
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
                                <div style={{ display: "inline-flex" }}>
                                    <WalletButton
                                        type="button"
                                        style={{
                                            padding: "1em 2em",
                                            margin: "0 0.5em 0 0",
                                        }}
                                        disabled={isDisabled}
                                        onClick={() => PayNow()}
                                    >
                                        Pay from Wallet
                                    </WalletButton>
                                    <Button
                                        type="button"
                                        style={{ padding: "1em 2em" }}
                                        disabled={isDisabled}
                                        onClick={() => setShowCheckout(true)}
                                    >
                                        Pay Now
                                    </Button>
                                </div>
                            </ModalBar>
                        </ModalContainer>
                        <div
                            onClick={() => setShowModal(false)}
                            style={{
                                width: "100%",
                                height: "100vh",
                                background: "#0000009e",
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

const BusInfo = (props) => {
    const user = useContext(UserContext);
    const { busId } = props;
    const [bus, setBus] = useState({});
    const [busNo, setBusNo] = useState(busId);
    const [userInfo, setUserInfo] = useState({});
    const [route, setRoute] = useState({});
    const [fare, setFare] = useState({});
    const [stops, setStops] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);

    useEffect(() => {
        // call the api server
        firebase
            .firestore()
            .collection("buses")
            .where("busNo", "==", busId)
            .onSnapshot((snap) => {
                snap.docChanges().forEach((bus) => {
                    console.log("The Bus Info", bus.doc.data().routeId);
                    setBus(bus.doc.data());
                    firebase
                        .firestore()
                        .collection("routes")
                        .doc(bus.doc.data().routeId)
                        .onSnapshot((s) => {
                            console.log("The Route", s);
                            console.log(s.data());
                            setRoute(s.data());
                            setStops(s.data().stops);
                        });
                });
            });
    }, [busId]);

    useEffect(() => {
        if (user) {
            console.log("Kuch bhiii pehan leta haii", user.uid);
            firebase
                .firestore()
                .collection("accounts")
                .doc(user.uid)
                .onSnapshot((snap) => {
                    console.log("data ", snap.data());
                    setUserInfo(snap.data());
                });
        }
        return;
    }, []);

    return (
        <>
            {Object.keys(bus).length === 0 ? (
                <LoadingWrapper>
                    <MoonLoader size={40} />
                </LoadingWrapper>
            ) : (
                <Container style={{ height: props.sidebarHeight }}>
                    <HeaderThree>
                        {bus.busNo}{" "}
                        <Button onClick={() => setShowModal(true)}>Pay</Button>
                    </HeaderThree>
                    <div style={{ padding: "1em" }}>
                        <div>{bus.busName}</div>
                    </div>
                    {Object.keys(bus).length === 0 ? (
                        <h1>Something Went Wrong</h1>
                    ) : (
                        <div style={{ padding: "1em" }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "0.5em 0em",
                                }}
                            >
                                <div
                                    style={{
                                        background: "#fff",
                                        padding: "0.5em",
                                        border: "1px solid #bdbdbd",
                                        borderRadius: "5px",
                                    }}
                                >
                                    {route.origin}
                                </div>
                                <div>
                                    <BsArrowLeftRight />
                                </div>
                                <div
                                    style={{
                                        background: "#fff",
                                        padding: "0.5em",
                                        border: "1px solid #bdbdbd",
                                        borderRadius: "5px",
                                    }}
                                >
                                    {route.destination}
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "0.5em 0em",
                                }}
                            >
                                <div
                                    style={{
                                        background: "#fff",
                                        padding: "0.5em",
                                        borderRadius: "5px",
                                        border: "1px solid #bdbdbd",
                                    }}
                                >
                                    <BsClock />
                                </div>
                                <div
                                    style={{
                                        background: "#fff",
                                        padding: "0.5em",
                                        border: "1px solid #bdbdbd",
                                        borderRadius: "5px",
                                    }}
                                >
                                    {route.distance} KM
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "0.5em 0em",
                                }}
                            >
                                <div
                                    style={{
                                        background: "#fff",
                                        padding: "0.5em",
                                        border: "1px solid #bdbdbd",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <IoMdWalk />
                                </div>
                                <div
                                    style={{
                                        background: "#fff",
                                        padding: "0.5em",
                                        border: "1px solid #bdbdbd",
                                        borderRadius: "5px",
                                    }}
                                >
                                    {route.duration} hours
                                </div>
                            </div>
                            <div>Stops</div>
                            {stops.length === 0 ? (
                                <h1>No Stops</h1>
                            ) : (
                                <ul>
                                    {stops.map((stop) => (
                                        <li>{stop}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </Container>
            )}
            <div>
                {showModal ? (
                    <Modal>
                        {showCheckout ? (
                            <Elements stripe={promise}>
                                <Checkout
                                    userInfo={userInfo}
                                    fare={fare}
                                    setFare={setFare}
                                    setShowModal={setShowModal}
                                    setShowCheckout={setShowCheckout}
                                    bus={bus}
                                />
                            </Elements>
                        ) : (
                            <Payment
                                userInfo={userInfo}
                                fare={fare}
                                setFare={setFare}
                                setShowModal={setShowModal}
                                setShowCheckout={setShowCheckout}
                                bus={bus}
                            />
                        )}
                    </Modal>
                ) : null}
            </div>
        </>
    );
};

export default BusInfo;
