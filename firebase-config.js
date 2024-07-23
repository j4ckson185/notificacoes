import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getDatabase, ref, push, onChildAdded, remove } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyB-pF2lRStLTN9Xw9aYQj962qdNFyUXI2E",
    authDomain: "cabana-8d55e.firebaseapp.com",
    projectId: "cabana-8d55e",
    storageBucket: "cabana-8d55e.appspot.com",
    messagingSenderId: "706144237954",
    appId: "1:706144237954:web:345c10370972486afc779b",
    databaseURL: "https://cabana-8d55e-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

export { app, messaging, getToken, onMessage, auth, signInWithEmailAndPassword, onAuthStateChanged, signOut, database, ref, push, onChildAdded, remove, firestore, collection, getDocs };
