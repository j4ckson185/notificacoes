import { auth, signInWithEmailAndPassword, onAuthStateChanged, signOut, firestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDatabase, ref, onChildAdded, set } from './firebase-config.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';

const loginForm = document.getElementById('loginForm');
const logoutButton = document.getElementById('logoutButton');
const authDiv = document.getElementById('auth');
const messagesSection = document.getElementById('messagesSection');
const messagesDiv = document.getElementById('messages');
const notificationSound = document.getElementById('notificationSound');

const messaging = getMessaging();
const database = getDatabase(); // Get the Realtime Database instance

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            loginForm.reset();
            requestPermission(userCredential.user.uid);
        })
        .catch((error) => {
            alert('Erro ao entrar: ' + error.message);
        });
});

logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('Logout bem-sucedido');
    }).catch((error) => {
        alert('Erro ao sair: ' + error.message);
    });
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        authDiv.style.display = 'none';
        messagesSection.style.display = 'block';
        loadMessages(user.uid);
    } else {
        authDiv.style.display = 'block';
        messagesSection.style.display = 'none';
    }
});

function loadMessages(userId) {
    const messagesRef = ref(database, `messages/${userId}`);
    messagesDiv.innerHTML = '';
    onChildAdded(messagesRef, (snapshot) => {
        const message = snapshot.val().text;
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messagesDiv.appendChild(messageElement);
        playNotificationSound();
    });
}

function playNotificationSound() {
    notificationSound.currentTime = 0;
    const playPromise = notificationSound.play();
    if (playPromise !== undefined) {
        playPromise.catch((error) => {
            console.error('Erro ao reproduzir o som de notificação:', error);
        });
    }
}

window.addEventListener('load', () => {
    notificationSound.play().catch((error) => {
        console.log('Erro ao preparar o som de notificação:', error);
    });
});

function requestPermission(userId) {
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            getToken(messaging, { vapidKey: 'BG1rGdXly1ZZLYgvdoo8M-yOxMULPxbt5f5WpbISG4XWChaV7AOyG4SjTsnSvAQlRI6Nwa5XurzTEvE8brQh01w' }).then((currentToken) => {
                if (currentToken) {
                    console.log('Token gerado: ', currentToken);
                    // Salve o token no Firestore
                    setDoc(doc(firestore, 'tokens', userId), {
                        uid: userId,
                        token: currentToken
                    });
                } else {
                    console.log('Nenhum token disponível. Solicite permissão para gerar um token.');
                }
            }).catch((err) => {
                console.log('Erro ao recuperar o token: ', err);
            });
        } else {
            console.log('Permissão de notificação negada.');
        }
    });
}

// Configuração para receber mensagens em segundo plano
onMessage(messaging, (payload) => {
    console.log('Mensagem recebida em segundo plano: ', payload);
    playNotificationSound();
    const newMessage = document.createElement('div');
    newMessage.textContent
