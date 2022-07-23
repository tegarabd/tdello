// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5mJt3jJniNOraOBLeaMC70PjaRJqoig0",
  authDomain: "chello-beddc.firebaseapp.com",
  projectId: "chello-beddc",
  storageBucket: "chello-beddc.appspot.com",
  messagingSenderId: "707816056943",
  appId: "1:707816056943:web:3d15d3b27ca16f4385459a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
