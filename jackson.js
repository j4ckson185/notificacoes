import { auth, signInWithEmailAndPassword, onAuthStateChanged, signOut, firestore, collection, doc, getToken, requestPermission } from './firebase-config.js';

const loginForm = document.getElementById('loginForm');
const logoutButton = document.getElementById('logoutButton');
const authDiv = document.getElementById('auth');
const messagesSection = document.getElementById('messagesSection');
const messagesDiv = document.getElementById('messages');
const notificationSound = document.getElementById('notificationSound');

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
    const messagesRef = collection(firestore, `messages/${userId}`);
    messagesDiv.innerHTML = '';
    onSnapshot(messagesRef, (snapshot) => {
        snapshot.forEach((doc) => {
            const message = doc.data().text;
            const messageElement = document.createElement('div');
            messageElement.textContent = message;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.addEventListener('click', () => {
                deleteDoc(doc(firestore, `messages/${userId}/${doc.id}`));
            });

            messageElement.appendChild(deleteButton);
            messagesDiv.appendChild(messageElement);

            playNotificationSound();
        });
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

// Configuração para receber mensagens em segundo plano
import { getMessaging, onMessage } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js';

const messaging = getMessaging();

onMessage(messaging, (payload) => {
    console.log('Mensagem recebida em segundo plano: ', payload);
    playNotificationSound();
    const newMessage = document.createElement('div');
    newMessage.textContent = payload.notification.body;
    messagesDiv.appendChild(newMessage);
});
