import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getDatabase, ref, push, onChildAdded, remove, set, onValue } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyB-pF2lRStLTN9Xw9aYQj962qdNFyUXI2E", // Replace with your actual API key
    authDomain: "cabana-8d55e.firebaseapp.com", // Replace with your actual auth domain
    projectId: "cabana-8d55e", // Replace with your actual project ID
    storageBucket: "cabana-8d55e.appspot.com", // Replace with your actual storage bucket
    messagingSenderId: "706144237954", // Replace with your actual messaging sender ID
    appId: "1:706144237954:web:345c10370972486afc779b", // Replace with your actual app ID
    databaseURL: "https://cabana-8d55e-default-rtdb.firebaseio.com" // Replace with your actual database URL
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

export { 
    app, 
    messaging, 
    getMessaging, 
    getToken, 
    onMessage,
    auth, 
    getAuth, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    set, 
    database, 
    getDatabase, 
    ref, 
    push, 
    onChildAdded, 
    remove, 
    firestore, 
    getFirestore, 
    collection, 
    getDocs, 
    setDoc, 
    doc, 
    deleteDoc, 
    onSnapshot,
    onValue
};
