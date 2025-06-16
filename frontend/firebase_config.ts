import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Platform } from 'react-native';
import type { Auth } from "firebase/auth";

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

// Platform-specific auth initialization with proper typing
let FIREBASE_AUTH: Auth;

if (Platform.OS === 'web') {
  // Web version - uses browser's built-in persistence
  const { getAuth, browserLocalPersistence, setPersistence } = require("firebase/auth");
  FIREBASE_AUTH = getAuth(FIREBASE_APP);
  setPersistence(FIREBASE_AUTH, browserLocalPersistence).catch(console.error);
} else {
  // Native version - uses AsyncStorage persistence
  const { initializeAuth, getReactNativePersistence } = require("firebase/auth");
  const ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default;
  
  FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

export { FIREBASE_AUTH };
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
