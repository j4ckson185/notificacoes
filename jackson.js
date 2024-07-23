import { app, messaging, auth, getMessaging, getAuth, getDatabase, ref, onChildAdded, remove } from './firebase-config.js';

const loginForm = document.getElementById('loginForm');
const logoutButton = document.getElementById('logoutButton');
const deleteAllButton = document.getElementById('deleteAllButton');
const authDiv = document.getElementById('auth');
const messagesSection = document.getElementById('messagesSection');
const messagesDiv = document.getElementById('messages');
const notificationSound = document.getElementById('notificationSound');

// Nome do motoboy fixo para Jackson
const motoboy = 'jackson';

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

// Verifica o estado de autenticação do usuário
onAuthStateChanged(auth, (user) => {
    if (user) {
        authDiv.style.display = 'none';
        messagesSection.style.display = 'block';
        loadMessages();
    } else {
        authDiv.style.display = 'block';
        messagesSection.style.display = 'none';
    }
});

// Função para carregar as mensagens
function loadMessages() {
    const messagesRef = ref(getDatabase(app), `messages/${motoboy}`);
    messagesDiv.innerHTML = '';
    onChildAdded(messagesRef, (data) => {
        const message = data.val().text;
        const messageElement = document.createElement('div');
        messageElement.textContent = message;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', () => {
            remove(ref(getDatabase(app), `messages/${motoboy}/${data.key}`));
        });

        messageElement.appendChild(deleteButton);
        messagesDiv.appendChild(messageElement);

        // Mostrar notificação e tocar som
        showNotification(message);
    });
}

// Função para tocar o som de notificação
function playNotificationSound() {
    notificationSound.currentTime = 0; // Rewind to start
    const playPromise = notificationSound.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.error('Erro ao reproduzir o som de notificação:', error);
        });
    }
}

// Mostrar notificação e tocar som
function showNotification(message) {
    if ('Notification' in window && navigator.serviceWorker) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('Nova mensagem', {
                body: message,
                tag: 'new-message',
                icon: 'https://i.ibb.co/jZ6rbSp/logo-cabana.png'
            });

            // Tocar o som após mostrar a notificação
            playNotificationSound();
        });
    }
}

messaging.onMessage((payload) => {
    console.log('Mensagem recebida em primeiro plano:', payload);
    const { title, body } = payload.notification;
    showNotification(`${title}: ${body}`);
});
