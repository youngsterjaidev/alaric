import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import { Router, Link } from "@reach/router";
import Loading from "./Loading.js";
import Home from "./Home.js"
import Login from "./Login.js";

let firebaseConfig = {
    apiKey: "AIzaSyBa03yaOEGCwaL-G6v95ppgGS6lyvoFSVk",
    authDomain: "react-native-chikchak-firebase.firebaseapp.com",
    databaseURL: "https://react-native-chikchak-firebase.firebaseio.com",
    projectId: "react-native-chikchak-firebase",
    storageBucket: "react-native-chikchak-firebase.appspot.com",
    messagingSenderId: "240714601094",
    appId: "1:240714601094:web:8c6220a15fb6c630407707",
    measurementId: "G-K4J3S1NSR9",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


const App = () => {
    return (
        <Router>
            <Loading path="/" />
            <Home path="/home/*" />
            <Login path="/login" />
        </Router>
    );
};

export default App;
