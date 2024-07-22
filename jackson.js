import { auth, onAuthStateChanged, signOut, database, ref, onChildAdded, remove } from './firebase-config.js';

const logoutButton = document.getElementById('logoutButton');
const deleteAllButton = document.getElementById('deleteAllButton');
const messagesSection = document.getElementById('messagesSection');
const messagesDiv = document.getElementById('messages');
const notificationSound = document.getElementById('notificationSound');

// Nome do motoboy fixo para Jackson
const motoboy = 'jackson';

// Verifica o estado de autenticação do usuário
onAuthStateChanged(auth, (user) => {
    if (user) {
        messagesSection.style.display = 'block';
        loadMessages();
    } else {
        window.location.href = 'index.html';
    }
});

// Lógica de Logout
logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        alert('Erro ao sair: ' + error.message);
    });
});

// Botão para apagar todas as mensagens
deleteAllButton.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja apagar todas as mensagens?')) {
        const messagesRef = ref(database, `messages/${motoboy}`);
        remove(messagesRef).then(() => {
            messagesDiv.innerHTML = '';
        }).catch((error) => {
            alert('Erro ao apagar mensagens: ' + error.message);
        });
    }
});

// Função para carregar as mensagens
function loadMessages() {
    const messagesRef = ref(database, `messages/${motoboy}`);
    messagesDiv.innerHTML = '';
    onChildAdded(messagesRef, (data) => {
        const message = data.val().text;
        const messageElement = document.createElement('div');
        messageElement.textContent = message;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', () => {
            remove(ref(database, `messages/${motoboy}/${data.key}`));
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

// Solicitar permissão para notificações
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Permissão para notificações concedida.');
                // Obter token FCM
                getTokenFCM();
            }
        });
    }
}

// Obter token FCM
function getTokenFCM() {
    const messaging = firebase.messaging();
    messaging.getToken({ vapidKey: 'BG1rGdXly1ZZLYgvdoo8M-yOxMULPxbt5f5WpbISG4XWChaV7AOyG4SjTsnSvAQlRI6Nwa5XurzTEvE8brQh01w' })
        .then((currentToken) => {
            if (currentToken) {
                console.log('Token FCM:', currentToken);
                saveToken(currentToken);
            } else {
                console.log('Nenhum token de registro disponível. Solicite permissão para gerar um.');
            }
        })
        .catch((err) => {
            console.log('Erro ao obter o token FCM:', err);
        });
}

// Salvar token FCM no banco de dados
function saveToken(token) {
    const tokenRef = ref(database, `tokens/${motoboy}`);
    set(tokenRef, {
        token: token
    }).then(() => {
        console.log('Token salvo com sucesso.');
    }).catch((error) => {
        console.error('Erro ao salvar o token:', error);
    });
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

// Preparar o som para tocar
window.addEventListener('load', () => {
    notificationSound.play().catch(error => {
        console.log('Erro ao preparar o som de notificação:', error);
    });
});
