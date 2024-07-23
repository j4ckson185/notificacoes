import { messaging, getToken, onMessage, auth, signInWithEmailAndPassword, onAuthStateChanged, signOut, database, ref, onChildAdded, remove, firestore, setDoc, doc } from './firebase-config.js';

const loginForm = document.getElementById('loginForm');
const logoutButton = document.getElementById('logoutButton');
const deleteAllButton = document.getElementById('deleteAllButton');
const authDiv = document.getElementById('auth');
const messagesSection = document.getElementById('messagesSection');
const messagesDiv = document.getElementById('messages');
const notificationSound = document.getElementById('notificationSound');

// Nome do motoboy fixo para Jackson
const motoboy = 'jackson_division_at_hotmail_com';

// Registrar o Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(registration => {
            console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch(error => {
            console.log('Falha ao registrar o Service Worker:', error);
        });
}

// Lógica de Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            loginForm.reset();
            requestNotificationPermission(email.replace('@', '_at_').replace('.', '_dot_'));
        })
        .catch((error) => {
            alert('Erro ao entrar: ' + error.message);
        });
});

// Lógica de Logout
logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        // Logout bem-sucedido
    }).catch((error) => {
        alert('Erro ao sair: ' + error.message);
    });
});

// Botão para apagar todas as mensagens
deleteAllButton.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja apagar todas as mensagens?')) {
        const messagesRef = ref
