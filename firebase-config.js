import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js';
import { getMessaging } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth-compat.js';
import { getDatabase, ref, push, onChildAdded, remove } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database-compat.js';

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

export { app, messaging, auth, getMessaging, getAuth, getDatabase, signInWithEmailAndPassword, onAuthStateChanged, signOut, ref, push, onChildAdded, remove };
