import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/app";
import "firebase/database";

//import App from "./components/App.js";
//import ReactMap from "./components/ReactMap.js";
import ReactMapbox from "./components/ReactMapbox.js";


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

ReactDOM.render(<ReactMapbox />, document.querySelector("#root"));
