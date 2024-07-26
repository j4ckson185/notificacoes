import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, set, push, onValue, onChildAdded } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services after initialization
const database = getDatabase(app);
const auth = getAuth(app);
const messaging = getMessaging(app);

export { app, database, auth, messaging, ref, set, push, onValue, onChildAdded, getToken, onMessage, signInWithEmailAndPassword, onAuthStateChanged, signOut, firebaseServices };
