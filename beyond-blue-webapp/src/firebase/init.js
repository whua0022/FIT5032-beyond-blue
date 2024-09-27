// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAs3vsZcBPwiVN5sAePhAMWZVgvUu-Lq-U",
    authDomain: "beyond-blue-2c5d3.firebaseapp.com",
    projectId: "beyond-blue-2c5d3",
    storageBucket: "beyond-blue-2c5d3.appspot.com",
    messagingSenderId: "132247600551",
    appId: "1:132247600551:web:3b557470742532b6cbca82"
  };
  initializeApp(firebaseConfig);

const db = getFirestore()
export default db