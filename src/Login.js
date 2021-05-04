import React, { useState, useEffect, useContext } from "react";
import { Link, navigate } from "@reach/router";
import firebase from 'firebase'

import styled from "styled-components"

import UserContext from './UserContext.js'

const AppContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-flow: row nowrap;
    width: 100%;
    height: 100vh;
    background-color: #ff6464;
    padding: 1.5em;
`

const AboutContainer = styled.div`
    width: 100%;
    padding: 10em 2em 1em 2em;

    @media (max-width: 1300px) {
        padding: 7em 2em 1em 2em;
    }
`

const Container = styled.div`
    width: 500px;
    height: auto;
    min-height: 500px;
    top: 2em;
    background-color: #ffffffe0;
    border-radius: 10px;
    display: grid;
    place-items: center;
    padding: 1em 0em;
    box-shadow: 0 4px 23px 5px rgb(0 0 0 / 20%), 0 2px 6px rgb(0 0 0 / 15%);
`

const FormContainer = styled.div`
    padding: 1em 2em;
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

    &:hover {
        outline: none
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

const Login = () => {
    const user = useContext(UserContext)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmail = (e) => setEmail(e.target.value);

    const handlePassword = (e) => setPassword(e.target.value);
    const [ errorMessage, setErrorMessage ] = useState("Authentication Failed !")

    const handleLogin = (e) => {
        e.preventDefault()

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((r) => {
                console.log("Login :", r);
            }, console.error);
    };

    useEffect(() => {
        // initial checking
        console.log("user", user)
        if(user) {
            navigate('/home')
        } else {
            return
        }
    });

    return (
        <>
        <AppContainer>
        <AboutContainer>
            <HeaderOne>Alaric</HeaderOne>
            <Tagline>
                Our Mission Users to provide a service to track the buses running and help in the time of pandemic by managing
                the Crowd 
            </Tagline>
            <Button>Know More</Button>
        </AboutContainer>
        <Container>
            {user ? <div>Loading</div> : (
            <form onSubmit={handleLogin}>
                <Heading>Hey you are back !!!</Heading>
                <Tagline style={{ textAlign: "center", color: "red" }}>{errorMessage}</Tagline>
                <FormContainer>
                    <label htmlFor="email"></label>
                    <Input
                        type="email"
                        value={email}
                        placeholder="Email"
                        id="email"
                        onChange={handleEmail}
                        required
                    />
                </FormContainer>
                <FormContainer>
                    <label htmlFor="password"></label>
                    <Input
                        type="password"
                        value={password}
                        placeholder="Password"
                        id="password"
                        onChange={handlePassword}
                        required
                    />
                </FormContainer>
                <FormContainer>
                    <Button type="submit">
                        Login
                    </Button>
                </FormContainer>
                <FormContainer style={{ paddingTop: "0em" }}>
                    <MyLink to="/createAccount">Create An Account !</MyLink>
                </FormContainer>
            </form>
            )}
        </Container>
        </AppContainer>
        <AppContainer style={{ backgroundColor: "#000", color: "#fff" }}>Main</AppContainer>
        <AppContainer>Main</AppContainer>
        <AppContainer style={{ backgroundColor: "#000", color: "#fff" }}>Main</AppContainer>
        </>
    );
};

export default Login
