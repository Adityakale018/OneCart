// Import the functions you need from the SDKs you need
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "onecart-fcf39.firebaseapp.com",
  projectId: "onecart-fcf39",
  storageBucket: "onecart-fcf39.firebasestorage.app",
  messagingSenderId: "891980875144",
  appId: "1:891980875144:web:5b36a4897294f73f9ba63d",
  measurementId: "G-9HXT0THRVS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app)

const provider =new GoogleAuthProvider()

export {auth,provider}