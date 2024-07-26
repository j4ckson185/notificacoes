import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, set, push, onValue, query, orderByChild, equalTo } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
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
firebase.initializeApp(firebaseConfig);

// Get Firebase services after initialization
const database = firebase.database();
const auth = firebase.auth();
let messaging;
try {
    messaging = firebase.messaging();
} catch (error) {
    console.error("Firebase messaging is not available:", error);
}

// Expose the initialized services globally if needed
window.firebaseDatabase = database;
window.firebaseAuth = auth;
if (messaging) {
    window.firebaseMessaging = messaging;
}

export { app, database, auth, messaging, getDatabase, ref, set, push, onValue, query, orderByChild, equalTo, getToken, onMessage, signInWithEmailAndPassword, onAuthStateChanged, signOut };
export { firebaseConfig };
