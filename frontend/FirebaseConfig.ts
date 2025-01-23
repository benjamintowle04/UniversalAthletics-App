import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA7NlHiuAUYTDJyn6CBlVB_unw-axwYQMw",
    authDomain: "universal-athletics-72036.firebaseapp.com",
    projectId: "universal-athletics-72036",
    storageBucket: "universal-athletics-72036.firebasestorage.app",
    messagingSenderId: "550008260340",
    appId: "1:550008260340:web:b4138d7f7e9eb4692140a1",
    measurementId: "G-9CXT1D6JL0"
  };
  
 // Initialize Firebase
 export const FIREBASE_APP = initializeApp(firebaseConfig);
 export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
 export const FIREBASE_DB = getFirestore(FIREBASE_APP);