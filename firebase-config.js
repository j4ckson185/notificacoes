import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database-compat.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth-compat.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js';

const firebaseConfig = {
    apiKey: "AIzaSyB-pF2lRStLTN9Xw9aYQj962qdNFyUXI2E",
    authDomain: "cabana-8d55e.firebaseapp.com",
    databaseURL: "https://cabana-8d55e-default-rtdb.firebaseio.com",
    projectId: "cabana-8d55e",
    storageBucket: "cabana-8d55e.appspot.com",
    messagingSenderId: "706144237954",
    appId: "1:706144237954:web:345c10370972486afc779b",
    measurementId: "G-96Y337GYT8"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();
const messaging = getMessaging();

export { database, ref, set, auth, signInWithEmailAndPassword, onAuthStateChanged, messaging, getToken };
