import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD16nbrL225IA1tEkwr78PHab5uBiMo6cM",
  authDomain: "complete-url-shortner.firebaseapp.com",
  projectId: "complete-url-shortner",
  storageBucket: "complete-url-shortner.appspot.com",
  messagingSenderId: "311763715484",
  appId: "1:311763715484:web:aa3cb87c0f811feb60f459",
  measurementId: "G-MJB2VE6CMW",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { db };
