// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app)
export const auth = getAuth(app)
