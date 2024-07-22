import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getDatabase, ref, push, onChildAdded, remove, set } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

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
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const token = await getToken(messaging, { vapidKey: 'BG1rGdXly1ZZLYgvdoo8M-yOxMULPxbt5f5WpbISG4XWChaV7AOyG4SjTsnSvAQlRI6Nwa5XurzTEvE8brQh01w' });
        await addDoc(collection(db, 'tokens'), {
            uid: user.uid,
            token: token
        });
    }
});

export { messaging, auth, signInWithEmailAndPassword, onAuthStateChanged, signOut, set, database, ref, push, onChildAdded, remove, db, collection };
