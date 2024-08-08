// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:  process.env.NEXT_PUBLIC_API_KEY_GEMINI,
  authDomain: "inventory-managment-30bb9.firebaseapp.com",
  projectId: "inventory-managment-30bb9",
  storageBucket: "inventory-managment-30bb9.appspot.com",
  messagingSenderId: "116915935074",
  appId: "1:116915935074:web:7d103c1f91dba128e53e3b",
  measurementId: "G-0E6KK74XT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app)
const storage = getStorage(app);
const auth = getAuth(app)
export { firestore,storage, auth }