import { config } from "dotenv"
import React, { useEffect, useState, Suspense } from "react";
import { createRoot } from 'react-dom/client';

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
import { Router, Link } from "@reach/router";
import { ThemeProvider } from "styled-components";

//import App from "./components/App.js";
//import ReactMap from "./components/ReactMap.js";

import ReactMapbox from "./components/map/ReactMapbox";

import { Profile, Login, Loading, CreateAccount, PasswordReset, Home } from "./pages";
import styled from "styled-components";

import {
  useLocalStorage,
  ProviderAuth,
  useAuth,
  ToggleTheme,
} from "./custom-hooks";
import UserContext from "./UserContext.js";

config()

const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
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
  color: ${(props) => {
    console.log(props);
    return "red";
  }};
`;

const App = (props) => {
  const { user } = useAuth();
  const [token] = useLocalStorage("token");

  // useEffect(() => {
  //     firebase.auth().onAuthStateChanged((user) => {
  //         if (user) {
  //             setUser(user);
  //         } else {
  //             setUser(null);
  //         }
  //     });
  // }, []);

  console.log("https://ov5i1h.sse.codesandbox.io/");
  console.log("User get it : ", user);

  /*
    if (!token) {
      return (
        <Router>
          <Loading path="/" />
          <PasswordReset path="/passwordReset" />
          {user ? <ReactMapbox path="/home/*" /> : null}
          <Login path="/login" />
          <CreateAccount path="/createAccount" />
        </Router>
      );
    }*/

  // fallback
  return (
    <Router>
      <Loading path="/" />
      <Login path="/login" />
      <ReactMapbox path="/live/*" />
      <Home path="/home" />
      <CreateAccount path="/createAccount" />
      <Profile path="/profile" />
      <PasswordReset path="/passwordReset" />
    </Router>
  );
};

// To Level component
const Main = () => {
  const [themeName, setThemeName] = useState("dark");

  return (
    <Suspense fallback={<Loading />}>
      <ProviderAuth>
        <ToggleTheme>
          <App />
        </ToggleTheme>
      </ProviderAuth>
    </Suspense>
  );
};

root.render(<Main />);
