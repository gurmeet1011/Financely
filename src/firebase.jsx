// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { setDoc, doc, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAoljRt2TdLoxyUdBOdbLnb810WZZwexzs",
    authDomain: "financely-2f201.firebaseapp.com",
    projectId: "financely-2f201",
    storageBucket: "financely-2f201.firebasestorage.app",
    messagingSenderId: "848523224919",
    appId: "1:848523224919:web:b0d276a5e8183d484d8012",
    measurementId: "G-7DXGRR1GDT"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, setDoc, doc, auth, provider }