import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwYmvzEI8B93WPdl-UaFWbz3OJSIEpC-Y",
  authDomain: "zing-cb51c.firebaseapp.com",
  projectId: "zing-cb51c",
  storageBucket: "zing-cb51c.appspot.com",
  messagingSenderId: "685215974205",
  appId: "1:685215974205:web:b7994165ec0ca658267b54",
  measurementId: "G-GY1V68N8GH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;