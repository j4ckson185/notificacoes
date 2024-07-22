// Importação compatível
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js';
import { getDatabase, ref, push, onChildAdded, remove } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database-compat.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth-compat.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js';

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
const database = getDatabase(app);
const auth = getAuth(app);
const messaging = getMessaging(app);

export { database, ref, push, onChildAdded, remove, auth, signInWithEmailAndPassword, onAuthStateChanged, signOut, messaging, getToken };
