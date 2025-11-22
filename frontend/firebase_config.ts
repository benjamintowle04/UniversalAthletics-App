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

// Platform-specific auth initialization - LAZY ONLY, no module-load initialization
let FIREBASE_AUTH: Auth | undefined;

// Diagnostic: log early so we can see module load order in the browser console.
try {
  console.log('[DIAG] firebase_config loaded (auth will be initialized lazily)', { platform: Platform?.OS ?? 'unknown' });
} catch (e) {}

// DO NOT initialize auth at module load - causes "Component auth has not been registered yet" error
// Auth will be initialized lazily via getFirebaseAuthSafe() when first accessed

export { FIREBASE_AUTH };
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

// Safe getter for callers that want to obtain the initialized Auth instance at runtime.
// This is the ONLY place where auth should be initialized - never at module load.
// Some builds/environments throw when calling getAuth() eagerly ("Component auth has not been registered yet").
export function getFirebaseAuthSafe(): Auth | undefined {
  if (FIREBASE_AUTH) return FIREBASE_AUTH;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const authMod = require('firebase/auth');
    
    if (Platform && Platform.OS === 'web') {
      // Web: use getAuth and set up browser persistence
      const getAuth = authMod.getAuth;
      const browserLocalPersistence = authMod.browserLocalPersistence;
      const setPersistence = authMod.setPersistence;
      
      FIREBASE_AUTH = getAuth(FIREBASE_APP);
      
      setPersistence(FIREBASE_AUTH, browserLocalPersistence).catch((err: any) => {
        console.warn('[DIAG] setPersistence failed', err);
      });
      
      console.log('[DIAG] firebase_config web auth initialized', { authInitialized: !!FIREBASE_AUTH });
    } else {
      // Native: use getAuth
      const getAuth = authMod.getAuth;
      FIREBASE_AUTH = getAuth(FIREBASE_APP);
      console.log('[DIAG] firebase_config native auth initialized', { platform: Platform?.OS, authInitialized: !!FIREBASE_AUTH });
    }
    
    return FIREBASE_AUTH;
  } catch (err) {
    console.error('[DIAG] getFirebaseAuthSafe failed to initialize auth', err);
    return undefined;
  }
}
