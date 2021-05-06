import React, { useState, useEffect, useContext } from "react";
import { Link, navigate, Redirect } from "@reach/router";
import firebase from 'firebase'

import { Illustrations } from "./assets"
import styled from "styled-components"

import UserContext from './UserContext.js'
import {FiFacebook, FiInstagram} from "react-icons/fi"

const AppContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-flow: row nowrap;
    width: 100%;
    min-height: 100vh;
    background-color: #ff6464;
    padding: 1.5em;

    @media (max-width: 500px) {
        flex-flow: column nowrap;
        padding: 2em 1em;
    }
`

const AboutContainer = styled.div`
    width: 100%;
    padding: 10em 2em 1em 2em;

    @media (max-width: 1300px) {
        padding: 7em 2em 1em 2em;
    }

    @media (max-width: 500px) {
        display: none;
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

const ColOne = styled.div`
    width: 40%;
    padding: 1em;
    display: grid;
    place-items: center;
    padding: 2em;
    
    @media (max-width: 500px) {
        width: 100%;
        padding: 2em 0.5em;
    }
`

const ColTwo = styled.div`
    width: 60%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-flow: column nowrap;
    padding: 2em 1em;

    @media (max-width: 500px) {
        width: 100%;
        padding: 2em 0.5em;
    }
`

const ImageContainer = styled.div`
    padding: 1em;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: baseline;

    @media (max-width: 800px) {
        height: 200px;
    }

    @media (max-width: 500px) {
        height: auto;
        padding: 1em 0.2em;
    }
`

const Login = () => {
    const user = useContext(UserContext)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmail = (e) => setEmail(e.target.value);

    const handlePassword = (e) => setPassword(e.target.value);
    const [ errorMessage, setErrorMessage ] = useState("Welcome Back !")

    const handleLogin = (e) => {
        e.preventDefault()

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((r) => {
                console.log("Login :", r);
            }).catch(e => {
                console.log("Error will", e)
                setErrorMessage("Authentication Failed !")
            })
    };

    /*useEffect(() => {
        // initial checking
        console.log("user", user)
        if(user) {
            navigate('/home')
        } else {
            return
        }
    });*/

    return (
        <>
        <AppContainer>
        <AboutContainer>
            <HeaderOne>Alaric</HeaderOne>
            <Tagline>
                Our Mission to provide a service to track the buses running and help in the time of pandemic by managing
                the Crowd 
            </Tagline>
            <Button>Know More</Button>
        </AboutContainer>
        <Container>
            {user ? <Redirect to="/home" noThrow /> : (
            <form onSubmit={handleLogin}>
                <Heading>Hey you are back !!!</Heading>
                <Tagline style={{ textAlign: "center", color: "red", fontWeight: 600 }}>{errorMessage}</Tagline>
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
        <AppContainer style={{ backgroundColor: "#000", color: "#fff" }}>
            <ColOne>
                <img src={Illustrations.Online} />
            </ColOne>
            <ColTwo>
                <h1>Bus Tracker</h1>
                <h3>Bus Tracker is a real time GPS bus tracking system .</h3>
                <p>Bus Tracker allows riders to track the exact location of a bus in real time for your city. We know how busy your day is. Don't waste a minute of it waiting at a bus stop.</p>
                <Button style={{ border: "1px solid #fff"}}>Get Started</Button>
            </ColTwo>
        </AppContainer>
        <AppContainer style={{ display: "block" }}>
            <h1 style={{ textAlign: "center" }}>Why Us?</h1>
            <AppContainer>
                <div style={{ padding: "1em"}}>
                    <ImageContainer>
                        <img src={Illustrations.Time} />
                    </ImageContainer>
                    <div>
                    <h2>Save Time</h2>
                    <p>Saves time 

        One of the main reasons to use this website is that it will save your precious time. Now you can easily access the location of any bus around you and easily get the information of any bus sitting at your home. As we also know the fact that time is money, so by using our site you unknowingly saving your money
                    </p>
                    </div>
                </div>
                <div style={{ padding: "1em"}}>
                    <ImageContainer>
                       <img src={Illustrations.Currency} />     
                    </ImageContainer>
                    <div>
                    <h2>Promotes Digital Currency</h2>
                    <p>Promotes Digital Currency

        Another reason to use our services is online payment of bus fare, Now you can simply pay your bus fare through our site . No need to carry change now . This reason will also save your money somehow, it will be a small amount but remember one thing  “ EVERY  DROP COUNTS”
        </p>
                    </div>
                </div>
                <div style={{ padding: "1em"}}>
                    <ImageContainer>
                        <img src={Illustrations.EasyToUse} />
                    </ImageContainer>
                    <div>
                    <h2>Easy To Use</h2>
                    <p>Easy to use

        We provide you the easiest interface so that every person can access our services. Its easy, secure and fast. But still if have any doubts or have any difficulty in understanding things, you can watch our tutorials on youtube and also in pdf                or  you can also contact us on our email.
                    </p>
                    </div>
                </div>
                <div style={{ padding: "1em"}}>
                    <ImageContainer>
                        <img src={Illustrations.Online} />
                    </ImageContainer>
                    <div>
                    <h2>100% Online</h2>
                    <p>100% Online

        For all our services to access you only need a device and an internet connection. Now you can track every bus in your city/state and the main point is that its all online. You can pay the bus fare of your friends , family and your relatives from your home and from anywhere through our site and app.</p> 
                    </div>
                </div>
            </AppContainer>
        </AppContainer>
        <AppContainer style={{ backgroundColor: "#000", color: "#fff", flexFlow: "column nowrap", justifyContent: "center" }}>
            <h1>How Does it Works ?</h1>
            <h3>It’s an easier, faster and safer way to track local buses and pay bus fare online</h3>
            <ol>
                <li>It simply tracks your local buses on map and provide you routes of buses and their timing .</li>
                <li>It also provides you the payment gateway to pay your bus fare (for both govt. and private transport)</li>
                <li>It also shows you bus speed , distance between location and destination and seats available.</li>
                <li>You can also book private buses</li>
            </ol>
        </AppContainer>
        <AppContainer style={{ minHeight: "auto" }}>
            <ColOne>
                <img src={Illustrations.Online} />
            </ColOne>
            <ColTwo>
                <h3>our website also provides services for </h3>
                <h1>Private vehicle owner </h1>
                <p>if you are a private vehicle owner, ALARIC provides you an opportunity to earn money. If you are searching for passive income source, this is something you should try . </p>
                <Button>Learn More</Button>
            </ColTwo>
        </AppContainer>
        <AppContainer style={{ 
            backgroundColor: "#000", 
            color: "#fff", 
            minHeight: "auto", 
            flexFlow: "column nowrap",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <h3>New release and oppurtunities</h3>
            <h1>Provide your email to get updated</h1>
            <form style={{ display: "inline-flex" }}>
                <Input 
                    type="email" 
                    placeholder="Enter Your Email" 
                    style={{ color: "#fff", border: "1px solid #fff", borderRadius: "3px" }}
                />
                <Button style={{ border: "1px solid #fff" }}>Submit</Button>
            </form>
        </AppContainer>
        <AppContainer style={{ minHeight: "50vh", padding: "4em 2em", justifyContent: "center", alignItems: "flex-start" }}>
            <div style={{ flex: 2, padding: "1em" }}>
                <div>Copyright bustracker-2021-present</div>
                <div>All rights reserved</div>
                <hr />
                <p>if you have any questions regarding our site you can contact us on our email</p>
            </div>
            <div style={{ flex: 1, padding: "1em" }}>
                <h3 style={{ marginTop: 0 }}>Contact</h3>
                <p>abc@gmail.com<br />Phone:  9876543210<br />Toll Free: 1-888-788-8888</p>
            </div>
            <div style={{ flex: 1, padding: "1em" }}>
                <h3 style={{ marginTop: 0 }}>About Bus Tracker</h3>
                <div>About Us</div>
                <div>Mobile Version</div>
                <div>Bus Tracker on Mobile</div>
                <div>Sitemap</div>
                <div>Offers</div>
                <div>Careers</div>
            </div>
            <div style={{ flex: 1, padding: "1em" }}>
                <h3 style={{ marginTop: 0 }}>Info</h3>
                <div>T & C</div>
                <div>Privacy and Policy</div>
                <div>FAQ</div>
                <div>Blog</div>
                <div>Agent Registration</div>
                <div>Insurance Partner</div>
                <div>User Agreement</div>
            </div>
            <div style={{ flex: 1, padding: "1em" }}>
                <FiFacebook style={{ height: "3em", width: "3em", margin: "0em 1em" }} />
                <FiInstagram style={{ height: "3em", width: "3em", margin: "0em 1em" }}  />
            </div>
        </AppContainer>
        </>
    );
};

export default Login
