// firebase-config.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getMessaging } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';

// Sua configuração do Firebase
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar os serviços necessários
export const auth = getAuth(app);
export const database = getDatabase(app);
export const messaging = getMessaging(app);
