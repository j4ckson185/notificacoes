import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getMessaging, onMessage, getToken } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getDatabase, ref, onChildAdded } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

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

function loadMessages(email) {
    const sanitizedEmail = email.replace(".", "_at_");
    const messagesRef = ref(database, `messages/${sanitizedEmail}`);
    onChildAdded(messagesRef, (data) => {
        const message = data.val().text;
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        document.getElementById('messages').appendChild(messageElement);
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        const email = user.email;
        loadMessages(email);
    } else {
        console.log('Usuário não autenticado');
    }
});

navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration);
        return getToken(messaging, { vapidKey: 'BG1rGdXly1ZZLYgvdoo8M-yOxMULPxbt5f5WpbISG4XWChaV7AOyG4SjTsnSvAQlRI6Nwa5XurzTEvE8brQh01w' });
    })
    .then((currentToken) => {
        if (currentToken) {
            console.log('Token FCM:', currentToken);
        } else {
            console.log('Nenhum token disponível.');
        }
    })
    .catch((err) => {
        console.error('Erro ao registrar o Service Worker ou obter o token FCM:', err);
    });

onMessage(messaging, (payload) => {
    console.log('Mensagem recebida em primeiro plano:', payload);
    showNotification(payload.notification);
});

function showNotification(notification) {
    const options = {
        body: notification.body,
        icon: notification.icon
    };
    new Notification(notification.title, options);
}
