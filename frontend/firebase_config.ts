import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAURmqWNNl44tW7GSiOc5PeZ0UJT-2xpfY",
  authDomain: "universal-athletics-e21fd.firebaseapp.com",
  projectId: "universal-athletics-e21fd",
  storageBucket: "universal-athletics-e21fd.firebasestorage.app",
  messagingSenderId: "166154152159",
  appId: "1:166154152159:web:d0bb2a7548aa15790a216a",
  measurementId: "G-2Q0L7L30D3"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const FIREBASE_DB = getFirestore(FIREBASE_APP);
