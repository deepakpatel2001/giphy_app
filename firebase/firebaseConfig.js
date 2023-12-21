// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyArqH18ser6mIKDlsHNnoCUkfclrb1Qlrg",
  authDomain: "giphy-44026.firebaseapp.com",
  projectId: "giphy-44026",
  storageBucket: "giphy-44026.appspot.com",
  messagingSenderId: "929339442216",
  appId: "1:929339442216:web:d0936905087e4e7f4d611d",
  measurementId: "G-WKM9KM5H4X",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };