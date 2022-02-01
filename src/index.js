import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
import { Router, Link } from "@reach/router";
import { ThemeProvider } from "styled-components"
//import App from "./components/App.js";
//import ReactMap from "./components/ReactMap.js";
import ReactMapbox from "./components/ReactMapbox.js";

import { Login, Loading, CreateAccount, PasswordReset } from "./pages"
import styled from "styled-components"

import { ProviderAuth, useAuth, ToggleTheme } from "./custom-hooks"
import UserContext from "./UserContext.js";

const firebaseConfig = {
    apiKey: "AIzaSyAa9TwCMfkEwsuaxx1yIbmVdK0fYhxCRR8",
    authDomain: "alaric-339008.firebaseapp.com",
    databaseURL: "https://alaric-339008-default-rtdb.firebaseio.com",
    projectId: "alaric-339008",
    storageBucket: "alaric-339008.appspot.com",
    messagingSenderId: "264727266576",
    appId: "1:264727266576:web:10bb6e7980b695c701d195",
    measurementId: "G-V0ZQ4YTKPT"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//let Login = () => <div>Login</div>
//let Loading = () => <div>Loading</div>

const Container = styled.div`
	color: ${props => {
		console.log(props)
		return "red"
	}}
`

const App = (props) => {
    const { user } = useAuth()

    // useEffect(() => {
    //     firebase.auth().onAuthStateChanged((user) => {
    //         if (user) {
    //             setUser(user);
    //         } else {
    //             setUser(null);
    //         }
    //     });
    // }, []);

    if (user === undefined) {
        return <Loading />
    }

    if (!user) {
        console.log("User : ", user)
        return (
            <Login />
        )
    }

    console.log("User get it : ", user)

    return (
        <div>
            <Container>User is Present</Container>
        </div>
    )

    // return (
    //     <ProviderAuth>
    //         <Router>
    //             <Loading path="/" />
    //             <PasswordReset path="/passwordReset" />
    //             <ReactMapbox path="/home/*" />
    //             <Login path="/login" />
    //             <CreateAccount path="/createAccount" />
    //         </Router>
    //     </ProviderAuth>
    // );
};

// To Level component 
const Main = () => {
		const [themeName, setThemeName] = useState("light")

    return (
        <ProviderAuth>
						<ToggleTheme themeName={themeName}>
            	<App />
						</ToggleTheme>
        </ProviderAuth>
    )
}

ReactDOM.render(<Main />, document.querySelector("#root"));
