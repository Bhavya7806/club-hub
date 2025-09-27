import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (UPDATED TO clubhub-716b7)
const firebaseConfig = {
  apiKey: "AIzaSyCx_fujsUYLW6ujg6WKK81u74eFH1JNKco",
  authDomain: "clubhub-716b7.firebaseapp.com",
  projectId: "clubhub-716b7",
  storageBucket: "clubhub-716b7.firebasestorage.app",
  messagingSenderId: "518837785781",
  appId: "1:518837785781:web:47f9e593c7e16fe4c65afc",
  measurementId: "G-PCGFV6H9F2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and EXPORT the services we need
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export app instance and project ID for use in collection paths
export const appInstance = app;
export const projectId = firebaseConfig.projectId;