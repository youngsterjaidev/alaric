import React, { useState, useEffect, useContext } from "react";
import { Link, navigate, Redirect } from "@reach/router";
import firebase from 'firebase'
import axios from "axios"
import styled from 'styled-components'
import MoonLoader from "react-spinners/MoonLoader";
import UserContext from './UserContext.js'


const AppContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: grid;
    place-items: center;
    background: hsl(0deg 0% 90%);
`

const Container = styled.div`
    width: auto;
    height: auto;
    min-height: 500px;
    top: 2em;
    background-color: #ffffffe0;
    border-radius: 10px;
    display: grid;
    place-items: center;
    padding: 1em 0em;
    box-shadow: 0 4px 23px 5px rgb(0 0 0 / 20%), 0 2px 6px rgb(0 0 0 / 15%);
    
    @media (max-width: 500px) {
        width: 90%;
        place-items: stretch;
    }
`

const FormContainer = styled.div`
    padding: 1em 1.5em;
    display: grid;
    place-items: center;
`

const Input = styled.input`
    width: 100%;
    min-width: 300px;
    display: block;
    padding: 0.7em;
    font-weight: bold;
    border: 1px solid transparent;
    border-bottom-color: #000;
    background: transparent;
    font-family: 'Montserrat', sans-serif;

    &:valid {
        border-bottom: 2px solid #000;
    }

    &:invalid {
        border-bottom: 1px solid red;
    }
    
    &:disabled {
        background-color: #d1d1d1; 
        border-bottom: 1px solid grey;
        color: black;
        cursor: not-allowed;
    }

    @media (max-width: 500px) {
        min-width: 150px;
    }
`

const Button = styled.button`
    padding: 1em 2em;
    background-color: #000;
    border-radius: 3px;
    border: none;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;

    &:disabled {
        background-color: #d2d2d2;
        color: #5f5f5f;
    }
`

const Select = styled.select`
    display: block;
    width: 100%;
    padding: 0.5em;
    border: none;
    border-bottom: 1px solid red;
    background: transparent;

    &:valid {
        border-bottom: 2px solid #000;
    }

    &:invalid {
        border-bottom: 1px solid red;
    }
`

const MyLink = styled(Link)`
    text-decoration: none;
    font-family: 'Montserrat', sans-serif;
    font-weight: 100;
    color: blue;
`

const Heading = styled.h2`
    text-align: center;
    font-family: 'Montserrat', sans-serif;
`

const HeaderOne = styled.h1`
    text-align: left;
    font-family: 'Montserrat', sans-serif;
`

const Tagline = styled.p`
    text-align: left;
    font-family: 'Montserrat', sans-serif;
    font-weight: 100;
`
const CreateAccount = () => {
    const user = useContext(UserContext)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [userType, setUserType] = useState("");
    const [busNumber, setBusNumber] = useState("");
    const [showBusNumber, setShowBusNumber] = useState(true)
    const [showLoading, setShowLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("Start To Create An Account !");
    const [errorColor, setErrorColor] = useState("black")
    const [validateForm, setValidateForm] = useState(true)

    const handleEmail = (e) => {
        setEmail(e.target.value);
        setErrorColor("black")
        setErrorMessage("Start To Create An Account !")
        let pass = document.querySelector("form").checkValidity()
        setValidateForm(!pass)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
        let pass = document.querySelector("form").checkValidity()
        setValidateForm(!pass)
    }

    const handleDispalyName = (e) => {
        setDisplayName(e.target.value);
        let pass = document.querySelector("form").checkValidity()
        setValidateForm(!pass)
    }

    const handleBusNumber = (e) => {
        setBusNumber(e.target.value);
        let pass = document.querySelector("form").checkValidity()
        setValidateForm(!pass)
    }

    const handleUserType = (e) => {
        setUserType(e.target.value)
        if (e.target.value === "driver") {
            setShowBusNumber(false)
        } else {
            setShowBusNumber(true)
        }
    }

    const handleSignUp = (e) => {
        e.preventDefault()
        setShowLoading(true)

        // submitBtn.innerHTML = "<div>" + <MoonLoader /> + "</div>"

        axios.post("https://alaric-server.herokuapp.com/", {
            email: email,
            password: password,
            userType: userType,
            busNumber: busNumber,
            displayName: displayName
        }).then(r => {
            setErrorMessage("Now you can Login")
            setShowLoading(false)
            setErrorColor("green")
        }).catch(e => {
            setErrorMessage("Something went wrong !")
            setShowLoading(false)
            setErrorColor("red")
        })
    };

    useEffect(() => {
        // initial checking
        /*console.log("user", user)
        if(user) {
            navigate('/home')
        } else {
            return
        }*/
    });

    return (
        <AppContainer>
            <Container>
                {user ? <Redirect to="/" noThrow /> : (
                    <form onSubmit={handleSignUp}>
                        <Heading>Join Us</Heading>
                        <Tagline style={{
                            textAlign: "center",
                            color: "white",
                            padding: "0.5em 0em",
                            fontWeight: 600,
                            background: errorColor
                        }}>{errorMessage}</Tagline>
                        <FormContainer>
                            <label htmlFor="email"></label>
                            <Input
                                type="email"
                                value={email}
                                placeholder="Email"
                                id="email"
                                required
                                onChange={handleEmail}
                            />
                        </FormContainer>
                        <FormContainer>
                            <label htmlFor="password"></label>
                            <Input
                                type="password"
                                value={password}
                                placeholder="Password"
                                id="password"
                                min="8"
                                max="8"
                                required
                                onChange={handlePassword}
                            />
                        </FormContainer>
                        <FormContainer>
                            <Input
                                type="text"
                                value={displayName}
                                placeholder="Display Name"
                                id="displayName"
                                required
                                onChange={handleDispalyName}
                            />
                        </FormContainer>
                        <FormContainer>
                            <Select value={userType} onChange={handleUserType}>
                                <option value="user">User</option>
                                <option value="conductor">Conductor</option>
                                <option value="driver">Driver</option>
                            </Select>
                        </FormContainer>
                        <FormContainer>
                            <Input
                                type="text"
                                value={busNumber}
                                placeholder="Bus Number"
                                id="busNumber"
                                required={!showBusNumber}
                                disabled={showBusNumber}
                                onChange={handleBusNumber}
                            />
                        </FormContainer>
                        <FormContainer>
                            {showLoading ? (
                                <MoonLoader size={30} color="black" />
                            ) : (
                                <Button type="submit" id="submit" disabled={validateForm}>
                                    create a Account
                                </Button>
                            )}
                            <div style={{ padding: "1em" }}>
                                <MyLink to="/login">Sign In</MyLink>
                            </div>
                        </FormContainer>
                    </form>
                )}
            </Container>
        </AppContainer>
    );
};

export default CreateAccount
