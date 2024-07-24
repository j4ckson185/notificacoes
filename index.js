import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

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

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get FCM token
        const currentToken = await getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY' });
        if (currentToken) {
            // Save token to database
            const sanitizedEmail = email.replace('.', '_at_');
            await set(ref(database, 'tokens/' + sanitizedEmail), {
                token: currentToken,
                uid: user.uid
            });

            // Redirect to the specific page
            window.location.href = emailToPage(email);
        } else {
            console.log('No registration token available.');
        }
    } catch (error) {
        console.error('Error signing in:', error);
    }
});

function emailToPage(email) {
    const emailMap = {
        'joaofmarcelino1@gmail.com': 'joaofelipe.html',
        'giovanni.silva18@gmail.com': 'geovane.html',
        'moises110723@gmail.com': 'moises.html',
        'felipeaugusto02001@gmail.com': 'felipeaugusto.html',
        'gurgel6901@icloud.com': 'pedro.html',
        'jackson_division@hotmail.com': 'jackson.html'
    };
    return emailMap[email] || 'default.html';
}

navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration);
    })
    .catch((err) => {
        console.error('Erro ao registrar o Service Worker:', err);
    });

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = emailToPage(user.email);
    }
});
