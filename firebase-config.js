import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getFirestore, collection, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

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
const firestore = getFirestore(app);

async function saveTokenToDatabase(token, userId) {
    try {
        await setDoc(doc(firestore, 'tokens', userId), { token });
    } catch (error) {
        console.error('Erro ao salvar o token no Firestore:', error);
    }
}

async function requestPermission(userId) {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getToken(messaging, { vapidKey: 'BG1rGdXly1ZZLYgvdoo8M-yOxMULPxbt5f5WpbISG4XWChaV7AOyG4SjTsnSvAQlRI6Nwa5XurzTEvE8brQh01w' });
            if (token) {
                console.log('Token FCM:', token);
                await saveTokenToDatabase(token, userId);
            }
        } else {
            console.log('Permissão para notificações negada');
        }
    } catch (error) {
        console.error('Erro ao obter o token FCM:', error);
    }
}

export { app, messaging, getMessaging, getToken, onMessage, auth, signInWithEmailAndPassword, onAuthStateChanged, signOut, firestore, collection, doc, setDoc, requestPermission };
