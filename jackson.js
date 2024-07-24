import { getDatabase, ref, onValue, getMessaging, getToken, onMessage } from './firebase-config.js';

const messagesContainer = document.getElementById('messages-container');

// Referência para o nó "messages" no Realtime Database
const messagesRef = ref(getDatabase(), 'messages');

// Ouvir por mudanças no nó "messages"
onValue(messagesRef, (snapshot) => {
    // Limpar o conteúdo do container de mensagens
    messagesContainer.innerHTML = '';

    // Iterar sobre os filhos do nó "messages"
    snapshot.forEach((childSnapshot) => {
        const messageData = childSnapshot.val();
        const messageElement = document.createElement('div');
        messageElement.textContent = messageData.text;
        messagesContainer.appendChild(messageElement);
    });
});

// Ouvir por mensagens FCM
onMessage(messaging, (payload) => {
    const messageData = payload.data;
    const messageElement = document.createElement('div');
    messageElement.textContent = messageData.text;
    messagesContainer.appendChild(messageElement);
});

// Obter o token FCM
getToken(messaging).then((currentToken) => {
    if (currentToken) {
        // Enviar o token para o servidor para salvar no Realtime Database
        // ...
    } else {
        // Mostrar uma mensagem de erro
        console.error('Erro ao obter o token FCM.');
    }
});

firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

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

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://i.ibb.co/jZ6rbSp/logo-cabana.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

