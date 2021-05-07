import React, { useState, useEffect, useContext } from "react";
import { Link, navigate, Redirect } from "@reach/router";
import firebase from 'firebase'
import styled from 'styled-components'
import UserContext from './UserContext.js'


const AppContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: grid;
    place-items: center;
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
    
    @media (max-width: 500px) {
        width: 100%;
    }
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

    &:valid {
        border-bottom: 2px solid #000;
    }

    &:invalid {
        border-bottom: 1px solid red;
    }


    @media (max-width: 500px) {
        min-width: 220px;
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
        background-color: transparent; 
        color: grey;
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
    const [errorMessage, setErrorMessage] = useState("Start To Create Account !");
    const [validateForm, setValidateForm] = useState(true)

    const handleEmail = (e) => {
        setEmail(e.target.value);
        let pass = document.querySelector("form").checkValidity()
        setValidateForm(!pass)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
        let pass = document.querySelector("form").checkValidity()
        setValidateForm(!pass)
    }

    const handleSignUp = (e) => {
        e.preventDefault()

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((r) => {
                console.log("Login :", r);
            }).catch(e => {
                console.log("Error Occured while creating the user", e)
                setErrorMessage(e.message)
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
                <Tagline style={{ textAlign: "center", color: "red", fontWeight: 600 }}>{errorMessage}</Tagline>
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
                    <Button type="submit" disabled={validateForm}>
                        Create An Account
                    </Button>
                    <MyLink to="/login">Sign Up</MyLink>
                </FormContainer>
            </form>
            )}
        </Container>
        </AppContainer>
    );
};

export default CreateAccount
