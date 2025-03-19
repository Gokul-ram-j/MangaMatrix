// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB74OJ1jZDZJ5cBZ1mbuEPrkFZS-ENXWi4",
    authDomain: "mangamatrix-a814f.firebaseapp.com",
    projectId: "mangamatrix-a814f",
    storageBucket: "mangamatrix-a814f.firebasestorage.app",
    messagingSenderId: "142737644184",
    appId: "1:142737644184:web:2cb6a800bddcec5dedceed"
  };

// Initialize Firebase
let auth;
let firestore;

if (getApps().length == 0) {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
  firestore = getFirestore(app);
} else {
  auth = getAuth();
  firestore = getFirestore();
}

export { auth, firestore };


