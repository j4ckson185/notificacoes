import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

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

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Firebase services after initialization
const messaging = getMessaging(app);
const auth = getAuth(app);
const database = getDatabase(app);

// Export the signOut function
export { messaging, getToken, onMessage, auth, signInWithEmailAndPassword, onAuthStateChanged, database, getDatabase, ref, set, onValue, signOut };
